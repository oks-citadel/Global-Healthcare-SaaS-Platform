/**
 * Unified Health Support System
 *
 * Provides ticketing, customer service tools, and admin support capabilities.
 * Integrates with Zendesk, Intercom, or can work standalone.
 */

import axios, { AxiosInstance } from "axios";
import { z } from "zod";

// ============================================================================
// Types & Schemas
// ============================================================================

export const TicketPrioritySchema = z.enum(["low", "normal", "high", "urgent"]);
export type TicketPriority = z.infer<typeof TicketPrioritySchema>;

export const TicketStatusSchema = z.enum([
  "new",
  "open",
  "pending",
  "on_hold",
  "solved",
  "closed",
]);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

export const TicketCategorySchema = z.enum([
  "billing",
  "technical",
  "account",
  "appointments",
  "telehealth",
  "general",
  "feedback",
  "compliance",
]);
export type TicketCategory = z.infer<typeof TicketCategorySchema>;

export interface Ticket {
  id: string;
  externalId?: string; // Zendesk/Intercom ID
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  userId: string;
  userEmail: string;
  userName: string;
  assigneeId?: string;
  assigneeName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  firstResponseAt?: string;
  comments: TicketComment[];
  metadata: Record<string, any>;
}

export interface TicketComment {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorType: "user" | "agent" | "system";
  isPublic: boolean;
  createdAt: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
  }>;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  priority?: TicketPriority;
  category: TicketCategory;
  userId: string;
  userEmail: string;
  userName: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TicketSearchOptions {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  userId?: string;
  assigneeId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  query?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Support Ticket Service
// ============================================================================

export interface SupportServiceConfig {
  provider: "zendesk" | "intercom" | "internal";
  apiKey?: string;
  subdomain?: string;
  internalApiUrl?: string;
}

export class SupportTicketService {
  private config: SupportServiceConfig;
  private client?: AxiosInstance;

  constructor(config: SupportServiceConfig) {
    this.config = config;

    if (config.provider === "zendesk" && config.apiKey && config.subdomain) {
      this.client = axios.create({
        baseURL: `https://${config.subdomain}.zendesk.com/api/v2`,
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      });
    } else if (config.provider === "intercom" && config.apiKey) {
      this.client = axios.create({
        baseURL: "https://api.intercom.io",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }
  }

  /**
   * Create a new support ticket
   */
  async createTicket(input: CreateTicketInput): Promise<Ticket> {
    if (this.config.provider === "zendesk") {
      return this.createZendeskTicket(input);
    } else if (this.config.provider === "intercom") {
      return this.createIntercomConversation(input);
    }
    return this.createInternalTicket(input);
  }

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId: string): Promise<Ticket | null> {
    if (this.config.provider === "zendesk") {
      return this.getZendeskTicket(ticketId);
    } else if (this.config.provider === "intercom") {
      return this.getIntercomConversation(ticketId);
    }
    return this.getInternalTicket(ticketId);
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
  ): Promise<Ticket> {
    if (this.config.provider === "zendesk") {
      return this.updateZendeskTicket(ticketId, { status });
    }
    return this.updateInternalTicket(ticketId, { status });
  }

  /**
   * Add comment to ticket
   */
  async addComment(
    ticketId: string,
    comment: {
      body: string;
      authorId: string;
      authorName: string;
      isPublic?: boolean;
    },
  ): Promise<TicketComment> {
    if (this.config.provider === "zendesk") {
      return this.addZendeskComment(ticketId, comment);
    }
    return this.addInternalComment(ticketId, comment);
  }

  /**
   * Search tickets
   */
  async searchTickets(options: TicketSearchOptions): Promise<{
    tickets: Ticket[];
    total: number;
    hasMore: boolean;
  }> {
    if (this.config.provider === "zendesk") {
      return this.searchZendeskTickets(options);
    }
    return this.searchInternalTickets(options);
  }

  /**
   * Get user's tickets
   */
  async getUserTickets(userId: string): Promise<Ticket[]> {
    const result = await this.searchTickets({ userId, limit: 100 });
    return result.tickets;
  }

  /**
   * Assign ticket to agent
   */
  async assignTicket(ticketId: string, assigneeId: string): Promise<Ticket> {
    if (this.config.provider === "zendesk") {
      return this.updateZendeskTicket(ticketId, { assignee_id: assigneeId });
    }
    return this.updateInternalTicket(ticketId, { assigneeId });
  }

  /**
   * Escalate ticket priority
   */
  async escalateTicket(ticketId: string, reason: string): Promise<Ticket> {
    const ticket = await this.getTicket(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const newPriority: TicketPriority =
      ticket.priority === "low"
        ? "normal"
        : ticket.priority === "normal"
          ? "high"
          : "urgent";

    await this.addComment(ticketId, {
      body: `Ticket escalated to ${newPriority} priority. Reason: ${reason}`,
      authorId: "system",
      authorName: "System",
      isPublic: false,
    });

    if (this.config.provider === "zendesk") {
      return this.updateZendeskTicket(ticketId, { priority: newPriority });
    }
    return this.updateInternalTicket(ticketId, { priority: newPriority });
  }

  // ============================================================================
  // Zendesk Implementation
  // ============================================================================

  private async createZendeskTicket(input: CreateTicketInput): Promise<Ticket> {
    if (!this.client) throw new Error("Zendesk client not configured");

    const response = await this.client.post("/tickets.json", {
      ticket: {
        subject: input.subject,
        description: input.description,
        priority: input.priority || "normal",
        type: "question",
        requester: {
          email: input.userEmail,
          name: input.userName,
        },
        tags: [...(input.tags || []), input.category],
        custom_fields: [
          { id: "user_id", value: input.userId },
          { id: "category", value: input.category },
        ],
      },
    });

    return this.mapZendeskTicket(response.data.ticket);
  }

  private async getZendeskTicket(ticketId: string): Promise<Ticket | null> {
    if (!this.client) throw new Error("Zendesk client not configured");

    try {
      const response = await this.client.get(`/tickets/${ticketId}.json`);
      return this.mapZendeskTicket(response.data.ticket);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  private async updateZendeskTicket(
    ticketId: string,
    updates: Record<string, any>,
  ): Promise<Ticket> {
    if (!this.client) throw new Error("Zendesk client not configured");

    const response = await this.client.put(`/tickets/${ticketId}.json`, {
      ticket: updates,
    });

    return this.mapZendeskTicket(response.data.ticket);
  }

  private async addZendeskComment(
    ticketId: string,
    comment: {
      body: string;
      authorId: string;
      authorName: string;
      isPublic?: boolean;
    },
  ): Promise<TicketComment> {
    if (!this.client) throw new Error("Zendesk client not configured");

    const response = await this.client.put(`/tickets/${ticketId}.json`, {
      ticket: {
        comment: {
          body: comment.body,
          public: comment.isPublic ?? true,
        },
      },
    });

    const comments = response.data.ticket.comments || [];
    const lastComment = comments[comments.length - 1];

    return {
      id: lastComment.id.toString(),
      body: lastComment.body,
      authorId: comment.authorId,
      authorName: comment.authorName,
      authorType: "agent",
      isPublic: comment.isPublic ?? true,
      createdAt: lastComment.created_at,
    };
  }

  private async searchZendeskTickets(options: TicketSearchOptions): Promise<{
    tickets: Ticket[];
    total: number;
    hasMore: boolean;
  }> {
    if (!this.client) throw new Error("Zendesk client not configured");

    const queryParts: string[] = [];

    if (options.status?.length) {
      queryParts.push(`status:${options.status.join(",")}`);
    }
    if (options.priority?.length) {
      queryParts.push(`priority:${options.priority.join(",")}`);
    }
    if (options.query) {
      queryParts.push(options.query);
    }

    const response = await this.client.get("/search.json", {
      params: {
        query: `type:ticket ${queryParts.join(" ")}`,
        per_page: options.limit || 25,
        page: Math.floor((options.offset || 0) / (options.limit || 25)) + 1,
      },
    });

    return {
      tickets: response.data.results.map(this.mapZendeskTicket),
      total: response.data.count,
      hasMore: response.data.next_page !== null,
    };
  }

  private mapZendeskTicket(zendeskTicket: any): Ticket {
    return {
      id: zendeskTicket.id.toString(),
      externalId: zendeskTicket.id.toString(),
      subject: zendeskTicket.subject,
      description: zendeskTicket.description,
      status: zendeskTicket.status as TicketStatus,
      priority: zendeskTicket.priority as TicketPriority,
      category: (zendeskTicket.tags?.find((t: string) =>
        [
          "billing",
          "technical",
          "account",
          "appointments",
          "telehealth",
          "general",
          "feedback",
          "compliance",
        ].includes(t),
      ) || "general") as TicketCategory,
      userId:
        zendeskTicket.custom_fields?.find((f: any) => f.id === "user_id")
          ?.value || "",
      userEmail: zendeskTicket.requester?.email || "",
      userName: zendeskTicket.requester?.name || "",
      assigneeId: zendeskTicket.assignee_id?.toString(),
      tags: zendeskTicket.tags || [],
      createdAt: zendeskTicket.created_at,
      updatedAt: zendeskTicket.updated_at,
      comments: [],
      metadata: {},
    };
  }

  // ============================================================================
  // Intercom Implementation
  // ============================================================================

  private async createIntercomConversation(
    input: CreateTicketInput,
  ): Promise<Ticket> {
    if (!this.client) throw new Error("Intercom client not configured");

    const response = await this.client.post("/conversations", {
      from: {
        type: "user",
        email: input.userEmail,
      },
      body: `**${input.subject}**\n\n${input.description}`,
    });

    return this.mapIntercomConversation(response.data, input);
  }

  private async getIntercomConversation(
    conversationId: string,
  ): Promise<Ticket | null> {
    if (!this.client) throw new Error("Intercom client not configured");

    try {
      const response = await this.client.get(
        `/conversations/${conversationId}`,
      );
      return this.mapIntercomConversation(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  private mapIntercomConversation(
    conversation: any,
    input?: CreateTicketInput,
  ): Ticket {
    return {
      id: conversation.id,
      externalId: conversation.id,
      subject:
        input?.subject || conversation.source?.subject || "Support Request",
      description: input?.description || conversation.source?.body || "",
      status: conversation.state === "closed" ? "closed" : "open",
      priority: "normal",
      category: input?.category || "general",
      userId: input?.userId || conversation.contacts?.contacts?.[0]?.id || "",
      userEmail:
        input?.userEmail || conversation.contacts?.contacts?.[0]?.email || "",
      userName:
        input?.userName || conversation.contacts?.contacts?.[0]?.name || "",
      tags: conversation.tags?.tags?.map((t: any) => t.name) || [],
      createdAt: new Date(conversation.created_at * 1000).toISOString(),
      updatedAt: new Date(conversation.updated_at * 1000).toISOString(),
      comments: [],
      metadata: {},
    };
  }

  // ============================================================================
  // Internal Implementation (Standalone)
  // ============================================================================

  private internalTickets: Map<string, Ticket> = new Map();
  private ticketCounter = 1;

  private async createInternalTicket(
    input: CreateTicketInput,
  ): Promise<Ticket> {
    const ticket: Ticket = {
      id: `TICKET-${this.ticketCounter++}`,
      subject: input.subject,
      description: input.description,
      status: "new",
      priority: input.priority || "normal",
      category: input.category,
      userId: input.userId,
      userEmail: input.userEmail,
      userName: input.userName,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      metadata: input.metadata || {},
    };

    this.internalTickets.set(ticket.id, ticket);
    return ticket;
  }

  private async getInternalTicket(ticketId: string): Promise<Ticket | null> {
    return this.internalTickets.get(ticketId) || null;
  }

  private async updateInternalTicket(
    ticketId: string,
    updates: Partial<Ticket>,
  ): Promise<Ticket> {
    const ticket = this.internalTickets.get(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.internalTickets.set(ticketId, updatedTicket);
    return updatedTicket;
  }

  private async addInternalComment(
    ticketId: string,
    comment: {
      body: string;
      authorId: string;
      authorName: string;
      isPublic?: boolean;
    },
  ): Promise<TicketComment> {
    const ticket = this.internalTickets.get(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const newComment: TicketComment = {
      id: `COMMENT-${Date.now()}`,
      body: comment.body,
      authorId: comment.authorId,
      authorName: comment.authorName,
      authorType: "agent",
      isPublic: comment.isPublic ?? true,
      createdAt: new Date().toISOString(),
    };

    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();
    this.internalTickets.set(ticketId, ticket);

    return newComment;
  }

  private async searchInternalTickets(options: TicketSearchOptions): Promise<{
    tickets: Ticket[];
    total: number;
    hasMore: boolean;
  }> {
    let tickets = Array.from(this.internalTickets.values());

    // Apply filters
    if (options.status?.length) {
      tickets = tickets.filter((t) => options.status!.includes(t.status));
    }
    if (options.priority?.length) {
      tickets = tickets.filter((t) => options.priority!.includes(t.priority));
    }
    if (options.category?.length) {
      tickets = tickets.filter((t) => options.category!.includes(t.category));
    }
    if (options.userId) {
      tickets = tickets.filter((t) => t.userId === options.userId);
    }
    if (options.assigneeId) {
      tickets = tickets.filter((t) => t.assigneeId === options.assigneeId);
    }
    if (options.query) {
      const query = options.query.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.subject.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query),
      );
    }

    // Sort by created date descending
    tickets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = tickets.length;
    const offset = options.offset || 0;
    const limit = options.limit || 25;
    tickets = tickets.slice(offset, offset + limit);

    return {
      tickets,
      total,
      hasMore: offset + limit < total,
    };
  }
}

// ============================================================================
// SLA Tracking
// ============================================================================

export interface SLAPolicy {
  name: string;
  priority: TicketPriority;
  firstResponseMinutes: number;
  resolutionMinutes: number;
}

export const DEFAULT_SLA_POLICIES: SLAPolicy[] = [
  {
    name: "Urgent",
    priority: "urgent",
    firstResponseMinutes: 15,
    resolutionMinutes: 240,
  },
  {
    name: "High",
    priority: "high",
    firstResponseMinutes: 60,
    resolutionMinutes: 480,
  },
  {
    name: "Normal",
    priority: "normal",
    firstResponseMinutes: 480,
    resolutionMinutes: 1440,
  },
  {
    name: "Low",
    priority: "low",
    firstResponseMinutes: 1440,
    resolutionMinutes: 4320,
  },
];

export function calculateSLAStatus(
  ticket: Ticket,
  policies: SLAPolicy[] = DEFAULT_SLA_POLICIES,
): {
  firstResponseSLA: { target: Date; breached: boolean; remaining: number };
  resolutionSLA: { target: Date; breached: boolean; remaining: number };
} {
  const policy = policies.find((p) => p.priority === ticket.priority);
  if (!policy) {
    throw new Error(`No SLA policy for priority: ${ticket.priority}`);
  }

  const createdAt = new Date(ticket.createdAt);
  const now = new Date();

  const firstResponseTarget = new Date(
    createdAt.getTime() + policy.firstResponseMinutes * 60 * 1000,
  );
  const resolutionTarget = new Date(
    createdAt.getTime() + policy.resolutionMinutes * 60 * 1000,
  );

  const firstResponseBreached = ticket.firstResponseAt
    ? new Date(ticket.firstResponseAt) > firstResponseTarget
    : now > firstResponseTarget;

  const resolutionBreached = ticket.resolvedAt
    ? new Date(ticket.resolvedAt) > resolutionTarget
    : now > resolutionTarget;

  return {
    firstResponseSLA: {
      target: firstResponseTarget,
      breached: firstResponseBreached,
      remaining: Math.max(0, firstResponseTarget.getTime() - now.getTime()),
    },
    resolutionSLA: {
      target: resolutionTarget,
      breached: resolutionBreached,
      remaining: Math.max(0, resolutionTarget.getTime() - now.getTime()),
    },
  };
}

// ============================================================================
// Exports
// ============================================================================

export default SupportTicketService;
