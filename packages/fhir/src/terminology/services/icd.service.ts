/**
 * ICD Terminology Service
 * Integrates with WHO ICD-11 API and NLM ICD-10 API
 *
 * WHO ICD-11 API: https://icd.who.int/icdapi
 * NLM ICD-10 API: https://clinicaltables.nlm.nih.gov/
 */

import { TerminologyCache, createTerminologyCache } from './cache';

// ============================================
// Type Definitions
// ============================================

export interface IcdConfig {
  // WHO ICD-11 API settings
  whoBaseUrl: string;
  whoClientId?: string;
  whoClientSecret?: string;
  whoApiVersion: string;

  // NLM ICD-10 API settings (alternative/fallback)
  nlmBaseUrl: string;

  // Common settings
  preferredApi: 'who' | 'nlm';
  timeout: number;
}

export interface WhoIcdEntity {
  '@context': string;
  '@id': string;
  title: {
    '@language': string;
    '@value': string;
  };
  definition?: {
    '@language': string;
    '@value': string;
  };
  longDefinition?: {
    '@language': string;
    '@value': string;
  };
  fullySpecifiedName?: {
    '@language': string;
    '@value': string;
  };
  source?: string;
  code?: string;
  codeRange?: string;
  classKind?: string;
  child?: string[];
  parent?: string[];
  browserUrl?: string;
}

export interface WhoSearchResult {
  '@context': string;
  error: boolean;
  errorMessage?: string;
  resultChopped: boolean;
  wordSuggestionsChopped: boolean;
  guessType: number;
  uniqueSearchId: string;
  destinationEntities: Array<{
    id: string;
    title: string;
    stemId: string;
    isLeaf: boolean;
    postcoordinationAvailability: number;
    hasCodingNote: boolean;
    hasMaternalChapterLink: boolean;
    matchingPVs: Array<{
      propertyId: string;
      label: string;
      score: number;
      important: boolean;
      foundationUri: string;
    }>;
    propertiesTruncated: boolean;
    isResidualOther: boolean;
    isResidualUnspecified: boolean;
    chapter: string;
    theCode: string;
    score: number;
    titleIsASearchResult: boolean;
    titleIsTopScore: boolean;
    entityType: number;
    important: boolean;
    descendants: unknown[];
  }>;
  words?: string[];
}

export interface NlmSearchResult {
  codes: string[];
  display: string[];
}

export interface IcdLookupResult {
  found: boolean;
  code?: string;
  display?: string;
  system: string;
  definition?: string;
  chapter?: string;
  block?: string;
  category?: string;
  designations?: Array<{
    language?: string;
    use?: { system?: string; code?: string; display?: string };
    value: string;
  }>;
}

export interface IcdSearchResult {
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

const DEFAULT_CONFIG: IcdConfig = {
  // WHO ICD-11 API
  whoBaseUrl: process.env.ICD_WHO_API_URL || 'https://id.who.int/icd',
  whoClientId: process.env.ICD_WHO_CLIENT_ID,
  whoClientSecret: process.env.ICD_WHO_CLIENT_SECRET,
  whoApiVersion: process.env.ICD_WHO_API_VERSION || '2024-01',

  // NLM ICD-10 API
  nlmBaseUrl: process.env.ICD_NLM_API_URL || 'https://clinicaltables.nlm.nih.gov/api',

  // Common
  preferredApi: (process.env.ICD_PREFERRED_API as 'who' | 'nlm') || 'nlm',
  timeout: parseInt(process.env.ICD_TIMEOUT || '30000', 10),
};

// ============================================
// ICD Service Implementation
// ============================================

export class IcdService {
  private static readonly SYSTEM_ICD10 = 'http://hl7.org/fhir/sid/icd-10';
  private static readonly SYSTEM_ICD10_CM = 'http://hl7.org/fhir/sid/icd-10-cm';
  private static readonly SYSTEM_ICD11 = 'http://id.who.int/icd/release/11';

  private config: IcdConfig;
  private lookupCache: TerminologyCache<IcdLookupResult>;
  private searchCache: TerminologyCache<IcdSearchResult>;
  private whoAccessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: Partial<IcdConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.lookupCache = createTerminologyCache<IcdLookupResult>('icd:lookup', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for lookups
    });
    this.searchCache = createTerminologyCache<IcdSearchResult>('icd:search', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for searches
    });
  }

  /**
   * Get WHO API access token (OAuth2)
   */
  private async getWhoAccessToken(): Promise<string | null> {
    // Check if we have a valid token
    if (this.whoAccessToken && Date.now() < this.tokenExpiry) {
      return this.whoAccessToken;
    }

    if (!this.config.whoClientId || !this.config.whoClientSecret) {
      console.warn('WHO ICD API credentials not configured');
      return null;
    }

    try {
      const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'icdapi_access',
        client_id: this.config.whoClientId,
        client_secret: this.config.whoClientSecret,
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error('Failed to get WHO ICD API token:', response.status);
        return null;
      }

      const data = await response.json() as { access_token: string; expires_in: number };
      this.whoAccessToken = data.access_token;
      // Set expiry with 5 minute buffer
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

      return this.whoAccessToken;
    } catch (error) {
      console.error('Error getting WHO ICD API token:', error);
      return null;
    }
  }

  /**
   * Make a request to WHO ICD API
   */
  private async makeWhoRequest<T>(endpoint: string): Promise<T | null> {
    const token = await this.getWhoAccessToken();
    if (!token) {
      return null;
    }

    const url = `${this.config.whoBaseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Accept-Language': 'en',
          'API-Version': this.config.whoApiVersion,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`WHO ICD API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('WHO ICD API request timeout');
      } else {
        console.error('WHO ICD API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Make a request to NLM ICD-10 API
   */
  private async makeNlmRequest<T>(endpoint: string): Promise<T | null> {
    const url = `${this.config.nlmBaseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`NLM ICD API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('NLM ICD API request timeout');
      } else {
        console.error('NLM ICD API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Lookup an ICD code
   */
  async lookup(code: string, system?: string): Promise<IcdLookupResult> {
    const cacheKey = `${code}:${system || 'default'}`;

    // Check cache first
    const cached = await this.lookupCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Determine which API to use
    const icdSystem = system || this.getSystemForCode(code);

    let result: IcdLookupResult;

    if (icdSystem === IcdService.SYSTEM_ICD11 || this.config.preferredApi === 'who') {
      result = await this.lookupWho(code, icdSystem);
    } else {
      result = await this.lookupNlm(code, icdSystem);
    }

    // Cache the result if found
    if (result.found) {
      await this.lookupCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Lookup using WHO ICD-11 API
   */
  private async lookupWho(code: string, system: string): Promise<IcdLookupResult> {
    // Try ICD-11 linearization lookup
    const endpoint = `/release/11/${this.config.whoApiVersion}/mms/codeinfo/${encodeURIComponent(code)}`;
    const entity = await this.makeWhoRequest<WhoIcdEntity>(endpoint);

    if (!entity) {
      // Fallback to NLM if WHO fails
      if (system !== IcdService.SYSTEM_ICD11) {
        return this.lookupNlm(code, system);
      }
      return { found: false, system };
    }

    return {
      found: true,
      code: entity.code || code,
      display: entity.title?.['@value'] || '',
      system,
      definition: entity.definition?.['@value'] || entity.longDefinition?.['@value'],
      designations: entity.fullySpecifiedName ? [{
        language: entity.fullySpecifiedName['@language'],
        use: {
          system: 'http://terminology.hl7.org/CodeSystem/designation-usage',
          code: 'fully-specified-name',
          display: 'Fully Specified Name',
        },
        value: entity.fullySpecifiedName['@value'],
      }] : undefined,
    };
  }

  /**
   * Lookup using NLM ICD-10 API
   */
  private async lookupNlm(code: string, system: string): Promise<IcdLookupResult> {
    // NLM provides ICD-10-CM lookup
    const endpoint = `/icd10cm/v3/search?sf=code&terms=${encodeURIComponent(code)}&maxList=1`;
    const result = await this.makeNlmRequest<[number, string[], null, NlmSearchResult]>(endpoint);

    if (!result || result[0] === 0) {
      return { found: false, system };
    }

    const codes = result[3]?.codes || result[1] || [];
    const displays = result[3]?.display || result[2] || [];

    const index = codes.findIndex(c => c.toUpperCase() === code.toUpperCase());

    if (index === -1) {
      return { found: false, system };
    }

    return {
      found: true,
      code: codes[index],
      display: displays[index] || '',
      system: system || IcdService.SYSTEM_ICD10_CM,
    };
  }

  /**
   * Search ICD codes
   */
  async search(query: string, limit = 10, system?: string): Promise<IcdSearchResult> {
    if (!query || query.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `${query}:${limit}:${system || 'default'}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let result: IcdSearchResult;

    if (system === IcdService.SYSTEM_ICD11 || this.config.preferredApi === 'who') {
      result = await this.searchWho(query, limit, system);
    } else {
      result = await this.searchNlm(query, limit, system);
    }

    // Cache the result
    await this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Search using WHO ICD-11 API
   */
  private async searchWho(query: string, limit: number, system?: string): Promise<IcdSearchResult> {
    const params = new URLSearchParams({
      q: query,
      useFlexisearch: 'true',
      flatResults: 'true',
      highlightingEnabled: 'false',
    });

    const endpoint = `/release/11/${this.config.whoApiVersion}/mms/search?${params}`;
    const response = await this.makeWhoRequest<WhoSearchResult>(endpoint);

    if (!response || response.error || !response.destinationEntities) {
      // Fallback to NLM if WHO fails
      if (system !== IcdService.SYSTEM_ICD11) {
        return this.searchNlm(query, limit, system);
      }
      return { matches: [], total: 0 };
    }

    const matches = response.destinationEntities
      .slice(0, limit)
      .filter(entity => entity.theCode)
      .map(entity => ({
        code: entity.theCode,
        display: entity.title,
        system: system || IcdService.SYSTEM_ICD11,
      }));

    return {
      matches,
      total: response.destinationEntities.length,
    };
  }

  /**
   * Search using NLM ICD-10 API
   */
  private async searchNlm(query: string, limit: number, system?: string): Promise<IcdSearchResult> {
    const endpoint = `/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(query)}&maxList=${limit}`;
    const result = await this.makeNlmRequest<[number, string[], null, { codes: string[]; display: string[] }]>(endpoint);

    if (!result || result[0] === 0) {
      return { matches: [], total: 0 };
    }

    const total = result[0];
    const codes = result[3]?.codes || result[1] || [];
    const displays = result[3]?.display || [];

    const matches = codes.map((code, index) => ({
      code,
      display: displays[index] || '',
      system: system || IcdService.SYSTEM_ICD10_CM,
    }));

    return { matches, total };
  }

  /**
   * Determine system based on code format
   */
  private getSystemForCode(code: string): string {
    // ICD-10 codes typically are letter followed by digits
    // ICD-10-CM codes can be more specific with more characters
    if (/^[A-TV-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/.test(code)) {
      // Could be ICD-10 or ICD-10-CM
      return code.length > 4 ? IcdService.SYSTEM_ICD10_CM : IcdService.SYSTEM_ICD10;
    }
    // ICD-11 codes have different format
    return IcdService.SYSTEM_ICD11;
  }

  /**
   * Get chapter/block hierarchy for a code
   */
  async getHierarchy(code: string): Promise<{
    chapter?: { code: string; display: string };
    block?: { code: string; display: string };
    category?: { code: string; display: string };
  }> {
    // Use WHO API for hierarchy information
    const endpoint = `/release/11/${this.config.whoApiVersion}/mms/codeinfo/${encodeURIComponent(code)}?include=ancestor`;
    const response = await this.makeWhoRequest<WhoIcdEntity & { ancestor?: WhoIcdEntity[] }>(endpoint);

    if (!response || !response.parent) {
      return {};
    }

    // Parse ancestors to determine chapter, block, category
    // This would require additional API calls for full implementation
    return {};
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

  /**
   * Get the supported systems
   */
  static getSupportedSystems(): string[] {
    return [
      IcdService.SYSTEM_ICD10,
      IcdService.SYSTEM_ICD10_CM,
      IcdService.SYSTEM_ICD11,
    ];
  }
}

// ============================================
// Singleton Instance Export
// ============================================

let defaultInstance: IcdService | null = null;

export function getIcdService(config?: Partial<IcdConfig>): IcdService {
  if (!defaultInstance || config) {
    defaultInstance = new IcdService(config);
  }
  return defaultInstance;
}

export default IcdService;
