/**
 * Terminology Service Hooks
 * Production implementations for SNOMED CT, LOINC, ICD, RxNorm, and CVX integration
 *
 * These services connect to:
 * - SNOMED CT Snowstorm API
 * - LOINC FHIR API (https://fhir.loinc.org)
 * - ICD API (WHO ICD-11 and NLM ICD-10)
 * - RxNorm API (NLM)
 * - CVX (CDC Vaccine Codes with 80+ embedded codes)
 *
 * All services include caching, error handling, and timeout support.
 * Configuration via environment variables for API keys and endpoints.
 */

import type { CodeableConcept, Coding } from '../types/base';

// Re-export production terminology services
export {
  getSnomedService,
  SnomedService as ProductionSNOMEDService
} from './services/snomed.service';
export {
  getLoincService,
  LoincService as ProductionLOINCService
} from './services/loinc.service';
export {
  getIcdService,
  IcdService as ProductionICDService
} from './services/icd.service';
export {
  getRxNormService,
  RxNormService as ProductionRxNormService
} from './services/rxnorm.service';
export {
  getCvxService,
  CvxService as ProductionCVXService
} from './services/cvx.service';
export * from './services/cache';

export interface TerminologyLookupResult {
  found: boolean;
  code?: string;
  display?: string;
  system?: string;
  definition?: string;
  designations?: Array<{
    language?: string;
    use?: Coding;
    value: string;
  }>;
}

export interface TerminologySearchResult {
  matches: Array<{
    code: string;
    display: string;
    system: string;
  }>;
  total?: number;
}

/**
 * SNOMED CT Terminology Service
 * Uses the production SnomedService from ./services/snomed.service
 */
export class SNOMEDService {
  private static readonly SYSTEM = 'http://snomed.info/sct';

  /**
   * Lookup a SNOMED CT concept by code
   * Uses the production SnomedService to query the Snowstorm API
   */
  static async lookup(code: string): Promise<TerminologyLookupResult> {
    const snomedService = getSnomedService();
    const result = await snomedService.lookup(code);

    return {
      found: result.found,
      code: result.code,
      display: result.display,
      system: result.system,
      definition: result.fullySpecifiedName,
      designations: result.designations?.map(d => ({
        language: d.language,
        use: d.use ? {
          system: d.use.system,
          code: d.use.code,
          display: d.use.display,
        } : undefined,
        value: d.value,
      })),
    };
  }

  /**
   * Search SNOMED CT concepts
   * Uses the production SnomedService to query the Snowstorm API
   */
  static async search(query: string, limit = 10): Promise<TerminologySearchResult> {
    const snomedService = getSnomedService();
    const result = await snomedService.search(query, limit);

    return {
      matches: result.matches,
      total: result.total,
    };
  }

  /**
   * Validate a SNOMED CT CodeableConcept
   */
  static async validate(concept: CodeableConcept): Promise<boolean> {
    if (!concept.coding?.length) {
      return false;
    }

    for (const coding of concept.coding) {
      if (coding.system === this.SYSTEM && coding.code) {
        const result = await this.lookup(coding.code);
        if (result.found) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * LOINC Terminology Service
 * Uses the production LoincService from ./services/loinc.service
 */
export class LOINCService {
  private static readonly SYSTEM = 'http://loinc.org';

  /**
   * Lookup a LOINC code
   * Uses the production LoincService to query the LOINC FHIR API
   */
  static async lookup(code: string): Promise<TerminologyLookupResult> {
    const loincService = getLoincService();
    const result = await loincService.lookup(code);

    if (!result.found) {
      return { found: false };
    }

    return {
      found: true,
      code: result.code,
      display: result.display,
      system: result.system,
      definition: result.definition,
      designations: result.designations,
    };
  }

  /**
   * Search LOINC codes
   * Uses the production LoincService to query the LOINC FHIR API
   */
  static async search(query: string, limit = 10): Promise<TerminologySearchResult> {
    const loincService = getLoincService();
    const result = await loincService.search(query, limit);

    return {
      matches: result.matches,
      total: result.total,
    };
  }

  /**
   * Validate a LOINC CodeableConcept
   */
  static async validate(concept: CodeableConcept): Promise<boolean> {
    if (!concept.coding?.length) {
      return false;
    }

    for (const coding of concept.coding) {
      if (coding.system === this.SYSTEM && coding.code) {
        const result = await this.lookup(coding.code);
        if (result.found) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * ICD-10 Terminology Service
 * Uses the production IcdService from ./services/icd.service for actual API integration
 */
export class ICDService {
  private static readonly SYSTEM_ICD10 = 'http://hl7.org/fhir/sid/icd-10';
  private static readonly SYSTEM_ICD10_CM = 'http://hl7.org/fhir/sid/icd-10-cm';

  /**
   * Lookup an ICD-10 code using the production ICD service
   * Integrates with WHO ICD-11 API and NLM ICD-10 API
   */
  static async lookup(code: string, system?: string): Promise<TerminologyLookupResult> {
    const icdService = getIcdService();
    const result = await icdService.lookup(code, system);

    return {
      found: result.found,
      code: result.code,
      display: result.display,
      system: result.system || system || this.SYSTEM_ICD10,
      definition: result.definition,
      designations: result.designations,
    };
  }

  /**
   * Search ICD codes using the production ICD service
   */
  static async search(query: string, limit = 10): Promise<TerminologySearchResult> {
    const icdService = getIcdService();
    const result = await icdService.search(query, limit);

    return {
      matches: result.matches,
      total: result.total,
    };
  }

  /**
   * Validate an ICD CodeableConcept
   */
  static async validate(concept: CodeableConcept): Promise<boolean> {
    if (!concept.coding?.length) {
      return false;
    }

    for (const coding of concept.coding) {
      if (
        (coding.system === this.SYSTEM_ICD10 || coding.system === this.SYSTEM_ICD10_CM) &&
        coding.code
      ) {
        const result = await this.lookup(coding.code, coding.system);
        if (result.found) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * RxNorm Terminology Service
 * Integrates with the production RxNormService from ./services/rxnorm.service
 */
export class RxNormService {
  private static readonly SYSTEM = 'http://www.nlm.nih.gov/research/umls/rxnorm';

  /**
   * Lookup an RxNorm concept by RxCUI
   * Uses the production RxNormService to query the NLM RxNorm API
   */
  static async lookup(code: string): Promise<TerminologyLookupResult> {
    const service = getRxNormService();
    const result = await service.lookup(code);

    if (!result.found) {
      return { found: false };
    }

    return {
      found: true,
      code: result.code,
      display: result.display,
      system: this.SYSTEM,
      definition: result.termType ? `Term Type: ${result.termType}` : undefined,
    };
  }

  /**
   * Search RxNorm drugs
   * Uses the production RxNormService to query the NLM RxNorm API
   */
  static async search(query: string, limit = 10): Promise<TerminologySearchResult> {
    const service = getRxNormService();
    const result = await service.search(query, limit);

    return {
      matches: result.matches.map((match) => ({
        code: match.code,
        display: match.display,
        system: this.SYSTEM,
      })),
      total: result.total,
    };
  }

  /**
   * Validate an RxNorm CodeableConcept
   */
  static async validate(concept: CodeableConcept): Promise<boolean> {
    if (!concept.coding?.length) {
      return false;
    }

    for (const coding of concept.coding) {
      if (coding.system === this.SYSTEM && coding.code) {
        const result = await this.lookup(coding.code);
        if (result.found) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * CVX Vaccine Terminology Service
 * Integrates with the production CvxService from ./services/cvx.service
 */
export class CVXService {
  private static readonly SYSTEM = 'http://hl7.org/fhir/sid/cvx';

  /**
   * Lookup a CVX vaccine code
   * Uses the production CvxService with 80+ embedded vaccine codes
   */
  static async lookup(code: string): Promise<TerminologyLookupResult> {
    const cvxService = getCvxService();
    const result = await cvxService.lookup(code);

    if (result.found) {
      return {
        found: true,
        code: result.code,
        display: result.display,
        system: result.system,
        definition: result.fullName,
      };
    }

    return { found: false };
  }

  /**
   * Search CVX vaccines
   * Uses the production CvxService for full-text search
   */
  static async search(query: string, limit = 10): Promise<TerminologySearchResult> {
    const cvxService = getCvxService();
    const result = await cvxService.search(query, limit);

    return {
      matches: result.matches.map(match => ({
        code: match.code,
        display: match.display,
        system: match.system,
      })),
      total: result.total,
    };
  }

  /**
   * Validate a CVX CodeableConcept
   */
  static async validate(concept: CodeableConcept): Promise<boolean> {
    if (!concept.coding?.length) {
      return false;
    }

    for (const coding of concept.coding) {
      if (coding.system === this.SYSTEM && coding.code) {
        const result = await this.lookup(coding.code);
        if (result.found) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * Universal terminology lookup
 * Routes to appropriate service based on system URI
 */
export async function lookupCode(system: string, code: string): Promise<TerminologyLookupResult> {
  const systemLower = system.toLowerCase();

  if (systemLower.includes('snomed')) {
    return SNOMEDService.lookup(code);
  } else if (systemLower.includes('loinc')) {
    return LOINCService.lookup(code);
  } else if (systemLower.includes('icd')) {
    return ICDService.lookup(code, system);
  } else if (systemLower.includes('rxnorm')) {
    return RxNormService.lookup(code);
  } else if (systemLower.includes('cvx')) {
    return CVXService.lookup(code);
  }

  return {
    found: false,
  };
}

/**
 * Validate a CodeableConcept against its terminology system
 */
export async function validateCodeableConcept(concept: CodeableConcept): Promise<boolean> {
  if (!concept.coding?.length) {
    return false;
  }

  // Check if at least one coding is valid
  for (const coding of concept.coding) {
    if (!coding.system || !coding.code) continue;

    const result = await lookupCode(coding.system, coding.code);
    if (result.found) {
      return true;
    }
  }

  return false;
}
