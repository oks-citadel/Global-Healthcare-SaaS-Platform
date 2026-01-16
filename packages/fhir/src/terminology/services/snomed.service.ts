/**
 * SNOMED CT Terminology Service
 * Integrates with SNOMED CT Browser/Snowstorm API
 * https://browser.ihtsdotools.org/snowstorm/snomed-ct/
 */

import { TerminologyCache, createTerminologyCache } from './cache';

// ============================================
// Type Definitions
// ============================================

export interface SnomedConfig {
  baseUrl: string;
  branch: string;
  edition: string;
  version?: string;
  apiKey?: string;
  timeout: number;
}

export interface SnomedConcept {
  conceptId: string;
  active: boolean;
  definitionStatus: string;
  moduleId: string;
  effectiveTime: string;
  fsn: {
    term: string;
    lang: string;
  };
  pt: {
    term: string;
    lang: string;
  };
  id: string;
}

export interface SnomedDescription {
  descriptionId: string;
  term: string;
  type: string;
  lang: string;
  active: boolean;
}

export interface SnomedSearchResult {
  items: Array<{
    concept: SnomedConcept;
    term: string;
    active: boolean;
    fsn?: {
      term: string;
      lang: string;
    };
  }>;
  total: number;
  limit: number;
  offset: number;
}

export interface SnomedLookupResult {
  found: boolean;
  code?: string;
  display?: string;
  system: string;
  definition?: string;
  designations?: Array<{
    language?: string;
    use?: { system?: string; code?: string; display?: string };
    value: string;
  }>;
  fullySpecifiedName?: string;
  active?: boolean;
}

export interface SnomedSearchResponse {
  matches: Array<{
    code: string;
    display: string;
    system: string;
  }>;
  total?: number;
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: SnomedConfig = {
  baseUrl: process.env.SNOMED_API_URL || 'https://browser.ihtsdotools.org/snowstorm/snomed-ct',
  branch: process.env.SNOMED_BRANCH || 'MAIN',
  edition: process.env.SNOMED_EDITION || 'MAIN/SNOMEDCT-US',
  apiKey: process.env.SNOMED_API_KEY,
  timeout: parseInt(process.env.SNOMED_TIMEOUT || '30000', 10),
};

// ============================================
// SNOMED Service Implementation
// ============================================

export class SnomedService {
  private static readonly SYSTEM = 'http://snomed.info/sct';
  private config: SnomedConfig;
  private lookupCache: TerminologyCache<SnomedLookupResult>;
  private searchCache: TerminologyCache<SnomedSearchResponse>;

  constructor(config: Partial<SnomedConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.lookupCache = createTerminologyCache<SnomedLookupResult>('snomed:lookup', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for lookups
    });
    this.searchCache = createTerminologyCache<SnomedSearchResponse>('snomed:search', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for searches
    });
  }

  /**
   * Build request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Accept-Language': 'en',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  /**
   * Make an API request with error handling
   */
  private async makeRequest<T>(endpoint: string): Promise<T | null> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`SNOMED API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('SNOMED API request timeout');
      } else {
        console.error('SNOMED API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Lookup a SNOMED CT concept by code
   */
  async lookup(code: string): Promise<SnomedLookupResult> {
    // Check cache first
    const cached = await this.lookupCache.get(code);
    if (cached) {
      return cached;
    }

    // Make API request
    const endpoint = `/browser/${encodeURIComponent(this.config.edition)}/concepts/${encodeURIComponent(code)}`;
    const concept = await this.makeRequest<SnomedConcept>(endpoint);

    if (!concept) {
      // Return not found, but don't cache failures
      return {
        found: false,
        system: SnomedService.SYSTEM,
      };
    }

    // Get descriptions for designations
    const descriptionsEndpoint = `/browser/${encodeURIComponent(this.config.edition)}/concepts/${encodeURIComponent(code)}/descriptions`;
    const descriptions = await this.makeRequest<SnomedDescription[]>(descriptionsEndpoint);

    const result: SnomedLookupResult = {
      found: true,
      code: concept.conceptId,
      display: concept.pt?.term || concept.fsn?.term,
      system: SnomedService.SYSTEM,
      fullySpecifiedName: concept.fsn?.term,
      active: concept.active,
      designations: descriptions?.map(desc => ({
        language: desc.lang,
        use: {
          system: 'http://snomed.info/sct',
          code: desc.type,
          display: desc.type === '900000000000003001' ? 'Fully specified name' : 'Synonym',
        },
        value: desc.term,
      })),
    };

    // Cache the result
    await this.lookupCache.set(code, result);

    return result;
  }

  /**
   * Search SNOMED CT concepts
   */
  async search(query: string, limit = 10, offset = 0): Promise<SnomedSearchResponse> {
    if (!query || query.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `${query}:${limit}:${offset}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Make API request
    const params = new URLSearchParams({
      term: query,
      limit: String(limit),
      offset: String(offset),
      activeFilter: 'true',
      termActive: 'true',
      conceptActive: 'true',
    });

    const endpoint = `/browser/${encodeURIComponent(this.config.edition)}/descriptions?${params}`;
    const searchResult = await this.makeRequest<SnomedSearchResult>(endpoint);

    if (!searchResult) {
      // Return empty result on API failure
      return { matches: [], total: 0 };
    }

    const result: SnomedSearchResponse = {
      matches: searchResult.items.map(item => ({
        code: item.concept.conceptId,
        display: item.term || item.fsn?.term || '',
        system: SnomedService.SYSTEM,
      })),
      total: searchResult.total,
    };

    // Cache the result
    await this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Find descendants of a concept
   */
  async findDescendants(conceptId: string, limit = 50): Promise<SnomedSearchResponse> {
    const endpoint = `/browser/${encodeURIComponent(this.config.edition)}/concepts/${encodeURIComponent(conceptId)}/descendants?stated=false&limit=${limit}`;
    const result = await this.makeRequest<{ items: SnomedConcept[]; total: number }>(endpoint);

    if (!result) {
      return { matches: [], total: 0 };
    }

    return {
      matches: result.items.map(concept => ({
        code: concept.conceptId,
        display: concept.pt?.term || concept.fsn?.term || '',
        system: SnomedService.SYSTEM,
      })),
      total: result.total,
    };
  }

  /**
   * Get concept relationships
   */
  async getRelationships(conceptId: string): Promise<Array<{
    type: string;
    typeId: string;
    target: string;
    targetId: string;
  }>> {
    const endpoint = `/browser/${encodeURIComponent(this.config.edition)}/concepts/${encodeURIComponent(conceptId)}/relationships`;
    const result = await this.makeRequest<Array<{
      type: { pt: { term: string }; conceptId: string };
      target: { pt: { term: string }; conceptId: string };
    }>>(endpoint);

    if (!result) {
      return [];
    }

    return result.map(rel => ({
      type: rel.type.pt?.term || '',
      typeId: rel.type.conceptId,
      target: rel.target.pt?.term || '',
      targetId: rel.target.conceptId,
    }));
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    await this.lookupCache.clear();
    await this.searchCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    lookup: { size: number; maxSize: number; hasRedis: boolean };
    search: { size: number; maxSize: number; hasRedis: boolean };
  } {
    return {
      lookup: this.lookupCache.getStats(),
      search: this.searchCache.getStats(),
    };
  }
}

// ============================================
// Singleton Instance Export
// ============================================

let defaultInstance: SnomedService | null = null;

export function getSnomedService(config?: Partial<SnomedConfig>): SnomedService {
  if (!defaultInstance || config) {
    defaultInstance = new SnomedService(config);
  }
  return defaultInstance;
}

export default SnomedService;
