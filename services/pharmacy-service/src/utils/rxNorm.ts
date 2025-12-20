/**
 * RxNorm Utility Functions
 * RxNorm is a standardized nomenclature for clinical drugs produced by the NLM
 */

export interface RxNormConcept {
  rxcui: string;
  name: string;
  synonym?: string;
  tty?: string; // Term Type (SCD, SBD, GPCK, etc.)
  language?: string;
}

export class RxNormUtil {
  /**
   * Validate RxNorm CUI (Concept Unique Identifier)
   * RxCUI is typically a numeric string
   */
  static isValidRxCUI(rxcui: string): boolean {
    return /^\d+$/.test(rxcui);
  }

  /**
   * Format RxNorm code (normalize to standard format)
   */
  static formatRxCUI(rxcui: string): string {
    return rxcui.trim();
  }

  /**
   * Get RxNorm term types
   * Term types represent different levels of medication naming
   */
  static getTermTypes() {
    return {
      IN: 'Ingredient',
      PIN: 'Precise Ingredient',
      MIN: 'Multiple Ingredients',
      SCDC: 'Semantic Clinical Drug Component',
      SCDF: 'Semantic Clinical Drug Form',
      SCD: 'Semantic Clinical Drug',
      SBD: 'Semantic Branded Drug',
      GPCK: 'Generic Pack',
      BPCK: 'Branded Pack',
      SCDG: 'Semantic Clinical Drug Group',
      SBDG: 'Semantic Branded Drug Group',
      SBDC: 'Semantic Branded Drug Component',
      SBDF: 'Semantic Branded Drug Form',
    };
  }

  /**
   * Mock RxNorm lookup (in production, this would call RxNorm API)
   * https://rxnav.nlm.nih.gov/RxNormAPIs.html
   */
  static async lookupByName(drugName: string): Promise<RxNormConcept | null> {
    // In production, this would call:
    // https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term={drugName}

    // Mock implementation
    const mockDatabase: { [key: string]: RxNormConcept } = {
      'lisinopril 10 mg oral tablet': {
        rxcui: '314076',
        name: 'lisinopril 10 MG Oral Tablet',
        tty: 'SCD',
      },
      'metformin 500 mg oral tablet': {
        rxcui: '861007',
        name: 'metformin 500 MG Oral Tablet',
        tty: 'SCD',
      },
      'atorvastatin 20 mg oral tablet': {
        rxcui: '617318',
        name: 'atorvastatin 20 MG Oral Tablet',
        tty: 'SCD',
      },
      'oxycodone 5 mg oral tablet': {
        rxcui: '1049621',
        name: 'oxycodone 5 MG Oral Tablet',
        tty: 'SCD',
      },
    };

    const normalized = drugName.toLowerCase().trim();
    return mockDatabase[normalized] || null;
  }

  /**
   * Mock RxNorm lookup by RxCUI
   */
  static async lookupByRxCUI(rxcui: string): Promise<RxNormConcept | null> {
    // In production, this would call:
    // https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/properties.json

    if (!this.isValidRxCUI(rxcui)) {
      return null;
    }

    // Mock implementation
    const mockDatabase: { [key: string]: RxNormConcept } = {
      '314076': {
        rxcui: '314076',
        name: 'lisinopril 10 MG Oral Tablet',
        tty: 'SCD',
      },
      '861007': {
        rxcui: '861007',
        name: 'metformin 500 MG Oral Tablet',
        tty: 'SCD',
      },
    };

    return mockDatabase[rxcui] || null;
  }

  /**
   * Get related RxNorm concepts (e.g., generic equivalents, brand names)
   */
  static async getRelatedConcepts(rxcui: string): Promise<RxNormConcept[]> {
    // In production, this would call:
    // https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/related.json?tty=SBD+SCD

    // Mock implementation
    return [];
  }

  /**
   * Get drug interactions from RxNorm
   */
  static async getInteractions(rxcuiList: string[]): Promise<any[]> {
    // In production, this would call:
    // https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis={rxcuiList}

    // Mock implementation
    return [];
  }

  /**
   * Normalize drug name for comparison
   */
  static normalizeDrugName(drugName: string): string {
    return drugName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
  }

  /**
   * Extract strength from drug name
   */
  static extractStrength(drugName: string): string | null {
    // Match patterns like "10 mg", "500mg", "1.5g"
    const match = drugName.match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg|ml|%)/i);
    return match ? match[0] : null;
  }

  /**
   * Extract dosage form from drug name
   */
  static extractDosageForm(drugName: string): string | null {
    const forms = [
      'tablet',
      'capsule',
      'solution',
      'suspension',
      'injection',
      'cream',
      'ointment',
      'gel',
      'patch',
      'inhaler',
      'drops',
      'spray',
    ];

    const lowerName = drugName.toLowerCase();
    for (const form of forms) {
      if (lowerName.includes(form)) {
        return form;
      }
    }

    return null;
  }
}
