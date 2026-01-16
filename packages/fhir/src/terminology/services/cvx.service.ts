/**
 * CVX (Vaccine Administered) Terminology Service
 * Integrates with CDC CVX data for vaccine code lookups
 *
 * CDC CVX Reference: https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 * FHIR System URI: http://hl7.org/fhir/sid/cvx
 */

import { TerminologyCache, createTerminologyCache } from './cache';

// ============================================
// Type Definitions
// ============================================

export interface CvxConfig {
  /** Base URL for CDC CVX data API */
  baseUrl: string;
  /** Base URL for CDC MVX (manufacturer) data API */
  mvxBaseUrl: string;
  /** API timeout in milliseconds */
  timeout: number;
  /** Optional API key if required */
  apiKey?: string;
}

/**
 * CVX Vaccine Code representation
 */
export interface CvxVaccine {
  /** CVX code (numeric string) */
  cvxCode: string;
  /** Short description of the vaccine */
  shortDescription: string;
  /** Full/long description of the vaccine */
  fullVaccineName: string;
  /** Additional notes about the vaccine */
  notes?: string;
  /** Vaccine status: 'Active', 'Inactive', 'Pending', 'Non-vaccine' */
  status: CvxVaccineStatus;
  /** Date the code was last updated */
  lastUpdated?: string;
  /** Internal CDC ID */
  internalId?: string;
}

export type CvxVaccineStatus = 'Active' | 'Inactive' | 'Pending' | 'Non-vaccine' | 'Never Active';

/**
 * CVX Vaccine Group classification
 */
export interface CvxVaccineGroup {
  /** Group code/identifier */
  groupCode: string;
  /** Group name/description */
  groupName: string;
  /** CVX codes that belong to this group */
  cvxCodes: string[];
}

/**
 * MVX (Manufacturer) Code representation
 */
export interface MvxManufacturer {
  /** MVX code (typically 3 characters) */
  mvxCode: string;
  /** Manufacturer name */
  manufacturerName: string;
  /** Manufacturer status */
  status: 'Active' | 'Inactive';
  /** Notes about the manufacturer */
  notes?: string;
  /** Last update date */
  lastUpdated?: string;
}

/**
 * CVX to MVX mapping (product level)
 */
export interface CvxMvxMapping {
  /** CVX code */
  cvxCode: string;
  /** CVX short description */
  cvxDescription: string;
  /** MVX code */
  mvxCode: string;
  /** Manufacturer name */
  manufacturerName: string;
  /** Product name */
  productName?: string;
  /** NDC codes associated */
  ndcCodes?: string[];
  /** Start date for this mapping */
  startDate?: string;
  /** End date for this mapping (if discontinued) */
  endDate?: string;
}

/**
 * Result from CVX lookup operation
 */
export interface CvxLookupResult {
  /** Whether the code was found */
  found: boolean;
  /** The CVX code */
  code?: string;
  /** Display name (short description) */
  display?: string;
  /** FHIR system URI */
  system: string;
  /** Full vaccine name */
  fullName?: string;
  /** Additional notes */
  notes?: string;
  /** Vaccine status */
  status?: CvxVaccineStatus;
  /** Last update date */
  lastUpdated?: string;
  /** FHIR designations */
  designations?: Array<{
    language?: string;
    use?: { system?: string; code?: string; display?: string };
    value: string;
  }>;
}

/**
 * Result from CVX search operation
 */
export interface CvxSearchResult {
  /** Matching vaccines */
  matches: Array<{
    code: string;
    display: string;
    system: string;
    status?: CvxVaccineStatus;
  }>;
  /** Total count of matches */
  total?: number;
}

/**
 * Result from vaccine group lookup
 */
export interface CvxVaccineGroupResult {
  /** List of vaccine groups */
  groups: CvxVaccineGroup[];
  /** Total count */
  total: number;
}

/**
 * Result from CVX to MVX mapping
 */
export interface CvxMvxMappingResult {
  /** Whether mappings were found */
  found: boolean;
  /** CVX code queried */
  cvxCode: string;
  /** List of manufacturer mappings */
  mappings: CvxMvxMapping[];
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_CONFIG: CvxConfig = {
  // CDC doesn't have a direct REST API, so we'll use a proxy or local data
  // These URLs are placeholders - in production, you might use:
  // 1. A cached/mirrored version of CDC data
  // 2. HL7 FHIR terminology server (tx.fhir.org)
  // 3. Local embedded data
  baseUrl: process.env.CVX_API_URL || 'https://tx.fhir.org/r4',
  mvxBaseUrl: process.env.MVX_API_URL || 'https://tx.fhir.org/r4',
  timeout: parseInt(process.env.CVX_TIMEOUT || '30000', 10),
  apiKey: process.env.CVX_API_KEY,
};

// ============================================
// Embedded CVX Data (Core vaccines for offline/fallback)
// ============================================

const EMBEDDED_CVX_VACCINES: CvxVaccine[] = [
  { cvxCode: '01', shortDescription: 'DTP', fullVaccineName: 'diphtheria, tetanus toxoids and pertussis vaccine', status: 'Inactive' },
  { cvxCode: '02', shortDescription: 'OPV', fullVaccineName: 'trivalent poliovirus vaccine, live, oral', status: 'Inactive' },
  { cvxCode: '03', shortDescription: 'MMR', fullVaccineName: 'measles, mumps and rubella virus vaccine', status: 'Active' },
  { cvxCode: '04', shortDescription: 'M/R', fullVaccineName: 'measles and rubella virus vaccine', status: 'Inactive' },
  { cvxCode: '05', shortDescription: 'measles', fullVaccineName: 'measles virus vaccine', status: 'Inactive' },
  { cvxCode: '06', shortDescription: 'rubella', fullVaccineName: 'rubella virus vaccine', status: 'Inactive' },
  { cvxCode: '07', shortDescription: 'mumps', fullVaccineName: 'mumps virus vaccine', status: 'Inactive' },
  { cvxCode: '08', shortDescription: 'Hep B, adolescent or pediatric', fullVaccineName: 'hepatitis B vaccine, pediatric or pediatric/adolescent dosage', status: 'Active' },
  { cvxCode: '09', shortDescription: 'Td (adult)', fullVaccineName: 'tetanus and diphtheria toxoids, adsorbed, for adult use', status: 'Active' },
  { cvxCode: '10', shortDescription: 'IPV', fullVaccineName: 'poliovirus vaccine, inactivated', status: 'Active' },
  { cvxCode: '20', shortDescription: 'DTaP', fullVaccineName: 'diphtheria, tetanus toxoids and acellular pertussis vaccine', status: 'Active' },
  { cvxCode: '21', shortDescription: 'varicella', fullVaccineName: 'varicella virus vaccine', status: 'Active' },
  { cvxCode: '22', shortDescription: 'DTP-Hib', fullVaccineName: 'DTP-Haemophilus influenzae type b conjugate vaccine', status: 'Inactive' },
  { cvxCode: '33', shortDescription: 'pneumococcal polysaccharide PPV23', fullVaccineName: 'pneumococcal polysaccharide vaccine, 23 valent', status: 'Active' },
  { cvxCode: '43', shortDescription: 'Hep B, adult', fullVaccineName: 'hepatitis B vaccine, adult dosage', status: 'Active' },
  { cvxCode: '44', shortDescription: 'Hep B, dialysis', fullVaccineName: 'hepatitis B vaccine, dialysis patient dosage', status: 'Active' },
  { cvxCode: '45', shortDescription: 'Hep B, unspecified formulation', fullVaccineName: 'hepatitis B vaccine, unspecified formulation', status: 'Inactive' },
  { cvxCode: '46', shortDescription: 'Hib (PRP-D)', fullVaccineName: 'Haemophilus influenzae type b vaccine, PRP-D conjugate', status: 'Inactive' },
  { cvxCode: '47', shortDescription: 'Hib (HbOC)', fullVaccineName: 'Haemophilus influenzae type b vaccine, HbOC conjugate', status: 'Inactive' },
  { cvxCode: '48', shortDescription: 'Hib (PRP-T)', fullVaccineName: 'Haemophilus influenzae type b vaccine, PRP-T conjugate', status: 'Active' },
  { cvxCode: '49', shortDescription: 'Hib (PRP-OMP)', fullVaccineName: 'Haemophilus influenzae type b vaccine, PRP-OMP conjugate', status: 'Active' },
  { cvxCode: '50', shortDescription: 'DTaP-Hib', fullVaccineName: 'DTaP-Haemophilus influenzae type b conjugate vaccine', status: 'Active' },
  { cvxCode: '51', shortDescription: 'Hib-Hep B', fullVaccineName: 'Haemophilus influenzae type b conjugate and hepatitis B vaccine', status: 'Active' },
  { cvxCode: '52', shortDescription: 'Hep A, adult', fullVaccineName: 'hepatitis A vaccine, adult dosage', status: 'Active' },
  { cvxCode: '83', shortDescription: 'Hep A, ped/adol, 2 dose', fullVaccineName: 'hepatitis A vaccine, pediatric/adolescent dosage, 2 dose schedule', status: 'Active' },
  { cvxCode: '84', shortDescription: 'Hep A, ped/adol, 3 dose', fullVaccineName: 'hepatitis A vaccine, pediatric/adolescent dosage, 3 dose schedule', status: 'Inactive' },
  { cvxCode: '85', shortDescription: 'Hep A, unspecified formulation', fullVaccineName: 'hepatitis A vaccine, unspecified formulation', status: 'Inactive' },
  { cvxCode: '88', shortDescription: 'influenza, unspecified formulation', fullVaccineName: 'influenza virus vaccine, unspecified formulation', status: 'Active' },
  { cvxCode: '94', shortDescription: 'MMRV', fullVaccineName: 'measles, mumps, rubella, and varicella virus vaccine', status: 'Active' },
  { cvxCode: '104', shortDescription: 'Hep A-Hep B', fullVaccineName: 'hepatitis A and hepatitis B vaccine', status: 'Active' },
  { cvxCode: '110', shortDescription: 'DTaP-Hep B-IPV', fullVaccineName: 'diphtheria, tetanus toxoids and acellular pertussis vaccine, hepatitis B, and inactivated poliovirus vaccine', status: 'Active' },
  { cvxCode: '113', shortDescription: 'Td (adult), preservative free', fullVaccineName: 'tetanus and diphtheria toxoids, adsorbed, preservative free, for adult use', status: 'Active' },
  { cvxCode: '114', shortDescription: 'meningococcal MCV4P', fullVaccineName: 'meningococcal polysaccharide (groups A, C, Y and W-135) diphtheria toxoid conjugate vaccine', status: 'Active' },
  { cvxCode: '115', shortDescription: 'Tdap', fullVaccineName: 'tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed', status: 'Active' },
  { cvxCode: '116', shortDescription: 'rotavirus, pentavalent', fullVaccineName: 'rotavirus, live, pentavalent vaccine', status: 'Active' },
  { cvxCode: '118', shortDescription: 'HPV, bivalent', fullVaccineName: 'human papillomavirus vaccine, bivalent', status: 'Inactive' },
  { cvxCode: '119', shortDescription: 'rotavirus, monovalent', fullVaccineName: 'rotavirus, live, monovalent vaccine', status: 'Active' },
  { cvxCode: '120', shortDescription: 'DTaP-Hib-IPV', fullVaccineName: 'diphtheria, tetanus toxoids and acellular pertussis vaccine, Haemophilus influenzae type b conjugate, and inactivated poliovirus vaccine', status: 'Active' },
  { cvxCode: '121', shortDescription: 'zoster, live', fullVaccineName: 'zoster vaccine, live', status: 'Active' },
  { cvxCode: '127', shortDescription: 'pneumococcal conjugate PCV 13', fullVaccineName: 'pneumococcal vaccine, 13-valent, conjugate', status: 'Active' },
  { cvxCode: '133', shortDescription: 'PCV13', fullVaccineName: 'pneumococcal conjugate vaccine, 13 valent', status: 'Active' },
  { cvxCode: '136', shortDescription: 'meningococcal MCV4O', fullVaccineName: 'meningococcal oligosaccharide (groups A, C, Y and W-135) diphtheria toxoid conjugate vaccine', status: 'Active' },
  { cvxCode: '140', shortDescription: 'influenza, seasonal, intradermal, preservative free', fullVaccineName: 'influenza, seasonal, intradermal, preservative free', status: 'Active' },
  { cvxCode: '141', shortDescription: 'influenza, seasonal, injectable', fullVaccineName: 'influenza, seasonal, injectable', status: 'Active' },
  { cvxCode: '149', shortDescription: 'influenza, live, intranasal, quadrivalent', fullVaccineName: 'influenza, live, intranasal, quadrivalent', status: 'Active' },
  { cvxCode: '150', shortDescription: 'influenza, injectable, quadrivalent, preservative free', fullVaccineName: 'influenza, injectable, quadrivalent, preservative free', status: 'Active' },
  { cvxCode: '158', shortDescription: 'influenza, injectable, quadrivalent', fullVaccineName: 'influenza, injectable, quadrivalent, contains preservative', status: 'Active' },
  { cvxCode: '161', shortDescription: 'influenza, injectable, quadrivalent, preservative free, pediatric', fullVaccineName: 'influenza, injectable, quadrivalent, preservative free, pediatric', status: 'Active' },
  { cvxCode: '162', shortDescription: 'meningococcal B, recombinant', fullVaccineName: 'meningococcal B vaccine, fully recombinant', status: 'Active' },
  { cvxCode: '163', shortDescription: 'meningococcal B, OMV', fullVaccineName: 'meningococcal B vaccine, outer membrane vesicle', status: 'Active' },
  { cvxCode: '165', shortDescription: 'HPV9', fullVaccineName: 'human papillomavirus 9-valent vaccine', status: 'Active' },
  { cvxCode: '166', shortDescription: 'influenza, intradermal, quadrivalent, preservative free', fullVaccineName: 'influenza, intradermal, quadrivalent, preservative free, injectable', status: 'Active' },
  { cvxCode: '168', shortDescription: 'influenza, trivalent, adjuvanted', fullVaccineName: 'influenza, trivalent, adjuvanted', status: 'Active' },
  { cvxCode: '171', shortDescription: 'influenza, injectable, MDCK, preservative free, quadrivalent', fullVaccineName: 'influenza, injectable, Madin Darby Canine Kidney, preservative free, quadrivalent', status: 'Active' },
  { cvxCode: '185', shortDescription: 'influenza, recombinant, quadrivalent, injectable, preservative free', fullVaccineName: 'influenza, recombinant, quadrivalent, injectable, preservative free', status: 'Active' },
  { cvxCode: '186', shortDescription: 'influenza, injectable, MDCK, preservative, quadrivalent', fullVaccineName: 'influenza, injectable, Madin Darby Canine Kidney, preservative, quadrivalent', status: 'Active' },
  { cvxCode: '187', shortDescription: 'zoster, recombinant', fullVaccineName: 'zoster vaccine recombinant', status: 'Active' },
  { cvxCode: '189', shortDescription: 'Hep B, adjuvanted', fullVaccineName: 'hepatitis B vaccine (recombinant), CpG adjuvanted', status: 'Active' },
  { cvxCode: '197', shortDescription: 'influenza, high-dose, quadrivalent', fullVaccineName: 'influenza, high-dose seasonal, quadrivalent, preservative free', status: 'Active' },
  { cvxCode: '205', shortDescription: 'influenza, adjuvanted, quadrivalent', fullVaccineName: 'influenza, seasonal virus vaccine, quadrivalent, adjuvanted', status: 'Active' },
  { cvxCode: '207', shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5mL dose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 100 mcg/0.5mL dose', status: 'Active' },
  { cvxCode: '208', shortDescription: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 30 mcg/0.3mL dose', status: 'Active' },
  { cvxCode: '210', shortDescription: 'COVID-19 vaccine, vector-nr, rS-ChAdOx1, PF, 0.5 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, vector non-replicating, recombinant spike protein-ChAdOx1, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '211', shortDescription: 'COVID-19, subunit, rS-nanoparticle+Matrix-M1 Adjuvant, PF, 0.5 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, Subunit, recombinant spike protein-nanoparticle+Matrix-M1 Adjuvant, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '212', shortDescription: 'COVID-19, vector-nr, rS-Ad26, PF, 0.5 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, vector non-replicating, recombinant spike protein-Ad26, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '213', shortDescription: 'COVID-19, unspecified', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, unspecified', status: 'Active' },
  { cvxCode: '215', shortDescription: 'PCV15', fullVaccineName: 'pneumococcal conjugate vaccine, 15 valent', status: 'Active' },
  { cvxCode: '216', shortDescription: 'PCV20', fullVaccineName: 'pneumococcal conjugate vaccine, 20 valent', status: 'Active' },
  { cvxCode: '217', shortDescription: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose, tris-sucrose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 30 mcg/0.3mL dose, tris-sucrose formulation', status: 'Active' },
  { cvxCode: '218', shortDescription: 'COVID-19, mRNA, LNP-S, PF, 10 mcg/0.2 mL dose, tris-sucrose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 10 mcg/0.2mL dose, tris-sucrose formulation', status: 'Active' },
  { cvxCode: '219', shortDescription: 'COVID-19, mRNA, LNP-S, PF, 3 mcg/0.2 mL dose, tris-sucrose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, preservative free, 3 mcg/0.2mL dose, tris-sucrose formulation', status: 'Active' },
  { cvxCode: '221', shortDescription: 'COVID-19, mRNA, LNP-S, bivalent booster, PF, 50 mcg/0.5 mL or 25mcg/0.25 mL dose', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, bivalent booster, preservative free, 50 mcg/0.5 mL or 25mcg/0.25 mL dose', status: 'Active' },
  { cvxCode: '228', shortDescription: 'COVID-19, mRNA, LNP-S, bivalent booster, PF, 10 mcg/0.2 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, bivalent, preservative free, 10 mcg/0.2 mL', status: 'Active' },
  { cvxCode: '229', shortDescription: 'COVID-19, mRNA, LNP-S, bivalent, PF, 25 mcg/0.25 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, bivalent, preservative free, 25 mcg/0.25 mL', status: 'Active' },
  { cvxCode: '230', shortDescription: 'COVID-19, mRNA, LNP-S, bivalent, PF, 50 mcg/0.5 mL', fullVaccineName: 'SARS-COV-2 (COVID-19) vaccine, mRNA, spike protein, LNP, bivalent, preservative free, 50 mcg/0.5 mL', status: 'Active' },
  { cvxCode: '300', shortDescription: 'RSV, bivalent, protein subunit, PF, 0.5 mL', fullVaccineName: 'respiratory syncytial virus vaccine, bivalent, protein subunit, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '301', shortDescription: 'RSV, recombinant, protein subunit, adjuvanted, PF, 0.5 mL', fullVaccineName: 'respiratory syncytial virus vaccine, recombinant, protein subunit, adjuvanted, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '302', shortDescription: 'RSV, mRNA, PF, 0.5 mL', fullVaccineName: 'respiratory syncytial virus vaccine, mRNA, preservative free, 0.5 mL', status: 'Active' },
  { cvxCode: '998', shortDescription: 'no vaccine administered', fullVaccineName: 'no vaccine administered', status: 'Non-vaccine' },
  { cvxCode: '999', shortDescription: 'unknown vaccine or immune globulin', fullVaccineName: 'unknown vaccine or immune globulin', status: 'Non-vaccine' },
];

/**
 * Embedded vaccine groups
 */
const EMBEDDED_VACCINE_GROUPS: CvxVaccineGroup[] = [
  { groupCode: 'DTAP', groupName: 'DTaP Vaccines', cvxCodes: ['01', '20', '22', '50', '106', '107', '110', '120', '130', '132', '146', '170'] },
  { groupCode: 'FLU', groupName: 'Influenza Vaccines', cvxCodes: ['88', '135', '140', '141', '144', '149', '150', '153', '155', '158', '161', '166', '168', '171', '185', '186', '197', '205'] },
  { groupCode: 'HEPA', groupName: 'Hepatitis A Vaccines', cvxCodes: ['52', '83', '84', '85', '104'] },
  { groupCode: 'HEPB', groupName: 'Hepatitis B Vaccines', cvxCodes: ['08', '42', '43', '44', '45', '51', '104', '110', '189', '220'] },
  { groupCode: 'HIB', groupName: 'Hib Vaccines', cvxCodes: ['17', '22', '46', '47', '48', '49', '50', '51', '120', '132', '146', '148', '170'] },
  { groupCode: 'HPV', groupName: 'HPV Vaccines', cvxCodes: ['62', '118', '137', '165'] },
  { groupCode: 'IPV', groupName: 'Polio Vaccines', cvxCodes: ['02', '10', '89', '110', '120', '132', '146', '147'] },
  { groupCode: 'MCV', groupName: 'Meningococcal Vaccines', cvxCodes: ['32', '103', '108', '114', '136', '147', '148', '162', '163', '164', '167', '191', '203'] },
  { groupCode: 'MMR', groupName: 'MMR Vaccines', cvxCodes: ['03', '04', '05', '06', '07', '94'] },
  { groupCode: 'PCV', groupName: 'Pneumococcal Vaccines', cvxCodes: ['33', '100', '109', '127', '133', '152', '215', '216'] },
  { groupCode: 'ROTA', groupName: 'Rotavirus Vaccines', cvxCodes: ['74', '116', '119', '122'] },
  { groupCode: 'TD', groupName: 'Td Vaccines', cvxCodes: ['09', '113', '138', '139'] },
  { groupCode: 'TDAP', groupName: 'Tdap Vaccines', cvxCodes: ['115'] },
  { groupCode: 'VAR', groupName: 'Varicella Vaccines', cvxCodes: ['21', '94'] },
  { groupCode: 'ZOSTER', groupName: 'Zoster Vaccines', cvxCodes: ['121', '187', '188'] },
  { groupCode: 'COVID', groupName: 'COVID-19 Vaccines', cvxCodes: ['207', '208', '210', '211', '212', '213', '217', '218', '219', '221', '228', '229', '230', '500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '512', '513', '514', '515', '516', '517', '518', '519', '520'] },
  { groupCode: 'RSV', groupName: 'RSV Vaccines', cvxCodes: ['300', '301', '302', '303', '304', '305', '306'] },
];

/**
 * Embedded MVX manufacturer codes (subset)
 */
const EMBEDDED_MVX_MANUFACTURERS: MvxManufacturer[] = [
  { mvxCode: 'AB', manufacturerName: 'Abbott Laboratories', status: 'Active' },
  { mvxCode: 'ALP', manufacturerName: 'Alpha Therapeutic Corporation', status: 'Inactive' },
  { mvxCode: 'AR', manufacturerName: 'Armour', status: 'Inactive' },
  { mvxCode: 'AVB', manufacturerName: 'Aventis Behring L.L.C.', status: 'Inactive' },
  { mvxCode: 'AVI', manufacturerName: 'Aviron', status: 'Inactive' },
  { mvxCode: 'BA', manufacturerName: 'Baxter Healthcare Corporation', status: 'Active' },
  { mvxCode: 'BAH', manufacturerName: 'Baxter Healthcare Corporation-inactive', status: 'Inactive' },
  { mvxCode: 'BAY', manufacturerName: 'Bayer Corporation', status: 'Inactive' },
  { mvxCode: 'BP', manufacturerName: 'Berna Products', status: 'Inactive' },
  { mvxCode: 'BPC', manufacturerName: 'Berna Products Corporation', status: 'Inactive' },
  { mvxCode: 'BN', manufacturerName: 'BioNTech Manufacturing GmbH', status: 'Active' },
  { mvxCode: 'CEN', manufacturerName: 'Centeon L.L.C.', status: 'Inactive' },
  { mvxCode: 'CHI', manufacturerName: 'Chiron Corporation', status: 'Inactive' },
  { mvxCode: 'CMP', manufacturerName: 'Celltech Medeva Pharmaceuticals', status: 'Inactive' },
  { mvxCode: 'CNJ', manufacturerName: 'Cangene Corporation', status: 'Active' },
  { mvxCode: 'CON', manufacturerName: 'Connaught', status: 'Inactive' },
  { mvxCode: 'DVC', manufacturerName: 'DynCorp', status: 'Inactive' },
  { mvxCode: 'EVN', manufacturerName: 'Evans Medical Limited', status: 'Inactive' },
  { mvxCode: 'GEO', manufacturerName: 'GeoVax Labs, Inc.', status: 'Active' },
  { mvxCode: 'GRE', manufacturerName: 'Greer Laboratories, Inc.', status: 'Active' },
  { mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', status: 'Active' },
  { mvxCode: 'IDB', manufacturerName: 'ID Biomedical', status: 'Active' },
  { mvxCode: 'IUS', manufacturerName: 'Immuno-U.S., Inc.', status: 'Inactive' },
  { mvxCode: 'JNJ', manufacturerName: 'Johnson & Johnson', status: 'Active' },
  { mvxCode: 'JSN', manufacturerName: 'Janssen', status: 'Active' },
  { mvxCode: 'KGC', manufacturerName: 'Korea Green Cross Corporation', status: 'Active' },
  { mvxCode: 'LED', manufacturerName: 'Lederle', status: 'Inactive' },
  { mvxCode: 'MBL', manufacturerName: 'Massachusetts Biologic Laboratories', status: 'Active' },
  { mvxCode: 'MED', manufacturerName: 'MedImmune, Inc.', status: 'Active' },
  { mvxCode: 'MIL', manufacturerName: 'Miles', status: 'Inactive' },
  { mvxCode: 'MOD', manufacturerName: 'Moderna US, Inc.', status: 'Active' },
  { mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', status: 'Active' },
  { mvxCode: 'NAB', manufacturerName: 'NABI', status: 'Inactive' },
  { mvxCode: 'NOV', manufacturerName: 'Novartis Pharmaceutical Corporation', status: 'Active' },
  { mvxCode: 'NVX', manufacturerName: 'Novavax, Inc.', status: 'Active' },
  { mvxCode: 'NYB', manufacturerName: 'New York Blood Center', status: 'Active' },
  { mvxCode: 'ORT', manufacturerName: 'Ortho Clinical Diagnostics', status: 'Inactive' },
  { mvxCode: 'OTC', manufacturerName: 'Organon Teknika Corporation', status: 'Inactive' },
  { mvxCode: 'PD', manufacturerName: 'Parkedale Pharmaceuticals', status: 'Inactive' },
  { mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', status: 'Active' },
  { mvxCode: 'PMC', manufacturerName: 'Aventis Pasteur Inc', status: 'Inactive' },
  { mvxCode: 'PRX', manufacturerName: 'Praxis Biologics', status: 'Inactive' },
  { mvxCode: 'SCL', manufacturerName: 'Sclavo, Inc.', status: 'Inactive' },
  { mvxCode: 'SI', manufacturerName: 'Swiss Serum and Vaccine Inst.', status: 'Inactive' },
  { mvxCode: 'SKB', manufacturerName: 'SmithKline Beecham', status: 'Inactive' },
  { mvxCode: 'SOL', manufacturerName: 'Solvay Pharmaceuticals', status: 'Inactive' },
  { mvxCode: 'SPM', manufacturerName: 'Sanofi Pasteur MSD', status: 'Active' },
  { mvxCode: 'TAL', manufacturerName: 'Talecris Biotherapeutics', status: 'Inactive' },
  { mvxCode: 'USA', manufacturerName: 'United States Army Medical Research and Material Command', status: 'Active' },
  { mvxCode: 'VXG', manufacturerName: 'VaxGen', status: 'Inactive' },
  { mvxCode: 'WAL', manufacturerName: 'Wyeth-Ayerst', status: 'Inactive' },
  { mvxCode: 'WSD', manufacturerName: 'Wyeth', status: 'Inactive' },
  { mvxCode: 'ZLB', manufacturerName: 'ZLB Behring', status: 'Inactive' },
  { mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', status: 'Active' },
  { mvxCode: 'SEQ', manufacturerName: 'Seqirus', status: 'Active' },
  { mvxCode: 'AZN', manufacturerName: 'AstraZeneca', status: 'Active' },
];

/**
 * Embedded CVX to MVX mappings (common vaccines)
 */
const EMBEDDED_CVX_MVX_MAPPINGS: CvxMvxMapping[] = [
  { cvxCode: '03', cvxDescription: 'MMR', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'M-M-R II' },
  { cvxCode: '08', cvxDescription: 'Hep B, adolescent or pediatric', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Recombivax HB' },
  { cvxCode: '08', cvxDescription: 'Hep B, adolescent or pediatric', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Engerix-B' },
  { cvxCode: '10', cvxDescription: 'IPV', mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', productName: 'IPOL' },
  { cvxCode: '20', cvxDescription: 'DTaP', mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', productName: 'Daptacel' },
  { cvxCode: '20', cvxDescription: 'DTaP', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Infanrix' },
  { cvxCode: '21', cvxDescription: 'varicella', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Varivax' },
  { cvxCode: '43', cvxDescription: 'Hep B, adult', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Recombivax HB' },
  { cvxCode: '43', cvxDescription: 'Hep B, adult', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Engerix-B' },
  { cvxCode: '48', cvxDescription: 'Hib (PRP-T)', mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', productName: 'ActHIB' },
  { cvxCode: '52', cvxDescription: 'Hep A, adult', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Vaqta' },
  { cvxCode: '52', cvxDescription: 'Hep A, adult', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Havrix' },
  { cvxCode: '83', cvxDescription: 'Hep A, ped/adol, 2 dose', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Vaqta' },
  { cvxCode: '83', cvxDescription: 'Hep A, ped/adol, 2 dose', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Havrix' },
  { cvxCode: '94', cvxDescription: 'MMRV', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'ProQuad' },
  { cvxCode: '110', cvxDescription: 'DTaP-Hep B-IPV', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Pediarix' },
  { cvxCode: '114', cvxDescription: 'meningococcal MCV4P', mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', productName: 'Menactra' },
  { cvxCode: '115', cvxDescription: 'Tdap', mvxCode: 'SNF', manufacturerName: 'Sanofi Pasteur', productName: 'Adacel' },
  { cvxCode: '115', cvxDescription: 'Tdap', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Boostrix' },
  { cvxCode: '116', cvxDescription: 'rotavirus, pentavalent', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'RotaTeq' },
  { cvxCode: '119', cvxDescription: 'rotavirus, monovalent', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Rotarix' },
  { cvxCode: '127', cvxDescription: 'pneumococcal conjugate PCV 13', mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', productName: 'Prevnar 13' },
  { cvxCode: '133', cvxDescription: 'PCV13', mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', productName: 'Prevnar 13' },
  { cvxCode: '165', cvxDescription: 'HPV9', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Gardasil 9' },
  { cvxCode: '187', cvxDescription: 'zoster, recombinant', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Shingrix' },
  { cvxCode: '207', cvxDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5mL dose', mvxCode: 'MOD', manufacturerName: 'Moderna US, Inc.', productName: 'Spikevax' },
  { cvxCode: '208', cvxDescription: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose', mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', productName: 'Comirnaty' },
  { cvxCode: '210', cvxDescription: 'COVID-19 vaccine, vector-nr, rS-ChAdOx1, PF, 0.5 mL', mvxCode: 'AZN', manufacturerName: 'AstraZeneca', productName: 'Vaxzevria' },
  { cvxCode: '211', cvxDescription: 'COVID-19, subunit, rS-nanoparticle+Matrix-M1 Adjuvant, PF, 0.5 mL', mvxCode: 'NVX', manufacturerName: 'Novavax, Inc.', productName: 'Nuvaxovid' },
  { cvxCode: '212', cvxDescription: 'COVID-19, vector-nr, rS-Ad26, PF, 0.5 mL', mvxCode: 'JSN', manufacturerName: 'Janssen', productName: 'Jcovden' },
  { cvxCode: '215', cvxDescription: 'PCV15', mvxCode: 'MSD', manufacturerName: 'Merck & Co., Inc.', productName: 'Vaxneuvance' },
  { cvxCode: '216', cvxDescription: 'PCV20', mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', productName: 'Prevnar 20' },
  { cvxCode: '300', cvxDescription: 'RSV, bivalent, protein subunit, PF, 0.5 mL', mvxCode: 'PFR', manufacturerName: 'Pfizer, Inc', productName: 'Abrysvo' },
  { cvxCode: '301', cvxDescription: 'RSV, recombinant, protein subunit, adjuvanted, PF, 0.5 mL', mvxCode: 'GSK', manufacturerName: 'GlaxoSmithKline', productName: 'Arexvy' },
];

// ============================================
// CVX Service Implementation
// ============================================

export class CvxService {
  /** FHIR System URI for CVX codes */
  private static readonly SYSTEM = 'http://hl7.org/fhir/sid/cvx';
  /** FHIR System URI for MVX codes */
  private static readonly MVX_SYSTEM = 'http://hl7.org/fhir/sid/mvx';

  private config: CvxConfig;
  private lookupCache: TerminologyCache<CvxLookupResult>;
  private searchCache: TerminologyCache<CvxSearchResult>;
  private groupCache: TerminologyCache<CvxVaccineGroupResult>;
  private mvxCache: TerminologyCache<CvxMvxMappingResult>;

  constructor(config: Partial<CvxConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.lookupCache = createTerminologyCache<CvxLookupResult>('cvx:lookup', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for lookups
    });
    this.searchCache = createTerminologyCache<CvxSearchResult>('cvx:search', {
      defaultTTL: 60 * 60 * 1000, // 1 hour for searches
    });
    this.groupCache = createTerminologyCache<CvxVaccineGroupResult>('cvx:groups', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for groups
    });
    this.mvxCache = createTerminologyCache<CvxMvxMappingResult>('cvx:mvx', {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for MVX mappings
    });
  }

  /**
   * Build request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
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
        console.error(`CVX API error: ${response.status} ${response.statusText}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('CVX API request timeout');
      } else {
        console.error('CVX API request failed:', error);
      }
      return null;
    }
  }

  /**
   * Lookup a vaccine by CVX code
   * Returns detailed information about the vaccine
   */
  async lookup(code: string): Promise<CvxLookupResult> {
    // Normalize the code (remove leading zeros if provided as number)
    const normalizedCode = code.toString().padStart(2, '0');

    // Check cache first
    const cached = await this.lookupCache.get(normalizedCode);
    if (cached) {
      return cached;
    }

    // Try embedded data first (faster and works offline)
    const embeddedVaccine = EMBEDDED_CVX_VACCINES.find(
      v => v.cvxCode === normalizedCode || v.cvxCode === code
    );

    if (embeddedVaccine) {
      const result: CvxLookupResult = {
        found: true,
        code: embeddedVaccine.cvxCode,
        display: embeddedVaccine.shortDescription,
        system: CvxService.SYSTEM,
        fullName: embeddedVaccine.fullVaccineName,
        notes: embeddedVaccine.notes,
        status: embeddedVaccine.status,
        lastUpdated: embeddedVaccine.lastUpdated,
        designations: [
          {
            use: {
              system: 'http://terminology.hl7.org/CodeSystem/designation-usage',
              code: 'display',
              display: 'Display',
            },
            value: embeddedVaccine.shortDescription,
          },
          {
            use: {
              system: 'http://terminology.hl7.org/CodeSystem/designation-usage',
              code: 'definition',
              display: 'Definition',
            },
            value: embeddedVaccine.fullVaccineName,
          },
        ],
      };

      await this.lookupCache.set(normalizedCode, result);
      return result;
    }

    // Try FHIR terminology server for codes not in embedded data
    const endpoint = `/CodeSystem/$lookup?system=${encodeURIComponent(CvxService.SYSTEM)}&code=${encodeURIComponent(normalizedCode)}`;

    interface FhirLookupResponse {
      resourceType: string;
      parameter?: Array<{
        name: string;
        valueString?: string;
        valueCode?: string;
        valueBoolean?: boolean;
        part?: Array<{
          name: string;
          valueString?: string;
          valueCode?: string;
          valueCoding?: {
            system?: string;
            code?: string;
            display?: string;
          };
        }>;
      }>;
    }

    const response = await this.makeRequest<FhirLookupResponse>(endpoint);

    if (!response || response.resourceType !== 'Parameters') {
      return {
        found: false,
        system: CvxService.SYSTEM,
      };
    }

    const params = response.parameter || [];
    const displayParam = params.find(p => p.name === 'display');
    const definitionParam = params.find(p => p.name === 'definition');

    const result: CvxLookupResult = {
      found: true,
      code: normalizedCode,
      display: displayParam?.valueString,
      system: CvxService.SYSTEM,
      fullName: definitionParam?.valueString,
    };

    await this.lookupCache.set(normalizedCode, result);
    return result;
  }

  /**
   * Search vaccines by name or description
   * Supports partial matching on short description and full vaccine name
   */
  async search(query: string, limit = 20, offset = 0): Promise<CvxSearchResult> {
    if (!query || query.trim().length < 2) {
      return { matches: [], total: 0 };
    }

    const cacheKey = `${query.toLowerCase()}:${limit}:${offset}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const lowerQuery = query.toLowerCase().trim();

    // Search embedded data
    const matches = EMBEDDED_CVX_VACCINES.filter(vaccine => {
      const shortMatch = vaccine.shortDescription.toLowerCase().includes(lowerQuery);
      const fullMatch = vaccine.fullVaccineName.toLowerCase().includes(lowerQuery);
      const codeMatch = vaccine.cvxCode.includes(query);
      return shortMatch || fullMatch || codeMatch;
    });

    // Sort by relevance (exact matches first, then by code)
    matches.sort((a, b) => {
      const aExact = a.shortDescription.toLowerCase() === lowerQuery || a.cvxCode === query;
      const bExact = b.shortDescription.toLowerCase() === lowerQuery || b.cvxCode === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return parseInt(a.cvxCode) - parseInt(b.cvxCode);
    });

    const total = matches.length;
    const paginatedMatches = matches.slice(offset, offset + limit);

    const result: CvxSearchResult = {
      matches: paginatedMatches.map(vaccine => ({
        code: vaccine.cvxCode,
        display: vaccine.shortDescription,
        system: CvxService.SYSTEM,
        status: vaccine.status,
      })),
      total,
    };

    await this.searchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get all vaccine group classifications
   * Groups organize vaccines into categories (e.g., Influenza, COVID-19, etc.)
   */
  async getVaccineGroups(): Promise<CvxVaccineGroupResult> {
    const cacheKey = 'all-groups';

    // Check cache first
    const cached = await this.groupCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result: CvxVaccineGroupResult = {
      groups: EMBEDDED_VACCINE_GROUPS,
      total: EMBEDDED_VACCINE_GROUPS.length,
    };

    await this.groupCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get all vaccines in a specific group
   * @param group Group code (e.g., 'FLU', 'COVID', 'MMR')
   */
  async getVaccinesByGroup(group: string): Promise<CvxSearchResult> {
    const cacheKey = `group:${group.toUpperCase()}`;

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const vaccineGroup = EMBEDDED_VACCINE_GROUPS.find(
      g => g.groupCode.toUpperCase() === group.toUpperCase()
    );

    if (!vaccineGroup) {
      return { matches: [], total: 0 };
    }

    const matches: CvxSearchResult['matches'] = [];

    for (const cvxCode of vaccineGroup.cvxCodes) {
      const vaccine = EMBEDDED_CVX_VACCINES.find(v => v.cvxCode === cvxCode);
      if (vaccine) {
        matches.push({
          code: vaccine.cvxCode,
          display: vaccine.shortDescription,
          system: CvxService.SYSTEM,
          status: vaccine.status,
        });
      }
    }

    const result: CvxSearchResult = {
      matches,
      total: matches.length,
    };

    await this.searchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get only active vaccines
   * Filters out inactive, pending, and non-vaccine codes
   */
  async getActiveVaccines(): Promise<CvxSearchResult> {
    const cacheKey = 'active-vaccines';

    // Check cache first
    const cached = await this.searchCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const activeVaccines = EMBEDDED_CVX_VACCINES.filter(
      vaccine => vaccine.status === 'Active'
    );

    const result: CvxSearchResult = {
      matches: activeVaccines.map(vaccine => ({
        code: vaccine.cvxCode,
        display: vaccine.shortDescription,
        system: CvxService.SYSTEM,
        status: vaccine.status,
      })),
      total: activeVaccines.length,
    };

    await this.searchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Map a CVX code to MVX manufacturer codes
   * Returns all manufacturers that produce vaccines for this CVX code
   */
  async mapToMVX(cvxCode: string): Promise<CvxMvxMappingResult> {
    // Normalize the code
    const normalizedCode = cvxCode.toString().padStart(2, '0');
    const cacheKey = `mvx:${normalizedCode}`;

    // Check cache first
    const cached = await this.mvxCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Find all MVX mappings for this CVX code
    const mappings = EMBEDDED_CVX_MVX_MAPPINGS.filter(
      m => m.cvxCode === normalizedCode || m.cvxCode === cvxCode
    );

    const result: CvxMvxMappingResult = {
      found: mappings.length > 0,
      cvxCode: normalizedCode,
      mappings,
    };

    await this.mvxCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get manufacturer information by MVX code
   */
  async getMvxManufacturer(mvxCode: string): Promise<MvxManufacturer | null> {
    const manufacturer = EMBEDDED_MVX_MANUFACTURERS.find(
      m => m.mvxCode.toUpperCase() === mvxCode.toUpperCase()
    );
    return manufacturer || null;
  }

  /**
   * Get all MVX manufacturers
   */
  async getAllManufacturers(activeOnly = false): Promise<MvxManufacturer[]> {
    if (activeOnly) {
      return EMBEDDED_MVX_MANUFACTURERS.filter(m => m.status === 'Active');
    }
    return [...EMBEDDED_MVX_MANUFACTURERS];
  }

  /**
   * Validate a CVX code
   * Returns true if the code is a valid CVX code
   */
  async validate(code: string): Promise<boolean> {
    const result = await this.lookup(code);
    return result.found;
  }

  /**
   * Get the FHIR system URI for CVX codes
   */
  static getSystem(): string {
    return CvxService.SYSTEM;
  }

  /**
   * Get the FHIR system URI for MVX codes
   */
  static getMvxSystem(): string {
    return CvxService.MVX_SYSTEM;
  }

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    await this.lookupCache.clear();
    await this.searchCache.clear();
    await this.groupCache.clear();
    await this.mvxCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    lookup: { size: number; maxSize: number; hasRedis: boolean };
    search: { size: number; maxSize: number; hasRedis: boolean };
    groups: { size: number; maxSize: number; hasRedis: boolean };
    mvx: { size: number; maxSize: number; hasRedis: boolean };
  } {
    return {
      lookup: this.lookupCache.getStats(),
      search: this.searchCache.getStats(),
      groups: this.groupCache.getStats(),
      mvx: this.mvxCache.getStats(),
    };
  }
}

// ============================================
// Singleton Instance Export
// ============================================

let defaultInstance: CvxService | null = null;

/**
 * Get the default CVX service instance
 * Creates a new instance if one doesn't exist or if config is provided
 */
export function getCvxService(config?: Partial<CvxConfig>): CvxService {
  if (!defaultInstance || config) {
    defaultInstance = new CvxService(config);
  }
  return defaultInstance;
}

export default CvxService;
