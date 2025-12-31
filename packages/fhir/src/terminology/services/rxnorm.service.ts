/**
 * RxNorm Terminology Service
 * Integrates with NLM RxNorm API (https://rxnav.nlm.nih.gov/REST)
 *
 * RxNorm provides normalized names for clinical drugs and links to many
 * drug vocabularies including NDC, SNOMED CT, and others.
 */

import { TerminologyCache, createTerminologyCache } from './cache';

// ============================================
// Type Definitions
// ============================================

export interface RxNormConfig {
  baseUrl: string;
  timeout: number;
}

/**
 * RxNorm Concept (RxCUI) information
 */
export interface RxNormConcept {
  rxcui: string;
  name: string;
  synonym?: string;
  tty: string; // Term Type (e.g., 'SBD', 'SCD', 'IN', 'BN')
  language?: string;
  suppress?: string;
  umlscui?: string;
}

/**
 * RxNorm Drug information from rxcui lookup
 */
export interface RxNormDrugInfo {
  rxcui: string;
  name: string;
  tty: string;
  synonym?: string;
}

/**
 * RxNorm API response for concept properties
 */
export interface RxNormPropertiesResponse {
  properties?: {
    rxcui: string;
    name: string;
    synonym?: string;
    tty: string;
    language?: string;
    suppress?: string;
    umlscui?: string;
  };
}

/**
 * RxNorm API response for drug search
 */
export interface RxNormDrugsResponse {
  drugGroup?: {
    name?: string;
    conceptGroup?: Array<{
      tty: string;
      conceptProperties?: Array<{
        rxcui: string;
        name: string;
        synonym?: string;
        tty: string;
        language?: string;
        suppress?: string;
        umlscui?: string;
      }>;
    }>;
  };
}

/**
 * RxNorm API response for spelling suggestions
 */
export interface RxNormSpellingSuggestionsResponse {
  suggestionGroup?: {
    name?: string;
    suggestionList?: {
      suggestion?: string[];
    };
  };
}

/**
 * RxNorm API response for related concepts
 */
export interface RxNormRelatedResponse {
  relatedGroup?: {
    rxcui?: string;
    conceptGroup?: Array<{
      tty: string;
      conceptProperties?: Array<{
        rxcui: string;
        name: string;
        synonym?: string;
        tty: string;
        language?: string;
        suppress?: string;
      }>;
    }>;
  };
}

/**
 * RxNorm API response for NDC codes
 */
export interface RxNormNDCResponse {
  ndcGroup?: {
    rxcui?: string;
    ndcList?: {
      ndc?: string[];
    };
  };
}

/**
 * Drug interaction information
 */
export interface DrugInteraction {
  sourceName: string;
  sourceId?: string;
  severity?: string;
  description: string;
  drug1: {
    rxcui: string;
    name: string;
  };
  drug2: {
    rxcui: string;
    name: string;
  };
}

/**
 * RxNorm API response for drug interactions
 */
export interface RxNormInteractionsResponse {
  fullInteractionTypeGroup?: Array<{
    sourceName: string;
    sourceDisclaimer?: string;
    fullInteractionType?: Array<{
      comment?: string;
      minConcept: Array<{
        rxcui: string;
        name: string;
        tty: string;
      }>;
      interactionPair: Array<{
        interactionConcept: Array<{
          minConceptItem: {
            rxcui: string;
            name: string;
            tty: string;
          };
          sourceConceptItem: {
            id: string;
            name: string;
            url: string;
          };
        }>;
        severity?: string;
        description: string;
      }>;
    }>;
  }>;
}

/**
 * Lookup result for a single RxCUI
 */
export interface RxNormLookupResult {
  found: boolean;
  code?: string;
  display?: string;
  system: string;
  rxcui?: string;
  name?: string;
  tty?: string;
  synonym?: string;
  termType?: string;
}

/**
 * Search result for drug queries
 */
export interface RxNormSearchResult {
  matches: Array<{
    code: string;
    display: string;
    system: string;
    tty?: string;
  }>;
  total?: number;
}

/**
 * Related drugs result
 */
export interface RxNormRelatedResult {
  brandNames: Array<{
    rxcui: string;
    name: string;
  }>;
  genericNames: Array<{
    rxcui: string;
    name: string;
  }>;
  ingredients: Array<{
    rxcui: string;
    name: string;
  }>;
  doseFormGroups: Array<{
    rxcui: string;
    name: string;
  }>;
}

/**
 * NDC codes result
 */
export interface RxNormNDCResult {
  rxcui: string;
  ndcCodes: string[];
}

/**
 * Drug interactions check result
 */
export interface RxNormInteractionsResult {
  hasInteractions: boolean;
  interactions: DrugInteraction[];
  sources: string[];
}

// ============================================
// Term Type Constants
// ============================================

export const RxNormTermTypes = {
  IN: 'Ingredient',
  PIN: 'Precise Ingredient',
  MIN: 'Multiple Ingredients',
  SCDC: 'Semantic Clinical Drug Component',
  SCDF: 'Semantic Clinical Drug Form',
  SCDG: 'Semantic Clinical Drug Group',
  SCD: 'Semantic Clinical Drug',
  BN: 'Brand Name',
  SBDC: 'Semantic Branded Drug Component',
  SBDF: 'Semantic Branded Drug Form',
  SBDG: 'Semantic Branded Drug Group',
  SBD: 'Semantic Branded Drug',
  PSN: 'Prescribable Name',
  SY: 'Synonym',
  TMSY: 'Tall Man Lettering Synonym',
  BPCK: 'Brand Name Pack',
  GPCK: 'Generic Pack',
  DF: 'Dose Form',
  DFG: 'Dose Form Group',
} as const;

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: RxNormConfig = {
  baseUrl: process.env.RXNORM_API_URL || 'https://rxnav.nlm.nih.gov/REST',
  timeout: parseInt(process.env.RXNORM_TIMEOUT || '30000', 10),
};

// ============================================
// RxNorm Service Implementation
// ============================================

export class RxNormService {
  private static readonly SYSTEM = 'http://www.nlm.nih.gov/research/umls/rxnorm';
  private config: RxNormConfig;
  private lookupCache: TerminologyCache<RxNormLookupResult>;
  private searchCache: TerminologyCache<RxNormSearchResult>;
  private relatedCache: TerminologyCache<RxNormRelatedResult>;
  private ndcCache: TerminologyCache<RxNormNDCResult>;
  private interactionsCache: TerminologyCache<RxNormInteractionsResult>;
  private spellingSuggestionsCache: TerminologyCache<string[]>;

  constructor(config: Partial<RxNormConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize caches with appropriate TTLs
    this.lookupCache = createTerminologyCache<RxNormLookupResult>('rxnorm:lookup', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for lookups
    });
    this.searchCache = createTerminologyCache<RxNormSearchResult>('rxnorm:search', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for searches
    });
    this.relatedCache = createTerminologyCache<RxNormRelatedResult>('rxnorm:related', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for related drugs
    });
    this.ndcCache = createTerminologyCache<RxNormNDCResult>('rxnorm:ndc', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for NDC codes
    });
    this.interactionsCache = createTerminologyCache<RxNormInteractionsResult>('rxnorm:interactions', {
      defaultTTL: 6 * 60 * 60 * 1000, // 6 hours for interactions (more dynamic)
    });
    this.spellingSuggestionsCache = createTerminologyCache<string[]>('rxnorm:spelling', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for spelling suggestions
    });
  }

  /**
   * Build request headers
   */
  private getHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
    };
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
        console.error(`RxNorm API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('RxNorm API request timeout');
      } else {
        console.error('RxNorm API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Lookup a drug by RxCUI (RxNorm Concept Unique Identifier)
   */
  async lookup(code: string): Promise<RxNormLookupResult> {
    // Check cache first
    const cached = await this.lookupCache.get(code);
    if (cached) {
      return cached;
    }

    // Make API request to get concept properties
    const endpoint = `/rxcui/${encodeURIComponent(code)}/properties.json`;
    const response = await this.makeRequest<RxNormPropertiesResponse>(endpoint);

    if (!response || !response.properties) {
      return {
        found: false,
        system: RxNormService.SYSTEM,
      };
    }

    const props = response.properties;
    const result: RxNormLookupResult = {
      found: true,
      code: props.rxcui,
      display: props.name,
      system: RxNormService.SYSTEM,
      rxcui: props.rxcui,
      name: props.name,
      tty: props.tty,
      synonym: props.synonym,
      termType: RxNormTermTypes[props.tty as keyof typeof RxNormTermTypes] || props.tty,
    };

    // Cache the result
    await this.lookupCache.set(code, result);

    return result;
  }

  /**
   * Search for drugs by name
   */
  async search(query: string, limit = 10): Promise<RxNormSearchResult> {
    if (!query || query.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `${query}:${limit}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Use the drugs endpoint for searching
    const endpoint = `/drugs.json?name=${encodeURIComponent(query)}`;
    const response = await this.makeRequest<RxNormDrugsResponse>(endpoint);

    if (!response || !response.drugGroup?.conceptGroup) {
      return { matches: [], total: 0 };
    }

    const matches: RxNormSearchResult['matches'] = [];

    for (const group of response.drugGroup.conceptGroup) {
      if (group.conceptProperties) {
        for (const concept of group.conceptProperties) {
          if (matches.length >= limit) break;
          matches.push({
            code: concept.rxcui,
            display: concept.name,
            system: RxNormService.SYSTEM,
            tty: concept.tty,
          });
        }
      }
      if (matches.length >= limit) break;
    }

    const result: RxNormSearchResult = {
      matches,
      total: matches.length,
    };

    // Cache the result
    await this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Get related drug concepts (brand names, generics, ingredients)
   */
  async getRelatedDrugs(rxcui: string): Promise<RxNormRelatedResult> {
    // Check cache first
    const cached = await this.relatedCache.get(rxcui);
    if (cached) {
      return cached;
    }

    // Request related concepts with specific term types
    // BN = Brand Name, IN = Ingredient, SBD = Semantic Branded Drug, SCD = Semantic Clinical Drug
    const endpoint = `/rxcui/${encodeURIComponent(rxcui)}/related.json?tty=BN+IN+SBD+SCD+SBDF+SCDF+DFG`;
    const response = await this.makeRequest<RxNormRelatedResponse>(endpoint);

    const result: RxNormRelatedResult = {
      brandNames: [],
      genericNames: [],
      ingredients: [],
      doseFormGroups: [],
    };

    if (!response || !response.relatedGroup?.conceptGroup) {
      return result;
    }

    for (const group of response.relatedGroup.conceptGroup) {
      if (!group.conceptProperties) continue;

      for (const concept of group.conceptProperties) {
        const item = {
          rxcui: concept.rxcui,
          name: concept.name,
        };

        switch (group.tty) {
          case 'BN':
            result.brandNames.push(item);
            break;
          case 'IN':
          case 'PIN':
          case 'MIN':
            result.ingredients.push(item);
            break;
          case 'SCD':
          case 'SCDF':
            result.genericNames.push(item);
            break;
          case 'DFG':
            result.doseFormGroups.push(item);
            break;
        }
      }
    }

    // Cache the result
    await this.relatedCache.set(rxcui, result);

    return result;
  }

  /**
   * Get NDC (National Drug Code) codes for a drug by RxCUI
   */
  async getNDCs(rxcui: string): Promise<RxNormNDCResult> {
    // Check cache first
    const cached = await this.ndcCache.get(rxcui);
    if (cached) {
      return cached;
    }

    const endpoint = `/rxcui/${encodeURIComponent(rxcui)}/ndcs.json`;
    const response = await this.makeRequest<RxNormNDCResponse>(endpoint);

    const result: RxNormNDCResult = {
      rxcui,
      ndcCodes: [],
    };

    if (response?.ndcGroup?.ndcList?.ndc) {
      result.ndcCodes = response.ndcGroup.ndcList.ndc;
    }

    // Cache the result
    await this.ndcCache.set(rxcui, result);

    return result;
  }

  /**
   * Check for drug-drug interactions
   * Takes an array of RxCUIs and returns any interactions between them
   */
  async checkInteractions(rxcuis: string[]): Promise<RxNormInteractionsResult> {
    if (!rxcuis || rxcuis.length < 2) {
      return {
        hasInteractions: false,
        interactions: [],
        sources: [],
      };
    }

    // Sort rxcuis for consistent cache key
    const sortedRxcuis = [...rxcuis].sort();
    const cacheKey = sortedRxcuis.join('-');

    // Check cache first
    const cached = await this.interactionsCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Use the interaction API endpoint for multiple drugs
    const rxcuiList = sortedRxcuis.join('+');
    const endpoint = `/interaction/list.json?rxcuis=${encodeURIComponent(rxcuiList)}`;
    const response = await this.makeRequest<RxNormInteractionsResponse>(endpoint);

    const result: RxNormInteractionsResult = {
      hasInteractions: false,
      interactions: [],
      sources: [],
    };

    if (!response?.fullInteractionTypeGroup) {
      // Cache the result (no interactions)
      await this.interactionsCache.set(cacheKey, result);
      return result;
    }

    const sourcesSet = new Set<string>();

    for (const group of response.fullInteractionTypeGroup) {
      sourcesSet.add(group.sourceName);

      if (!group.fullInteractionType) continue;

      for (const interactionType of group.fullInteractionType) {
        if (!interactionType.interactionPair) continue;

        for (const pair of interactionType.interactionPair) {
          if (pair.interactionConcept && pair.interactionConcept.length >= 2) {
            const drug1 = pair.interactionConcept[0].minConceptItem;
            const drug2 = pair.interactionConcept[1].minConceptItem;

            const interaction: DrugInteraction = {
              sourceName: group.sourceName,
              severity: pair.severity,
              description: pair.description,
              drug1: {
                rxcui: drug1.rxcui,
                name: drug1.name,
              },
              drug2: {
                rxcui: drug2.rxcui,
                name: drug2.name,
              },
            };

            result.interactions.push(interaction);
          }
        }
      }
    }

    result.hasInteractions = result.interactions.length > 0;
    result.sources = Array.from(sourcesSet);

    // Cache the result
    await this.interactionsCache.set(cacheKey, result);

    return result;
  }

  /**
   * Get spelling suggestions for a drug name
   */
  async getSpellingSuggestions(term: string): Promise<string[]> {
    if (!term || term.trim().length < 2) {
      return [];
    }

    // Check cache first
    const cached = await this.spellingSuggestionsCache.get(term);
    if (cached) {
      return cached;
    }

    const endpoint = `/spellingsuggestions.json?name=${encodeURIComponent(term)}`;
    const response = await this.makeRequest<RxNormSpellingSuggestionsResponse>(endpoint);

    const suggestions = response?.suggestionGroup?.suggestionList?.suggestion || [];

    // Cache the result
    await this.spellingSuggestionsCache.set(term, suggestions);

    return suggestions;
  }

  /**
   * Get RxCUI by NDC code (reverse lookup)
   */
  async getRxCUIByNDC(ndc: string): Promise<string | null> {
    const endpoint = `/ndcstatus.json?ndc=${encodeURIComponent(ndc)}`;
    const response = await this.makeRequest<{
      ndcStatus?: {
        rxcui?: string;
        status?: string;
      };
    }>(endpoint);

    return response?.ndcStatus?.rxcui || null;
  }

  /**
   * Get approximate term matches (fuzzy search)
   */
  async getApproximateMatch(term: string, maxEntries = 5): Promise<RxNormSearchResult> {
    if (!term || term.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `approx:${term}:${maxEntries}`;

    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const endpoint = `/approximateTerm.json?term=${encodeURIComponent(term)}&maxEntries=${maxEntries}`;
    const response = await this.makeRequest<{
      approximateGroup?: {
        inputTerm?: string;
        candidate?: Array<{
          rxcui: string;
          rxaui?: string;
          score: string;
          rank: string;
        }>;
      };
    }>(endpoint);

    if (!response?.approximateGroup?.candidate) {
      return { matches: [], total: 0 };
    }

    // For each candidate, get the full concept info
    const matches: RxNormSearchResult['matches'] = [];

    for (const candidate of response.approximateGroup.candidate) {
      const lookupResult = await this.lookup(candidate.rxcui);
      if (lookupResult.found) {
        matches.push({
          code: lookupResult.code!,
          display: lookupResult.display!,
          system: RxNormService.SYSTEM,
          tty: lookupResult.tty,
        });
      }
    }

    const result: RxNormSearchResult = {
      matches,
      total: matches.length,
    };

    await this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Get all drug forms for an ingredient
   */
  async getDrugFormsByIngredient(ingredientRxcui: string): Promise<RxNormSearchResult> {
    const cacheKey = `forms:${ingredientRxcui}`;

    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get all SCD (Semantic Clinical Drug) and SBD (Semantic Branded Drug) related to this ingredient
    const endpoint = `/rxcui/${encodeURIComponent(ingredientRxcui)}/related.json?tty=SCD+SBD`;
    const response = await this.makeRequest<RxNormRelatedResponse>(endpoint);

    if (!response?.relatedGroup?.conceptGroup) {
      return { matches: [], total: 0 };
    }

    const matches: RxNormSearchResult['matches'] = [];

    for (const group of response.relatedGroup.conceptGroup) {
      if (!group.conceptProperties) continue;

      for (const concept of group.conceptProperties) {
        matches.push({
          code: concept.rxcui,
          display: concept.name,
          system: RxNormService.SYSTEM,
          tty: concept.tty,
        });
      }
    }

    const result: RxNormSearchResult = {
      matches,
      total: matches.length,
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
    await this.relatedCache.clear();
    await this.ndcCache.clear();
    await this.interactionsCache.clear();
    await this.spellingSuggestionsCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    lookup: { size: number; maxSize: number; hasRedis: boolean };
    search: { size: number; maxSize: number; hasRedis: boolean };
    related: { size: number; maxSize: number; hasRedis: boolean };
    ndc: { size: number; maxSize: number; hasRedis: boolean };
    interactions: { size: number; maxSize: number; hasRedis: boolean };
    spellingSuggestions: { size: number; maxSize: number; hasRedis: boolean };
  } {
    return {
      lookup: this.lookupCache.getStats(),
      search: this.searchCache.getStats(),
      related: this.relatedCache.getStats(),
      ndc: this.ndcCache.getStats(),
      interactions: this.interactionsCache.getStats(),
      spellingSuggestions: this.spellingSuggestionsCache.getStats(),
    };
  }

  /**
   * Get the RxNorm system URI
   */
  static getSystemUri(): string {
    return RxNormService.SYSTEM;
  }
}

// ============================================
// Singleton Instance Export
// ============================================

let defaultInstance: RxNormService | null = null;

export function getRxNormService(config?: Partial<RxNormConfig>): RxNormService {
  if (!defaultInstance || config) {
    defaultInstance = new RxNormService(config);
  }
  return defaultInstance;
}

export default RxNormService;
