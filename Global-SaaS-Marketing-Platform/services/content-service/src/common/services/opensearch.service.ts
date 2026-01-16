import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

export interface SearchOptions {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
  sort?: { field: string; order: 'asc' | 'desc' }[];
  highlight?: boolean;
  aggregations?: Record<string, any>;
}

export interface SearchResult<T> {
  hits: {
    id: string;
    score: number;
    source: T;
    highlight?: Record<string, string[]>;
  }[];
  total: number;
  aggregations?: Record<string, any>;
}

@Injectable()
export class OpenSearchService implements OnModuleInit {
  private readonly logger = new Logger(OpenSearchService.name);
  private client: Client;
  private indexPrefix: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const node = this.configService.get<string>(
      'OPENSEARCH_NODE',
      'http://localhost:9200',
    );
    const username = this.configService.get<string>('OPENSEARCH_USERNAME', 'admin');
    const password = this.configService.get<string>('OPENSEARCH_PASSWORD', 'admin');
    this.indexPrefix = this.configService.get<string>('OPENSEARCH_INDEX_PREFIX', 'content_');

    this.client = new Client({
      node,
      auth: {
        username,
        password,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.logger.log('OpenSearch service initialized');

    // Initialize indices
    await this.initializeIndices();
  }

  /**
   * Get the OpenSearch client
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Initialize required indices
   */
  private async initializeIndices() {
    const indices = [
      {
        name: 'pages',
        mappings: {
          properties: {
            tenantId: { type: 'keyword' },
            title: {
              type: 'text',
              analyzer: 'standard',
              fields: { keyword: { type: 'keyword' } },
            },
            slug: { type: 'keyword' },
            excerpt: { type: 'text', analyzer: 'standard' },
            content: { type: 'text', analyzer: 'standard' },
            metaTitle: { type: 'text' },
            metaDescription: { type: 'text' },
            type: { type: 'keyword' },
            status: { type: 'keyword' },
            authorId: { type: 'keyword' },
            topics: { type: 'keyword' },
            publishedAt: { type: 'date' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
        settings: {
          number_of_shards: 2,
          number_of_replicas: 1,
          analysis: {
            analyzer: {
              content_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'stop', 'snowball'],
              },
            },
          },
        },
      },
      {
        name: 'topics',
        mappings: {
          properties: {
            tenantId: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'standard',
              fields: { keyword: { type: 'keyword' } },
            },
            slug: { type: 'keyword' },
            description: { type: 'text' },
            searchVolume: { type: 'integer' },
            difficulty: { type: 'float' },
            relevanceScore: { type: 'float' },
            parentId: { type: 'keyword' },
            createdAt: { type: 'date' },
          },
        },
      },
    ];

    for (const index of indices) {
      const indexName = `${this.indexPrefix}${index.name}`;

      try {
        const exists = await this.client.indices.exists({ index: indexName });

        if (!exists.body) {
          await this.client.indices.create({
            index: indexName,
            body: {
              mappings: index.mappings,
              settings: index.settings,
            },
          });
          this.logger.log(`Created index: ${indexName}`);
        }
      } catch (error) {
        this.logger.error(`Failed to create index ${indexName}: ${error.message}`);
      }
    }
  }

  /**
   * Index a document
   */
  async index<T>(
    indexName: string,
    id: string,
    document: T,
    refresh: boolean = false,
  ): Promise<void> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    await this.client.index({
      index: fullIndexName,
      id,
      body: document,
      refresh: refresh ? 'true' : 'false',
    });

    this.logger.debug(`Indexed document ${id} in ${fullIndexName}`);
  }

  /**
   * Bulk index documents
   */
  async bulkIndex<T>(
    indexName: string,
    documents: { id: string; document: T }[],
    refresh: boolean = false,
  ): Promise<void> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    const body = documents.flatMap(({ id, document }) => [
      { index: { _index: fullIndexName, _id: id } },
      document,
    ]);

    const response = await this.client.bulk({
      body,
      refresh: refresh ? 'true' : 'false',
    });

    if (response.body.errors) {
      const errors = response.body.items.filter((item: any) => item.index?.error);
      this.logger.error(`Bulk indexing errors: ${JSON.stringify(errors)}`);
    }

    this.logger.debug(`Bulk indexed ${documents.length} documents in ${fullIndexName}`);
  }

  /**
   * Get a document by ID
   */
  async get<T>(indexName: string, id: string): Promise<T | null> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    try {
      const response = await this.client.get({
        index: fullIndexName,
        id,
      });

      return response.body._source as T;
    } catch (error) {
      if (error.meta?.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update a document
   */
  async update<T>(
    indexName: string,
    id: string,
    partialDocument: Partial<T>,
    refresh: boolean = false,
  ): Promise<void> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    await this.client.update({
      index: fullIndexName,
      id,
      body: {
        doc: partialDocument,
      },
      refresh: refresh ? 'true' : 'false',
    });

    this.logger.debug(`Updated document ${id} in ${fullIndexName}`);
  }

  /**
   * Delete a document
   */
  async delete(indexName: string, id: string, refresh: boolean = false): Promise<void> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    try {
      await this.client.delete({
        index: fullIndexName,
        id,
        refresh: refresh ? 'true' : 'false',
      });

      this.logger.debug(`Deleted document ${id} from ${fullIndexName}`);
    } catch (error) {
      if (error.meta?.statusCode !== 404) {
        throw error;
      }
    }
  }

  /**
   * Search documents
   */
  async search<T>(indexName: string, options: SearchOptions): Promise<SearchResult<T>> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    const { query, filters, page = 1, limit = 10, sort, highlight, aggregations } = options;

    const from = (page - 1) * limit;

    // Build query
    const must: any[] = [];
    const filter: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['title^3', 'excerpt^2', 'content', 'metaTitle', 'metaDescription'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          filter.push({ terms: { [field]: value } });
        } else if (typeof value === 'object' && (value.gte || value.lte)) {
          filter.push({ range: { [field]: value } });
        } else {
          filter.push({ term: { [field]: value } });
        }
      }
    }

    const body: any = {
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter,
        },
      },
      from,
      size: limit,
    };

    // Add sorting
    if (sort && sort.length > 0) {
      body.sort = sort.map((s) => ({ [s.field]: { order: s.order } }));
    }

    // Add highlighting
    if (highlight) {
      body.highlight = {
        fields: {
          title: {},
          excerpt: {},
          content: { fragment_size: 150, number_of_fragments: 3 },
        },
        pre_tags: ['<em>'],
        post_tags: ['</em>'],
      };
    }

    // Add aggregations
    if (aggregations) {
      body.aggs = aggregations;
    }

    const response = await this.client.search({
      index: fullIndexName,
      body,
    });

    const hits = response.body.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      source: hit._source as T,
      highlight: hit.highlight,
    }));

    return {
      hits,
      total:
        typeof response.body.hits.total === 'number'
          ? response.body.hits.total
          : response.body.hits.total.value,
      aggregations: response.body.aggregations,
    };
  }

  /**
   * Full-text search for content pages
   */
  async searchPages<T>(
    tenantId: string,
    query: string,
    options: {
      type?: string;
      status?: string;
      topics?: string[];
      page?: number;
      limit?: number;
    } = {},
  ): Promise<SearchResult<T>> {
    const filters: Record<string, any> = { tenantId };

    if (options.type) filters.type = options.type;
    if (options.status) filters.status = options.status;
    if (options.topics) filters.topics = options.topics;

    return this.search<T>('pages', {
      query,
      filters,
      page: options.page,
      limit: options.limit,
      highlight: true,
      sort: [{ field: '_score', order: 'desc' }],
    });
  }

  /**
   * Suggest completions
   */
  async suggest(
    indexName: string,
    field: string,
    prefix: string,
    size: number = 5,
  ): Promise<string[]> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    const response = await this.client.search({
      index: fullIndexName,
      body: {
        suggest: {
          suggestions: {
            prefix,
            completion: {
              field: `${field}.suggest`,
              size,
              skip_duplicates: true,
            },
          },
        },
      },
    });

    return response.body.suggest.suggestions[0].options.map(
      (option: any) => option.text,
    );
  }

  /**
   * Delete documents by query
   */
  async deleteByQuery(
    indexName: string,
    query: Record<string, any>,
    refresh: boolean = false,
  ): Promise<number> {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    const response = await this.client.deleteByQuery({
      index: fullIndexName,
      body: { query },
      refresh: refresh ? 'true' : 'false',
    });

    return response.body.deleted;
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      const response = await this.client.cluster.health();
      return ['green', 'yellow'].includes(response.body.status);
    } catch {
      return false;
    }
  }
}
