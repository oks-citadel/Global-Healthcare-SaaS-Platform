import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createComment(
    tenantId: string,
    dto: {
      postId: string;
      authorId: string;
      content: string;
      parentId?: string;
    },
  ) {
    const comment = {
      id: uuidv4(),
      tenantId,
      postId: dto.postId,
      authorId: dto.authorId,
      content: dto.content,
      parentId: dto.parentId || null,
      likeCount: 0,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.redis.set(`comment:${comment.id}`, JSON.stringify(comment), 86400);

    // Add to post's comment list
    const listKey = dto.parentId
      ? `comment:${dto.parentId}:replies`
      : `post:${dto.postId}:comments`;
    await this.redis.zadd(listKey, Date.now(), comment.id);

    // Increment post comment count
    await this.redis.incr(`post:${dto.postId}:commentCount`);

    return { success: true, data: comment };
  }

  async getComments(
    tenantId: string,
    postId: string,
    options: { page?: number; limit?: number },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const listKey = `post:${postId}:comments`;
    const commentIds = await this.redis.zrevrange(listKey, start, end);

    const comments = [];
    for (const id of commentIds) {
      const cached = await this.redis.get(`comment:${id}`);
      if (cached) {
        const comment = JSON.parse(cached);
        if (comment.tenantId === tenantId) {
          comments.push(comment);
        }
      }
    }

    return {
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        hasMore: commentIds.length === limit,
      },
    };
  }

  async getComment(tenantId: string, id: string) {
    const cached = await this.redis.get(`comment:${id}`);
    if (!cached) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    const comment = JSON.parse(cached);
    if (comment.tenantId !== tenantId) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    return { success: true, data: comment };
  }

  async updateComment(
    tenantId: string,
    id: string,
    dto: { content: string },
  ) {
    const cached = await this.redis.get(`comment:${id}`);
    if (!cached) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    const comment = JSON.parse(cached);
    if (comment.tenantId !== tenantId) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    const updatedComment = {
      ...comment,
      content: dto.content,
      isEdited: true,
      updatedAt: new Date(),
    };

    await this.redis.set(`comment:${id}`, JSON.stringify(updatedComment), 86400);

    return { success: true, data: updatedComment };
  }

  async deleteComment(tenantId: string, id: string) {
    const cached = await this.redis.get(`comment:${id}`);
    if (!cached) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    const comment = JSON.parse(cached);
    if (comment.tenantId !== tenantId) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    await this.redis.del(`comment:${id}`);

    return { success: true };
  }

  async getReplies(
    tenantId: string,
    parentId: string,
    options: { page?: number; limit?: number },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const listKey = `comment:${parentId}:replies`;
    const replyIds = await this.redis.zrevrange(listKey, start, end);

    const replies = [];
    for (const id of replyIds) {
      const cached = await this.redis.get(`comment:${id}`);
      if (cached) {
        const reply = JSON.parse(cached);
        if (reply.tenantId === tenantId) {
          replies.push(reply);
        }
      }
    }

    return {
      success: true,
      data: replies,
      pagination: {
        page,
        limit,
        hasMore: replyIds.length === limit,
      },
    };
  }
}
