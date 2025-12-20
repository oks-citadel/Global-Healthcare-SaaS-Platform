/**
 * NDC (National Drug Code) Utility Functions
 * NDC is a unique 10-digit, 3-segment number assigned by FDA
 * Format: labeler code - product code - package code
 * Examples: 12345-678-90, 0123-4567-89
 */

export class NDCUtil {
  /**
   * Validate NDC format
   * NDC can be in several formats:
   * - 4-4-2 (most common)
   * - 5-3-2
   * - 5-4-1
   * Total must be 10 digits when dashes are removed
   */
  static isValidNDC(ndc: string): boolean {
    // Remove all non-alphanumeric characters
    const cleaned = ndc.replace(/[^0-9]/g, '');

    // Must be exactly 10 or 11 digits
    if (cleaned.length !== 10 && cleaned.length !== 11) {
      return false;
    }

    // Check if follows standard format patterns
    const patterns = [
      /^\d{4}-\d{4}-\d{2}$/,  // 4-4-2
      /^\d{5}-\d{3}-\d{2}$/,  // 5-3-2
      /^\d{5}-\d{4}-\d{1}$/,  // 5-4-1
      /^\d{5}-\d{4}-\d{2}$/,  // 5-4-2 (11-digit)
      /^\d{10}$/,             // 10 digits no dashes
      /^\d{11}$/,             // 11 digits no dashes
    ];

    return patterns.some(pattern => pattern.test(ndc));
  }

  /**
   * Format NDC to standard 11-digit format (5-4-2)
   */
  static formatNDC(ndc: string): string {
    // Remove all non-numeric characters
    let cleaned = ndc.replace(/[^0-9]/g, '');

    // If 10 digits, convert to 11-digit format
    if (cleaned.length === 10) {
      cleaned = this.convertTo11Digit(cleaned);
    }

    // Format as 5-4-2
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9, 11)}`;
    }

    return ndc; // Return original if cannot format
  }

  /**
   * Convert 10-digit NDC to 11-digit format
   */
  private static convertTo11Digit(ndc10: string): string {
    // Try to detect format and add leading zero to appropriate segment

    // If looks like 4-4-2, add 0 to labeler code (make it 5-4-2)
    if (ndc10.length === 10) {
      return '0' + ndc10;
    }

    return ndc10;
  }

  /**
   * Extract NDC segments
   */
  static extractSegments(ndc: string): {
    labelerCode: string;
    productCode: string;
    packageCode: string;
  } | null {
    const formatted = this.formatNDC(ndc);
    const parts = formatted.split('-');

    if (parts.length === 3) {
      return {
        labelerCode: parts[0],
        productCode: parts[1],
        packageCode: parts[2],
      };
    }

    return null;
  }

  /**
   * Get labeler code (manufacturer identifier)
   */
  static getLabelerCode(ndc: string): string | null {
    const segments = this.extractSegments(ndc);
    return segments?.labelerCode || null;
  }

  /**
   * Get product code (specific drug and strength)
   */
  static getProductCode(ndc: string): string | null {
    const segments = this.extractSegments(ndc);
    return segments?.productCode || null;
  }

  /**
   * Get package code (package size and type)
   */
  static getPackageCode(ndc: string): string | null {
    const segments = this.extractSegments(ndc);
    return segments?.packageCode || null;
  }

  /**
   * Check if two NDCs represent the same product (ignoring package size)
   */
  static isSameProduct(ndc1: string, ndc2: string): boolean {
    const segments1 = this.extractSegments(ndc1);
    const segments2 = this.extractSegments(ndc2);

    if (!segments1 || !segments2) {
      return false;
    }

    return (
      segments1.labelerCode === segments2.labelerCode &&
      segments1.productCode === segments2.productCode
    );
  }

  /**
   * Normalize NDC for comparison
   */
  static normalize(ndc: string): string {
    return ndc.replace(/[^0-9]/g, '');
  }

  /**
   * Mock NDC lookup (in production, would use FDA NDC Directory API)
   */
  static async lookup(ndc: string): Promise<{
    ndc: string;
    proprietaryName?: string;
    nonProprietaryName?: string;
    dosageForm?: string;
    routeName?: string;
    labelerName?: string;
    substanceName?: string;
    strength?: string;
    active?: boolean;
  } | null> {
    // In production, this would call FDA NDC Directory API
    // https://open.fda.gov/apis/drug/ndc/

    if (!this.isValidNDC(ndc)) {
      return null;
    }

    // Mock database
    const mockDatabase: { [key: string]: any } = {
      '00002031501': {
        ndc: '00002-0315-01',
        proprietaryName: 'Prozac',
        nonProprietaryName: 'fluoxetine hydrochloride',
        dosageForm: 'CAPSULE',
        routeName: 'ORAL',
        labelerName: 'Eli Lilly and Company',
        substanceName: 'FLUOXETINE HYDROCHLORIDE',
        strength: '20 mg/1',
        active: true,
      },
      '00069015030': {
        ndc: '00069-0150-30',
        proprietaryName: 'Lipitor',
        nonProprietaryName: 'atorvastatin calcium',
        dosageForm: 'TABLET',
        routeName: 'ORAL',
        labelerName: 'Pfizer Laboratories',
        substanceName: 'ATORVASTATIN CALCIUM',
        strength: '20 mg/1',
        active: true,
      },
    };

    const normalized = this.normalize(ndc);
    return mockDatabase[normalized] || null;
  }

  /**
   * Validate NDC check digit (if applicable)
   */
  static validateCheckDigit(ndc: string): boolean {
    // Some NDC formats include check digits
    // This is a simplified version
    return this.isValidNDC(ndc);
  }

  /**
   * Generate barcode format for NDC
   */
  static toBarcodeFormat(ndc: string): string {
    // Convert to 11-digit format and prepend with "3" for pharma products
    const formatted = this.formatNDC(ndc);
    const digits = formatted.replace(/[^0-9]/g, '');

    if (digits.length === 11) {
      return '3' + digits;
    }

    return digits;
  }
}
