import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VersionService {
  private readonly logger = new Logger(VersionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new version for a content page
   */
  async createVersion(pageId: string, userId: string, changeMessage?: string) {
    // Get current page state
    const page = await this.prisma.contentPage.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException(`Content page not found: ${pageId}`);
    }

    // Get the last version to calculate diff
    const lastVersion = await this.prisma.contentVersion.findFirst({
      where: { pageId },
      orderBy: { versionNumber: 'desc' },
    });

    // Calculate diff if there's a previous version
    let diff: Prisma.InputJsonValue | null = null;
    if (lastVersion) {
      diff = this.calculateDiff(lastVersion, page) as Prisma.InputJsonValue;
    }

    // Create new version
    const version = await this.prisma.contentVersion.create({
      data: {
        pageId,
        versionNumber: page.versionNumber,
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        content: page.content as Prisma.InputJsonValue,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        featuredImage: page.featuredImage,
        changeMessage,
        createdBy: userId,
        diff,
      },
    });

    // Update page's current version reference
    await this.prisma.contentPage.update({
      where: { id: pageId },
      data: { currentVersionId: version.id },
    });

    this.logger.log(`Created version ${version.versionNumber} for page ${pageId}`);

    return version;
  }

  /**
   * Get version history for a page
   */
  async getVersionHistory(pageId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [versions, total] = await Promise.all([
      this.prisma.contentVersion.findMany({
        where: { pageId },
        orderBy: { versionNumber: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          versionNumber: true,
          title: true,
          changeMessage: true,
          createdBy: true,
          createdAt: true,
        },
      }),
      this.prisma.contentVersion.count({ where: { pageId } }),
    ]);

    return {
      data: versions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a specific version
   */
  async getVersion(pageId: string, versionNumber: number) {
    const version = await this.prisma.contentVersion.findUnique({
      where: {
        pageId_versionNumber: { pageId, versionNumber },
      },
    });

    if (!version) {
      throw new NotFoundException(
        `Version ${versionNumber} not found for page ${pageId}`,
      );
    }

    return version;
  }

  /**
   * Get version by ID
   */
  async getVersionById(id: string) {
    const version = await this.prisma.contentVersion.findUnique({
      where: { id },
    });

    if (!version) {
      throw new NotFoundException(`Version not found: ${id}`);
    }

    return version;
  }

  /**
   * Restore a page to a specific version
   */
  async restoreVersion(
    pageId: string,
    versionNumber: number,
    userId: string,
  ) {
    const version = await this.getVersion(pageId, versionNumber);

    // Update page with version content
    const page = await this.prisma.contentPage.update({
      where: { id: pageId },
      data: {
        title: version.title,
        slug: version.slug,
        excerpt: version.excerpt,
        content: version.content as Prisma.InputJsonValue,
        metaTitle: version.metaTitle,
        metaDescription: version.metaDescription,
        featuredImage: version.featuredImage,
        updatedBy: userId,
        versionNumber: { increment: 1 },
      },
    });

    // Create new version recording the restore
    await this.createVersion(
      pageId,
      userId,
      `Restored to version ${versionNumber}`,
    );

    this.logger.log(`Restored page ${pageId} to version ${versionNumber}`);

    return page;
  }

  /**
   * Compare two versions
   */
  async compareVersions(
    pageId: string,
    versionA: number,
    versionB: number,
  ) {
    const [verA, verB] = await Promise.all([
      this.getVersion(pageId, versionA),
      this.getVersion(pageId, versionB),
    ]);

    return {
      versionA: {
        versionNumber: verA.versionNumber,
        title: verA.title,
        content: verA.content,
        createdAt: verA.createdAt,
        createdBy: verA.createdBy,
      },
      versionB: {
        versionNumber: verB.versionNumber,
        title: verB.title,
        content: verB.content,
        createdAt: verB.createdAt,
        createdBy: verB.createdBy,
      },
      diff: this.calculateDiff(verA, verB),
    };
  }

  /**
   * Calculate diff between two versions/objects
   */
  private calculateDiff(oldObj: any, newObj: any): Record<string, any> {
    const diff: Record<string, any> = {};
    const fields = [
      'title',
      'slug',
      'excerpt',
      'content',
      'metaTitle',
      'metaDescription',
      'featuredImage',
    ];

    for (const field of fields) {
      const oldValue = oldObj[field];
      const newValue = newObj[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diff[field] = {
          old: oldValue,
          new: newValue,
        };
      }
    }

    return diff;
  }

  /**
   * Delete old versions (keep last N versions)
   */
  async pruneVersions(pageId: string, keepCount: number = 20) {
    const versions = await this.prisma.contentVersion.findMany({
      where: { pageId },
      orderBy: { versionNumber: 'desc' },
      skip: keepCount,
      select: { id: true },
    });

    if (versions.length === 0) {
      return 0;
    }

    const versionIds = versions.map((v) => v.id);

    await this.prisma.contentVersion.deleteMany({
      where: { id: { in: versionIds } },
    });

    this.logger.log(`Pruned ${versions.length} old versions for page ${pageId}`);

    return versions.length;
  }
}
