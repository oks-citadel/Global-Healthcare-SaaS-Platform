/**
 * LOINC Terminology Service
 * Integrates with LOINC FHIR API (https://fhir.loinc.org/)
 */

import { TerminologyCache, createTerminologyCache } from './cache';

// ============================================
// Type Definitions
// ============================================

export interface LoincConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout: number;
}

export interface LoincParameter {
  name: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueCode?: string;
  valueCoding?: {
    system?: string;
    code?: string;
    display?: string;
  };
  part?: LoincParameter[];
}

export interface LoincLookupResponse {
  resourceType: 'Parameters';
  parameter: LoincParameter[];
}

export interface LoincSearchEntry {
  fullUrl?: string;
  resource: {
    resourceType: 'CodeSystem' | 'ValueSet';
    id?: string;
    code?: string;
    display?: string;
    property?: Array<{
      code: string;
      valueString?: string;
      valueCode?: string;
    }>;
  };
}

export interface LoincSearchResponse {
  resourceType: 'Bundle';
  type: string;
  total?: number;
  entry?: LoincSearchEntry[];
}

export interface LoincValueSetExpansion {
  resourceType: 'ValueSet';
  expansion?: {
    timestamp: string;
    total?: number;
    offset?: number;
    contains?: Array<{
      system: string;
      code: string;
      display: string;
      designation?: Array<{
        language?: string;
        use?: {
          system?: string;
          code?: string;
          display?: string;
        };
        value: string;
      }>;
    }>;
  };
}

export interface LoincLookupResult {
  found: boolean;
  code?: string;
  display?: string;
  system: string;
  definition?: string;
  longCommonName?: string;
  shortName?: string;
  class?: string;
  component?: string;
  property?: string;
  timeAspect?: string;
  system_?: string;
  scale?: string;
  method?: string;
  designations?: Array<{
    language?: string;
    use?: { system?: string; code?: string; display?: string };
    value: string;
  }>;
}

export interface LoincSearchResult {
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

const DEFAULT_CONFIG: LoincConfig = {
  baseUrl: process.env.LOINC_FHIR_URL || 'https://fhir.loinc.org',
  username: process.env.LOINC_USERNAME,
  password: process.env.LOINC_PASSWORD,
  timeout: parseInt(process.env.LOINC_TIMEOUT || '30000', 10),
};

// ============================================
// LOINC Service Implementation
// ============================================

export class LoincService {
  private static readonly SYSTEM = 'http://loinc.org';
  private config: LoincConfig;
  private lookupCache: TerminologyCache<LoincLookupResult>;
  private searchCache: TerminologyCache<LoincSearchResult>;

  constructor(config: Partial<LoincConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.lookupCache = createTerminologyCache<LoincLookupResult>('loinc:lookup', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for lookups
    });
    this.searchCache = createTerminologyCache<LoincSearchResult>('loinc:search', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for searches
    });
  }

  /**
   * Build request headers with optional Basic Auth
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
    };

    if (this.config.username && this.config.password) {
      const auth = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
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
        console.error(`LOINC API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('LOINC API request timeout');
      } else {
        console.error('LOINC API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Extract parameter value from FHIR Parameters response
   */
  private extractParameter(params: LoincParameter[], name: string): string | undefined {
    const param = params.find(p => p.name === name);
    return param?.valueString || param?.valueCode;
  }

  /**
   * Lookup a LOINC code using FHIR $lookup operation
   */
  async lookup(code: string): Promise<LoincLookupResult> {
    // Check cache first
    const cached = await this.lookupCache.get(code);
    if (cached) {
      return cached;
    }

    // Use FHIR $lookup operation
    const endpoint = `/CodeSystem/$lookup?system=${encodeURIComponent(LoincService.SYSTEM)}&code=${encodeURIComponent(code)}`;
    const response = await this.makeRequest<LoincLookupResponse>(endpoint);

    if (!response || response.resourceType !== 'Parameters') {
      return {
        found: false,
        system: LoincService.SYSTEM,
      };
    }

    const params = response.parameter || [];
    const designations: LoincLookupResult['designations'] = [];

    // Extract designations
    const designationParams = params.filter(p => p.name === 'designation');
    for (const des of designationParams) {
      if (des.part) {
        const lang = des.part.find(p => p.name === 'language')?.valueCode;
        const value = des.part.find(p => p.name === 'value')?.valueString;
        const use = des.part.find(p => p.name === 'use')?.valueCoding;

        if (value) {
          designations.push({
            language: lang,
            use: use ? {
              system: use.system,
              code: use.code,
              display: use.display,
            } : undefined,
            value,
          });
        }
      }
    }

    // Extract properties
    const properties: Record<string, string> = {};
    const propertyParams = params.filter(p => p.name === 'property');
    for (const prop of propertyParams) {
      if (prop.part) {
        const propCode = prop.part.find(p => p.name === 'code')?.valueCode;
        const propValue = prop.part.find(p => p.name === 'value')?.valueString;
        if (propCode && propValue) {
          properties[propCode] = propValue;
        }
      }
    }

    const result: LoincLookupResult = {
      found: true,
      code,
      display: this.extractParameter(params, 'display'),
      system: LoincService.SYSTEM,
      definition: this.extractParameter(params, 'definition'),
      longCommonName: properties['LONG_COMMON_NAME'],
      shortName: properties['SHORTNAME'],
      class: properties['CLASS'],
      component: properties['COMPONENT'],
      property: properties['PROPERTY'],
      timeAspect: properties['TIME_ASPCT'],
      system_: properties['SYSTEM'],
      scale: properties['SCALE_TYP'],
      method: properties['METHOD_TYP'],
      designations: designations.length > 0 ? designations : undefined,
    };

    // Cache the result
    await this.lookupCache.set(code, result);

    return result;
  }

  /**
   * Search LOINC codes using ValueSet expansion
   */
  async search(query: string, limit = 10, offset = 0): Promise<LoincSearchResult> {
    if (!query || query.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `${query}:${limit}:${offset}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Use ValueSet expansion with filter
    // LOINC provides an implicit ValueSet for all codes
    const params = new URLSearchParams({
      url: 'http://loinc.org/vs',
      filter: query,
      count: String(limit),
      offset: String(offset),
    });

    const endpoint = `/ValueSet/$expand?${params}`;
    const response = await this.makeRequest<LoincValueSetExpansion>(endpoint);

    if (!response || !response.expansion?.contains) {
      return { matches: [], total: 0 };
    }

    const result: LoincSearchResult = {
      matches: response.expansion.contains.map(item => ({
        code: item.code,
        display: item.display,
        system: LoincService.SYSTEM,
      })),
      total: response.expansion.total,
    };

    // Cache the result
    await this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Search by LOINC Part (component, property, etc.)
   */
  async searchByPart(
    partType: 'COMPONENT' | 'PROPERTY' | 'TIME' | 'SYSTEM' | 'SCALE' | 'METHOD',
    partValue: string,
    limit = 10
  ): Promise<LoincSearchResult> {
    const cacheKey = `part:${partType}:${partValue}:${limit}`;

    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Search using property filter
    const params = new URLSearchParams({
      url: 'http://loinc.org/vs',
      filter: partValue,
      'property': partType,
      count: String(limit),
    });

    const endpoint = `/ValueSet/$expand?${params}`;
    const response = await this.makeRequest<LoincValueSetExpansion>(endpoint);

    if (!response || !response.expansion?.contains) {
      return { matches: [], total: 0 };
    }

    const result: LoincSearchResult = {
      matches: response.expansion.contains.map(item => ({
        code: item.code,
        display: item.display,
        system: LoincService.SYSTEM,
      })),
      total: response.expansion.total,
    };

    await this.searchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get LOINC panels (codes that group other codes)
   */
  async getPanelMembers(panelCode: string): Promise<LoincSearchResult> {
    const cacheKey = `panel:${panelCode}`;

    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Look up the panel and get its members via property
    const params = new URLSearchParams({
      'property': 'PANEL',
      'property-value': panelCode,
    });

    const endpoint = `/CodeSystem?${params}`;
    const response = await this.makeRequest<LoincSearchResponse>(endpoint);

    if (!response || !response.entry) {
      return { matches: [], total: 0 };
    }

    const result: LoincSearchResult = {
      matches: response.entry
        .filter(e => e.resource.code)
        .map(e => ({
          code: e.resource.code!,
          display: e.resource.display || '',
          system: LoincService.SYSTEM,
        })),
      total: response.total,
    };

    await this.searchCache.set(cacheKey, result);
    return result;
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

let defaultInstance: LoincService | null = null;

export function getLoincService(config?: Partial<LoincConfig>): LoincService {
  if (!defaultInstance || config) {
    defaultInstance = new LoincService(config);
  }
  return defaultInstance;
}

export default LoincService;
