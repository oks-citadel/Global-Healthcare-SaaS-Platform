/**
 * Unified Health Knowledge Base System
 *
 * Provides a searchable FAQ and help article system with:
 * - Hierarchical categories
 * - Full-text search with fuzzy matching
 * - Markdown content support
 * - View tracking and analytics
 * - Localization support
 * - Role-based content visibility
 */

import Fuse from "fuse.js";
import { marked } from "marked";

// Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  locale: string;
  visibility: ArticleVisibility;
  status: ArticleStatus;
  authorId: string;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId?: string;
  icon?: string;
  order: number;
  locale: string;
  visibility: ArticleVisibility;
}

export type ArticleVisibility =
  | "public"
  | "authenticated"
  | "patient"
  | "provider"
  | "admin";
export type ArticleStatus = "draft" | "published" | "archived";

export interface SearchOptions {
  query: string;
  categoryId?: string;
  tags?: string[];
  locale?: string;
  visibility?: ArticleVisibility[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  articles: Article[];
  total: number;
  query: string;
  suggestions?: string[];
}

export interface FeedbackInput {
  articleId: string;
  userId?: string;
  helpful: boolean;
  comment?: string;
}

// Storage interface for dependency injection
export interface KnowledgeBaseStorage {
  getArticle(id: string): Promise<Article | null>;
  getArticleBySlug(slug: string, locale?: string): Promise<Article | null>;
  getArticles(
    filters: Partial<Article>,
    pagination: { limit: number; offset: number },
  ): Promise<{ articles: Article[]; total: number }>;
  createArticle(
    article: Omit<
      Article,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "viewCount"
      | "helpfulCount"
      | "notHelpfulCount"
    >,
  ): Promise<Article>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
  getCategory(id: string): Promise<Category | null>;
  getCategories(parentId?: string): Promise<Category[]>;
  createCategory(category: Omit<Category, "id">): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  recordFeedback(feedback: FeedbackInput): Promise<void>;
  getPopularArticles(limit: number, locale?: string): Promise<Article[]>;
  getRelatedArticles(articleId: string, limit: number): Promise<Article[]>;
}

// Cache interface
export interface KnowledgeBaseCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
}

// Default content templates
export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  {
    slug: "getting-started",
    name: "Getting Started",
    description: "Learn the basics of using Unified Health",
    icon: "rocket",
    order: 1,
    locale: "en",
    visibility: "public",
  },
  {
    slug: "account-settings",
    name: "Account & Settings",
    description: "Manage your account, profile, and preferences",
    icon: "user-cog",
    order: 2,
    locale: "en",
    visibility: "authenticated",
  },
  {
    slug: "appointments",
    name: "Appointments",
    description: "Schedule, manage, and attend appointments",
    icon: "calendar",
    order: 3,
    locale: "en",
    visibility: "authenticated",
  },
  {
    slug: "telehealth",
    name: "Telehealth & Video Visits",
    description: "Virtual healthcare visits and video consultations",
    icon: "video",
    order: 4,
    locale: "en",
    visibility: "authenticated",
  },
  {
    slug: "billing-payments",
    name: "Billing & Payments",
    description: "Understand bills, make payments, and manage insurance",
    icon: "credit-card",
    order: 5,
    locale: "en",
    visibility: "authenticated",
  },
  {
    slug: "medical-records",
    name: "Medical Records",
    description: "Access and manage your health records",
    icon: "file-medical",
    order: 6,
    locale: "en",
    visibility: "patient",
  },
  {
    slug: "prescriptions",
    name: "Prescriptions & Medications",
    description: "Manage prescriptions and medication refills",
    icon: "pills",
    order: 7,
    locale: "en",
    visibility: "patient",
  },
  {
    slug: "provider-tools",
    name: "Provider Tools",
    description: "Resources for healthcare providers",
    icon: "stethoscope",
    order: 8,
    locale: "en",
    visibility: "provider",
  },
  {
    slug: "privacy-security",
    name: "Privacy & Security",
    description: "How we protect your health information",
    icon: "shield",
    order: 9,
    locale: "en",
    visibility: "public",
  },
  {
    slug: "troubleshooting",
    name: "Troubleshooting",
    description: "Common issues and how to resolve them",
    icon: "wrench",
    order: 10,
    locale: "en",
    visibility: "public",
  },
];

export const DEFAULT_ARTICLES: Omit<
  Article,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "viewCount"
  | "helpfulCount"
  | "notHelpfulCount"
  | "categoryId"
>[] = [
  {
    slug: "how-to-create-account",
    title: "How to Create Your Account",
    excerpt: "Step-by-step guide to creating your Unified Health account",
    content: `# How to Create Your Account

Welcome to Unified Health! Creating an account takes just a few minutes.

## Step 1: Visit the Registration Page

Go to [theunifiedhealth.com/register](https://theunifiedhealth.com/register) or click "Sign Up" on our homepage.

## Step 2: Choose Your Account Type

Select whether you are:
- **Patient**: For individuals seeking healthcare services
- **Provider**: For healthcare professionals

## Step 3: Enter Your Information

Fill in the required fields:
- Full name
- Email address
- Phone number
- Date of birth (patients only)
- Create a secure password

## Step 4: Verify Your Email

Check your inbox for a verification email and click the confirmation link.

## Step 5: Complete Your Profile

After verification, you'll be prompted to:
- Add your address
- Upload insurance information (optional)
- Set your communication preferences

## Need Help?

If you encounter any issues, contact our support team at support@theunifiedhealth.com.
`,
    tags: ["account", "registration", "signup", "new user"],
    locale: "en",
    visibility: "public",
    status: "published",
    authorId: "system",
    publishedAt: new Date(),
  },
  {
    slug: "how-to-schedule-appointment",
    title: "How to Schedule an Appointment",
    excerpt: "Find a provider and book your appointment online",
    content: `# How to Schedule an Appointment

Booking appointments with Unified Health is quick and easy.

## Finding a Provider

1. Log into your account
2. Click "Find Care" or "Book Appointment"
3. Search by:
   - Specialty (e.g., Primary Care, Dermatology)
   - Provider name
   - Location
   - Insurance accepted

## Viewing Available Times

1. Select your preferred provider
2. View their available appointment slots
3. Filter by:
   - Date range
   - Time of day (morning, afternoon, evening)
   - Visit type (in-person or telehealth)

## Booking Your Appointment

1. Click on your preferred time slot
2. Confirm the appointment details
3. Add any notes for your provider
4. Review and confirm

## Confirmation

You'll receive:
- Email confirmation immediately
- SMS reminder 24 hours before
- Calendar invite (optional)

## Managing Appointments

To reschedule or cancel:
1. Go to "My Appointments"
2. Find the appointment
3. Click "Reschedule" or "Cancel"

Note: Cancellations should be made at least 24 hours in advance.
`,
    tags: ["appointment", "booking", "schedule", "provider"],
    locale: "en",
    visibility: "authenticated",
    status: "published",
    authorId: "system",
    publishedAt: new Date(),
  },
  {
    slug: "telehealth-visit-guide",
    title: "Guide to Telehealth Visits",
    excerpt: "Everything you need to know for your virtual healthcare visit",
    content: `# Guide to Telehealth Visits

Virtual visits let you see a healthcare provider from the comfort of your home.

## Before Your Visit

### Check Your Equipment
- **Device**: Computer, tablet, or smartphone
- **Camera**: Working webcam or front-facing camera
- **Microphone**: Built-in or external microphone
- **Speakers/Headphones**: For clear audio

### Test Your Connection
- Stable internet connection (minimum 1 Mbps)
- Run our connection test at Settings > Telehealth > Test Connection

### Prepare Your Space
- Find a quiet, private location
- Good lighting (face a window or light source)
- Have your medications or health items nearby

## Joining Your Visit

1. Click the link in your appointment reminder (sent 15 minutes before)
2. Or log in and go to "My Appointments"
3. Click "Join Video Visit"
4. Allow camera and microphone access when prompted

## During Your Visit

- Speak clearly and face the camera
- Ask questions if something is unclear
- Take notes if needed
- The provider may share their screen for test results

## After Your Visit

- Visit summary sent to your inbox
- Prescriptions sent to your pharmacy (if applicable)
- Follow-up appointment scheduling available
- Provider notes visible in your medical records

## Troubleshooting

**Video not working?**
- Check browser permissions
- Try a different browser (Chrome recommended)
- Restart your device

**Audio issues?**
- Check your device's volume settings
- Ensure the correct microphone is selected
- Use headphones to reduce echo
`,
    tags: ["telehealth", "video", "virtual visit", "video call"],
    locale: "en",
    visibility: "authenticated",
    status: "published",
    authorId: "system",
    publishedAt: new Date(),
  },
  {
    slug: "understanding-your-bill",
    title: "Understanding Your Bill",
    excerpt: "Learn how to read and understand your healthcare bills",
    content: `# Understanding Your Bill

Healthcare billing can be complex. This guide helps you understand your statements.

## Bill Components

### Service Details
- Date of service
- Provider name
- Description of services
- Procedure codes (CPT/HCPCS)

### Charges
- **Billed Amount**: Full cost before insurance
- **Insurance Adjustment**: Discount from your insurance
- **Insurance Paid**: Amount your insurance covered
- **Patient Responsibility**: What you owe

### Payment Status
- Pending: Waiting for insurance processing
- Processed: Insurance has responded
- Due: Ready for your payment

## Insurance Processing Timeline

1. Claim submitted (1-3 days after visit)
2. Insurance review (5-30 days)
3. EOB received (Explanation of Benefits)
4. Final bill issued

## Making Payments

### Payment Options
- Credit/debit card
- Bank transfer (ACH)
- Payment plan (for bills over $200)
- HSA/FSA cards

### Payment Plans
- 0% interest for qualifying accounts
- Monthly installments
- Automatic payments available

## Questions About Your Bill?

Contact our billing team:
- Email: billing@theunifiedhealth.com
- Phone: 1-800-XXX-XXXX
- Chat: Available in your account dashboard
`,
    tags: ["billing", "payment", "insurance", "cost", "charges"],
    locale: "en",
    visibility: "authenticated",
    status: "published",
    authorId: "system",
    publishedAt: new Date(),
  },
  {
    slug: "hipaa-privacy-rights",
    title: "Your HIPAA Privacy Rights",
    excerpt: "Understanding your healthcare privacy rights and protections",
    content: `# Your HIPAA Privacy Rights

Your health information is protected by federal law. Here's what you need to know.

## Your Rights Under HIPAA

### Right to Access
- View your complete medical records
- Request copies (electronic or paper)
- Receive records within 30 days

### Right to Amend
- Request corrections to your records
- Provider must respond within 60 days
- Denial must be explained in writing

### Right to Restriction
- Request limits on information sharing
- Specify what information and with whom
- We must honor requests for services you pay in full

### Right to Confidential Communication
- Request communications via specific methods
- Specify preferred phone number or address
- Request not to contact you at work

### Right to Accounting
- Request list of disclosures made
- Covers 6 years prior to request
- Excludes treatment, payment, and operations

## How We Protect Your Information

### Technical Safeguards
- 256-bit encryption for all data
- Secure data centers (SOC 2 certified)
- Regular security audits

### Access Controls
- Role-based access for staff
- Multi-factor authentication
- Automatic session timeouts

### Audit Logging
- All access is logged
- Regular monitoring for unusual activity
- Annual privacy training for all staff

## Contact Our Privacy Officer

For privacy questions or to exercise your rights:
- Email: privacy@theunifiedhealth.com
- Phone: 1-800-XXX-XXXX
- Mail: [Privacy Officer Address]
`,
    tags: ["HIPAA", "privacy", "rights", "security", "PHI"],
    locale: "en",
    visibility: "public",
    status: "published",
    authorId: "system",
    publishedAt: new Date(),
  },
];

export class KnowledgeBaseService {
  private storage: KnowledgeBaseStorage;
  private cache: KnowledgeBaseCache;
  private searchIndex: Fuse<Article> | null = null;
  private articles: Article[] = [];

  constructor(storage: KnowledgeBaseStorage, cache: KnowledgeBaseCache) {
    this.storage = storage;
    this.cache = cache;
  }

  /**
   * Initialize the search index
   */
  async initializeSearchIndex(): Promise<void> {
    const { articles } = await this.storage.getArticles(
      { status: "published" },
      { limit: 10000, offset: 0 },
    );
    this.articles = articles;
    this.searchIndex = new Fuse(articles, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.3 },
        { name: "content", weight: 0.2 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
    });
  }

  /**
   * Search articles
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const cacheKey = `kb:search:${JSON.stringify(options)}`;
    const cached = await this.cache.get<SearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.searchIndex) {
      await this.initializeSearchIndex();
    }

    let results = this.searchIndex!.search(options.query);

    // Filter by visibility
    if (options.visibility) {
      results = results.filter((r) =>
        options.visibility!.includes(r.item.visibility),
      );
    }

    // Filter by category
    if (options.categoryId) {
      results = results.filter((r) => r.item.categoryId === options.categoryId);
    }

    // Filter by locale
    if (options.locale) {
      results = results.filter((r) => r.item.locale === options.locale);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((r) =>
        options.tags!.some((tag) => r.item.tags.includes(tag)),
      );
    }

    const total = results.length;
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    const paginatedResults = results.slice(offset, offset + limit);

    const searchResult: SearchResult = {
      articles: paginatedResults.map((r) => r.item),
      total,
      query: options.query,
      suggestions: this.generateSuggestions(options.query, results.length),
    };

    await this.cache.set(cacheKey, searchResult, 300); // 5 minutes
    return searchResult;
  }

  /**
   * Get article by slug
   */
  async getArticleBySlug(
    slug: string,
    locale = "en",
    incrementView = true,
  ): Promise<Article | null> {
    const cacheKey = `kb:article:${slug}:${locale}`;
    let article = await this.cache.get<Article>(cacheKey);

    if (!article) {
      article = await this.storage.getArticleBySlug(slug, locale);
      if (article) {
        await this.cache.set(cacheKey, article, 600); // 10 minutes
      }
    }

    if (article && incrementView) {
      await this.storage.incrementViewCount(article.id);
    }

    return article;
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(
    categorySlug: string,
    locale = "en",
    visibility: ArticleVisibility[] = ["public"],
  ): Promise<Article[]> {
    const cacheKey = `kb:category:${categorySlug}:${locale}:${visibility.join(",")}`;
    const cached = await this.cache.get<Article[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.storage.getCategories();
    const category = categories.find(
      (c) => c.slug === categorySlug && c.locale === locale,
    );

    if (!category) {
      return [];
    }

    const { articles } = await this.storage.getArticles(
      { categoryId: category.id, status: "published", locale },
      { limit: 100, offset: 0 },
    );

    const filtered = articles.filter((a) => visibility.includes(a.visibility));
    await this.cache.set(cacheKey, filtered, 600);
    return filtered;
  }

  /**
   * Get all categories
   */
  async getCategories(parentId?: string, locale = "en"): Promise<Category[]> {
    const cacheKey = `kb:categories:${parentId || "root"}:${locale}`;
    const cached = await this.cache.get<Category[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.storage.getCategories(parentId);
    const filtered = categories.filter((c) => c.locale === locale);
    const sorted = filtered.sort((a, b) => a.order - b.order);

    await this.cache.set(cacheKey, sorted, 3600); // 1 hour
    return sorted;
  }

  /**
   * Get popular articles
   */
  async getPopularArticles(limit = 10, locale = "en"): Promise<Article[]> {
    const cacheKey = `kb:popular:${limit}:${locale}`;
    const cached = await this.cache.get<Article[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const articles = await this.storage.getPopularArticles(limit, locale);
    await this.cache.set(cacheKey, articles, 1800); // 30 minutes
    return articles;
  }

  /**
   * Get related articles
   */
  async getRelatedArticles(articleId: string, limit = 5): Promise<Article[]> {
    const cacheKey = `kb:related:${articleId}:${limit}`;
    const cached = await this.cache.get<Article[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const articles = await this.storage.getRelatedArticles(articleId, limit);
    await this.cache.set(cacheKey, articles, 1800);
    return articles;
  }

  /**
   * Submit article feedback
   */
  async submitFeedback(feedback: FeedbackInput): Promise<void> {
    await this.storage.recordFeedback(feedback);

    // Invalidate article cache to update counts
    const article = await this.storage.getArticle(feedback.articleId);
    if (article) {
      await this.cache.delete(`kb:article:${article.slug}:${article.locale}`);
    }
  }

  /**
   * Render article content as HTML
   */
  renderContent(markdownContent: string): string {
    return marked(markdownContent) as string;
  }

  /**
   * Admin: Create article
   */
  async createArticle(
    article: Omit<
      Article,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "viewCount"
      | "helpfulCount"
      | "notHelpfulCount"
    >,
  ): Promise<Article> {
    const created = await this.storage.createArticle(article);
    await this.invalidateSearchCache();
    return created;
  }

  /**
   * Admin: Update article
   */
  async updateArticle(id: string, updates: Partial<Article>): Promise<Article> {
    const updated = await this.storage.updateArticle(id, updates);
    await this.cache.delete(`kb:article:${updated.slug}:${updated.locale}`);
    await this.invalidateSearchCache();
    return updated;
  }

  /**
   * Admin: Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    const article = await this.storage.getArticle(id);
    if (article) {
      await this.cache.delete(`kb:article:${article.slug}:${article.locale}`);
    }
    await this.storage.deleteArticle(id);
    await this.invalidateSearchCache();
  }

  /**
   * Admin: Seed default content
   */
  async seedDefaultContent(): Promise<void> {
    const existingCategories = await this.storage.getCategories();

    if (existingCategories.length === 0) {
      // Create categories
      const categoryMap: Record<string, string> = {};
      for (const cat of DEFAULT_CATEGORIES) {
        const created = await this.storage.createCategory(cat);
        categoryMap[cat.slug] = created.id;
      }

      // Create articles
      for (const article of DEFAULT_ARTICLES) {
        const categorySlug = this.inferCategorySlug(article.tags);
        const categoryId =
          categoryMap[categorySlug] || categoryMap["getting-started"];
        await this.storage.createArticle({
          ...article,
          categoryId,
        });
      }

      await this.invalidateSearchCache();
    }
  }

  // Private methods

  private generateSuggestions(query: string, resultCount: number): string[] {
    if (resultCount > 0) return [];

    // Generate search suggestions for empty results
    const suggestions: string[] = [];
    const commonSearches = [
      "appointment",
      "telehealth",
      "billing",
      "password",
      "insurance",
      "records",
      "prescription",
    ];

    for (const term of commonSearches) {
      if (
        term.includes(query.toLowerCase()) ||
        query.toLowerCase().includes(term)
      ) {
        suggestions.push(term);
      }
    }

    return suggestions.slice(0, 3);
  }

  private inferCategorySlug(tags: string[]): string {
    const tagToCategoryMap: Record<string, string> = {
      account: "account-settings",
      registration: "getting-started",
      appointment: "appointments",
      booking: "appointments",
      telehealth: "telehealth",
      video: "telehealth",
      billing: "billing-payments",
      payment: "billing-payments",
      insurance: "billing-payments",
      records: "medical-records",
      prescription: "prescriptions",
      privacy: "privacy-security",
      HIPAA: "privacy-security",
      troubleshooting: "troubleshooting",
    };

    for (const tag of tags) {
      if (tagToCategoryMap[tag]) {
        return tagToCategoryMap[tag];
      }
    }

    return "getting-started";
  }

  private async invalidateSearchCache(): Promise<void> {
    await this.cache.deletePattern("kb:search:*");
    await this.initializeSearchIndex();
  }
}

// Export types and utilities
export { Fuse };

// Factory function
export function createKnowledgeBase(
  storage: KnowledgeBaseStorage,
  cache: KnowledgeBaseCache,
): KnowledgeBaseService {
  return new KnowledgeBaseService(storage, cache);
}
