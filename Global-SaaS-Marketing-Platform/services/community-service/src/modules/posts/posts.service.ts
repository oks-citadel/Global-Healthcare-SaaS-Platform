import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
  TrendingQueryDto,
} from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createPost(tenantId: string, dto: CreatePostDto): Promise<PostResponseDto> {
    const post = {
      id: uuidv4(),
      tenantId,
      authorId: dto.authorId,
      title: dto.title,
      content: dto.content,
      category: dto.category,
      tags: dto.tags || [],
      status: dto.status || 'published',
      isPinned: dto.isPinned || false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in database (would use Prisma in real implementation)
    await this.redis.set(`post:${post.id}`, JSON.stringify(post), 86400);

    // Update trending scores
    if (post.status === 'published') {
      await this.updateTrendingScore(tenantId, post);
    }

    return this.mapToResponse(post);
  }

  async getPosts(
    tenantId: string,
    query: PostQueryDto,
  ): Promise<{ data: PostResponseDto[]; pagination: any }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    // In real implementation, this would query the database
    // For now, return mock data structure
    const posts: any[] = [];
    const total = 0;

    return {
      data: posts.map(this.mapToResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPost(tenantId: string, id: string): Promise<PostResponseDto> {
    const cached = await this.redis.get(`post:${id}`);
    if (cached) {
      const post = JSON.parse(cached);
      if (post.tenantId === tenantId) {
        // Increment view count
        post.viewCount++;
        await this.redis.set(`post:${id}`, JSON.stringify(post), 86400);
        return this.mapToResponse(post);
      }
    }

    throw new NotFoundException(`Post ${id} not found`);
  }

  async updatePost(
    tenantId: string,
    id: string,
    dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const cached = await this.redis.get(`post:${id}`);
    if (!cached) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    const post = JSON.parse(cached);
    if (post.tenantId !== tenantId) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    const updatedPost = {
      ...post,
      ...dto,
      updatedAt: new Date(),
    };

    await this.redis.set(`post:${id}`, JSON.stringify(updatedPost), 86400);
    return this.mapToResponse(updatedPost);
  }

  async deletePost(tenantId: string, id: string): Promise<{ success: boolean }> {
    const cached = await this.redis.get(`post:${id}`);
    if (!cached) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    const post = JSON.parse(cached);
    if (post.tenantId !== tenantId) {
      throw new NotFoundException(`Post ${id} not found`);
    }

    await this.redis.del(`post:${id}`);
    return { success: true };
  }

  async getTrending(
    tenantId: string,
    query: TrendingQueryDto,
  ): Promise<{ topics: any[]; posts: PostResponseDto[] }> {
    const limit = query.limit || 10;
    const period = query.period || 'week';

    // Get trending post IDs from Redis sorted set
    const trendingKey = `trending:${tenantId}:${period}`;
    const trendingIds = await this.redis.zrevrange(trendingKey, 0, limit - 1);

    const posts: any[] = [];
    for (const id of trendingIds) {
      const cached = await this.redis.get(`post:${id}`);
      if (cached) {
        posts.push(JSON.parse(cached));
      }
    }

    // Extract trending topics from posts
    const topicCounts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags || []) {
        topicCounts.set(tag, (topicCounts.get(tag) || 0) + 1);
      }
    }

    const topics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      topics,
      posts: posts.map(this.mapToResponse),
    };
  }

  private async updateTrendingScore(tenantId: string, post: any): Promise<void> {
    const score = this.calculateTrendingScore(post);
    const periods = ['day', 'week', 'month'];

    for (const period of periods) {
      const key = `trending:${tenantId}:${period}`;
      await this.redis.zadd(key, score, post.id);
    }
  }

  private calculateTrendingScore(post: any): number {
    const now = Date.now();
    const ageHours = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    const engagement = post.likeCount * 2 + post.commentCount * 3 + post.shareCount * 5;

    // Decay score based on age
    return engagement / Math.pow(ageHours + 2, 1.5);
  }

  private mapToResponse(post: any): PostResponseDto {
    return {
      id: post.id,
      authorId: post.authorId,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      status: post.status,
      isPinned: post.isPinned,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: post.shareCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
