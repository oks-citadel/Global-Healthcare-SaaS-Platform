import axios, { AxiosInstance } from 'axios';
import { FHIRResearchStudy, ResearchStudyStatus, FHIRCodeableConcept, EligibilityCriteria, CriterionItem } from '../types/fhir';

interface ClinicalTrialsGovStudy {
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      officialTitle?: string;
      organization?: {
        fullName?: string;
        class?: string;
      };
    };
    statusModule: {
      overallStatus: string;
      startDateStruct?: { date: string; type?: string };
      completionDateStruct?: { date: string; type?: string };
      primaryCompletionDateStruct?: { date: string; type?: string };
      lastUpdatePostDateStruct?: { date: string };
    };
    descriptionModule?: {
      briefSummary?: string;
      detailedDescription?: string;
    };
    conditionsModule?: {
      conditions?: string[];
      keywords?: string[];
    };
    designModule?: {
      studyType?: string;
      phases?: string[];
      designInfo?: {
        primaryPurpose?: string;
        interventionModel?: string;
        masking?: string;
        allocation?: string;
      };
      enrollmentInfo?: {
        count?: number;
        type?: string;
      };
    };
    armsInterventionsModule?: {
      interventions?: Array<{
        type: string;
        name: string;
        description?: string;
      }>;
    };
    eligibilityModule?: {
      eligibilityCriteria?: string;
      healthyVolunteers?: boolean;
      sex?: string;
      minimumAge?: string;
      maximumAge?: string;
    };
    contactsLocationsModule?: {
      centralContacts?: Array<{
        name?: string;
        phone?: string;
        email?: string;
      }>;
      overallOfficials?: Array<{
        name?: string;
        role?: string;
        affiliation?: string;
      }>;
      locations?: Array<{
        facility?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        geoPoint?: { lat: number; lon: number };
        status?: string;
        contacts?: Array<{
          name?: string;
          phone?: string;
          email?: string;
        }>;
      }>;
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: {
        name?: string;
        class?: string;
      };
      collaborators?: Array<{ name?: string }>;
    };
    outcomesModule?: {
      primaryOutcomes?: Array<{
        measure?: string;
        description?: string;
        timeFrame?: string;
      }>;
      secondaryOutcomes?: Array<{
        measure?: string;
        description?: string;
        timeFrame?: string;
      }>;
    };
    derivedSection?: {
      miscInfoModule?: {
        versionHolder?: string;
      };
      conditionBrowseModule?: {
        meshes?: Array<{ id?: string; term?: string }>;
      };
    };
  };
}

interface SearchParams {
  conditions?: string[];
  interventions?: string[];
  status?: string[];
  phase?: string[];
  studyType?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    distance?: number;
    lat?: number;
    lon?: number;
  };
  minAge?: number;
  maxAge?: number;
  gender?: string;
  healthyVolunteers?: boolean;
  pageSize?: number;
  pageToken?: string;
  sort?: string;
}

export class TrialRegistryService {
  private client: AxiosInstance;
  private baseUrl: string = 'https://clinicaltrials.gov/api/v2';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async searchTrials(params: SearchParams): Promise<{
    studies: any[];
    totalCount: number;
    nextPageToken?: string;
  }> {
    try {
      const queryParams: Record<string, string> = {};

      // Build query string
      const queryParts: string[] = [];

      if (params.conditions?.length) {
        queryParts.push(`COND:${params.conditions.join(' OR ')}`);
      }

      if (params.interventions?.length) {
        queryParts.push(`INTR:${params.interventions.join(' OR ')}`);
      }

      if (queryParts.length) {
        queryParams.query = queryParts.join(' AND ');
      }

      // Status filter
      if (params.status?.length) {
        queryParams['filter.overallStatus'] = params.status.join(',');
      }

      // Phase filter
      if (params.phase?.length) {
        queryParams['filter.phase'] = params.phase.join(',');
      }

      // Study type filter
      if (params.studyType) {
        queryParams['filter.studyType'] = params.studyType;
      }

      // Location filter
      if (params.location) {
        if (params.location.lat && params.location.lon && params.location.distance) {
          queryParams['filter.geo'] = `distance(${params.location.lat},${params.location.lon},${params.location.distance}mi)`;
        }
      }

      // Age filter
      if (params.minAge !== undefined || params.maxAge !== undefined) {
        const ageParts: string[] = [];
        if (params.minAge !== undefined) {
          ageParts.push(`MIN:${params.minAge}`);
        }
        if (params.maxAge !== undefined) {
          ageParts.push(`MAX:${params.maxAge}`);
        }
        queryParams['filter.advanced'] = `AREA[MinAge]${ageParts.join(' AND ')}`;
      }

      // Healthy volunteers
      if (params.healthyVolunteers !== undefined) {
        queryParams['filter.healthyVolunteers'] = params.healthyVolunteers ? 'true' : 'false';
      }

      // Pagination
      queryParams.pageSize = String(params.pageSize || 20);
      if (params.pageToken) {
        queryParams.pageToken = params.pageToken;
      }

      // Sort
      if (params.sort) {
        queryParams.sort = params.sort;
      }

      // Fields to return
      queryParams.fields = [
        'NCTId',
        'BriefTitle',
        'OfficialTitle',
        'OverallStatus',
        'Phase',
        'StudyType',
        'Condition',
        'InterventionName',
        'LocationFacility',
        'LocationCity',
        'LocationState',
        'LocationCountry',
        'LeadSponsorName',
        'StartDate',
        'CompletionDate',
        'EnrollmentCount',
        'EligibilityCriteria',
        'MinimumAge',
        'MaximumAge',
        'Sex',
      ].join(',');

      const response = await this.client.get('/studies', { params: queryParams });

      return {
        studies: response.data.studies || [],
        totalCount: response.data.totalCount || 0,
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error: any) {
      console.error('Error searching trials:', error.message);
      throw new Error(`Failed to search clinical trials: ${error.message}`);
    }
  }

  async getTrialByNctId(nctId: string): Promise<ClinicalTrialsGovStudy | null> {
    try {
      const response = await this.client.get(`/studies/${nctId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching trial:', error.message);
      throw new Error(`Failed to fetch trial ${nctId}: ${error.message}`);
    }
  }

  async getTrialsByNctIds(nctIds: string[]): Promise<ClinicalTrialsGovStudy[]> {
    try {
      const studies: ClinicalTrialsGovStudy[] = [];

      // Batch fetch to avoid rate limiting
      const batchSize = 10;
      for (let i = 0; i < nctIds.length; i += batchSize) {
        const batch = nctIds.slice(i, i + batchSize);
        const promises = batch.map((nctId) => this.getTrialByNctId(nctId));
        const results = await Promise.all(promises);
        studies.push(...results.filter((s): s is ClinicalTrialsGovStudy => s !== null));

        // Rate limiting delay
        if (i + batchSize < nctIds.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      return studies;
    } catch (error: any) {
      console.error('Error fetching trials:', error.message);
      throw new Error(`Failed to fetch trials: ${error.message}`);
    }
  }

  parseEligibilityCriteria(text: string): EligibilityCriteria {
    const criteria: EligibilityCriteria = {
      inclusion: [],
      exclusion: [],
    };

    if (!text) return criteria;

    const lines = text.split('\n');
    let currentSection: 'inclusion' | 'exclusion' | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Detect section headers
      if (/inclusion\s*criteria/i.test(trimmedLine)) {
        currentSection = 'inclusion';
        continue;
      }
      if (/exclusion\s*criteria/i.test(trimmedLine)) {
        currentSection = 'exclusion';
        continue;
      }

      // Skip empty lines or headers
      if (!trimmedLine || /^(key\s*)?eligibility/i.test(trimmedLine)) {
        continue;
      }

      // Parse criterion
      if (currentSection) {
        // Remove bullet points and numbering
        const cleanedText = trimmedLine
          .replace(/^[\d]+\.\s*/, '')
          .replace(/^[-*]\s*/, '')
          .replace(/^\([a-z]\)\s*/i, '')
          .trim();

        if (cleanedText.length > 0) {
          const criterion = this.parseCriterionText(cleanedText, criteria[currentSection].length);
          criteria[currentSection].push(criterion);
        }
      }
    }

    return criteria;
  }

  private parseCriterionText(text: string, index: number): CriterionItem {
    const criterion: CriterionItem = {
      id: `criterion_${index}`,
      text,
    };

    // Try to extract structured information
    const ageMatch = text.match(/(?:age|aged?)\s*(?:>=?|<=?|of)?\s*(\d+)\s*(?:years?|yrs?)?/i);
    if (ageMatch) {
      criterion.category = 'demographics';
      criterion.field = 'age';
      criterion.value = parseInt(ageMatch[1], 10);

      if (text.includes('>=') || text.includes('at least') || text.includes('minimum')) {
        criterion.operator = 'gte';
      } else if (text.includes('<=') || text.includes('at most') || text.includes('maximum')) {
        criterion.operator = 'lte';
      } else if (text.includes('>')) {
        criterion.operator = 'gt';
      } else if (text.includes('<')) {
        criterion.operator = 'lt';
      }
    }

    // Detect diagnosis/condition criteria
    if (/diagnos|confirmed|histolog|patholog|proven/i.test(text)) {
      criterion.category = 'condition';
    }

    // Detect lab value criteria
    const labMatch = text.match(/(hemoglobin|hgb|creatinine|bilirubin|platelets?|wbc|anc|ast|alt|egfr)\s*(?:>=?|<=?)\s*([\d.]+)/i);
    if (labMatch) {
      criterion.category = 'laboratory';
      criterion.field = labMatch[1].toLowerCase();
      criterion.value = parseFloat(labMatch[2]);
    }

    // Detect performance status
    if (/ecog|karnofsky|performance\s*status/i.test(text)) {
      criterion.category = 'performance_status';
    }

    // Detect prior therapy criteria
    if (/prior|previous|received|treated|failed|refractory/i.test(text)) {
      criterion.category = 'treatment_history';
    }

    return criterion;
  }

  convertToFHIRResearchStudy(study: ClinicalTrialsGovStudy): FHIRResearchStudy {
    const protocol = study.protocolSection;

    const mapStatus = (status: string): ResearchStudyStatus => {
      const statusMap: Record<string, ResearchStudyStatus> = {
        'RECRUITING': 'active',
        'NOT_YET_RECRUITING': 'approved',
        'ACTIVE_NOT_RECRUITING': 'closed-to-accrual',
        'ENROLLING_BY_INVITATION': 'active',
        'SUSPENDED': 'temporarily-closed-to-accrual',
        'TERMINATED': 'withdrawn',
        'COMPLETED': 'completed',
        'WITHDRAWN': 'withdrawn',
        'UNKNOWN': 'active',
      };
      return statusMap[status.toUpperCase().replace(/ /g, '_')] || 'active';
    };

    const mapPhase = (phases?: string[]): FHIRCodeableConcept | undefined => {
      if (!phases?.length) return undefined;
      const phase = phases[0];
      return {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
          code: phase.toLowerCase().replace(/\s+/g, '-'),
          display: phase,
        }],
        text: phases.join(', '),
      };
    };

    return {
      resourceType: 'ResearchStudy',
      id: protocol.identificationModule.nctId,
      identifier: [{
        system: 'https://clinicaltrials.gov',
        value: protocol.identificationModule.nctId,
      }],
      title: protocol.identificationModule.briefTitle,
      status: mapStatus(protocol.statusModule.overallStatus),
      phase: mapPhase(protocol.designModule?.phases),
      primaryPurposeType: protocol.designModule?.designInfo?.primaryPurpose
        ? {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/research-study-prim-purp-type',
              code: protocol.designModule.designInfo.primaryPurpose.toLowerCase().replace(/\s+/g, '-'),
              display: protocol.designModule.designInfo.primaryPurpose,
            }],
          }
        : undefined,
      condition: protocol.conditionsModule?.conditions?.map((c) => ({
        text: c,
      })),
      keyword: protocol.conditionsModule?.keywords?.map((k) => ({
        text: k,
      })),
      description: protocol.descriptionModule?.briefSummary,
      period: {
        start: protocol.statusModule.startDateStruct?.date,
        end: protocol.statusModule.completionDateStruct?.date,
      },
      sponsor: protocol.sponsorCollaboratorsModule?.leadSponsor
        ? {
            display: protocol.sponsorCollaboratorsModule.leadSponsor.name,
          }
        : undefined,
      contact: protocol.contactsLocationsModule?.centralContacts?.map((c) => ({
        name: c.name,
        telecom: [
          ...(c.phone ? [{ system: 'phone' as const, value: c.phone }] : []),
          ...(c.email ? [{ system: 'email' as const, value: c.email }] : []),
        ],
      })),
      site: protocol.contactsLocationsModule?.locations?.map((l) => ({
        display: `${l.facility}, ${l.city}${l.state ? `, ${l.state}` : ''}, ${l.country}`,
      })),
      note: protocol.descriptionModule?.detailedDescription
        ? [{
            text: protocol.descriptionModule.detailedDescription,
          }]
        : undefined,
    };
  }

  mapToInternalTrial(study: ClinicalTrialsGovStudy): Record<string, any> {
    const protocol = study.protocolSection;

    const parseAge = (ageString?: string): number | null => {
      if (!ageString) return null;
      const match = ageString.match(/(\d+)/);
      if (!match) return null;

      let years = parseInt(match[1], 10);

      if (/month/i.test(ageString)) {
        years = Math.floor(years / 12);
      } else if (/day/i.test(ageString)) {
        years = Math.floor(years / 365);
      }

      return years;
    };

    const mapPhase = (phases?: string[]): string | null => {
      if (!phases?.length) return null;
      const phaseMap: Record<string, string> = {
        'EARLY_PHASE1': 'early_phase_1',
        'PHASE1': 'phase_1',
        'PHASE1/PHASE2': 'phase_1_2',
        'PHASE2': 'phase_2',
        'PHASE2/PHASE3': 'phase_2_3',
        'PHASE3': 'phase_3',
        'PHASE4': 'phase_4',
        'NA': 'not_applicable',
      };
      return phaseMap[phases[0].toUpperCase().replace(/\s+/g, '')] || null;
    };

    const mapStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        'RECRUITING': 'recruiting',
        'NOT_YET_RECRUITING': 'not_yet_recruiting',
        'ACTIVE_NOT_RECRUITING': 'active_not_recruiting',
        'ENROLLING_BY_INVITATION': 'enrolling_by_invitation',
        'SUSPENDED': 'suspended',
        'TERMINATED': 'terminated',
        'COMPLETED': 'completed',
        'WITHDRAWN': 'withdrawn',
      };
      return statusMap[status.toUpperCase().replace(/ /g, '_')] || 'unknown';
    };

    const mapStudyType = (type?: string): string => {
      const typeMap: Record<string, string> = {
        'INTERVENTIONAL': 'interventional',
        'OBSERVATIONAL': 'observational',
        'EXPANDED_ACCESS': 'expanded_access',
        'PATIENT_REGISTRY': 'patient_registry',
      };
      return typeMap[type?.toUpperCase() || ''] || 'interventional';
    };

    const contact = protocol.contactsLocationsModule?.centralContacts?.[0];
    const official = protocol.contactsLocationsModule?.overallOfficials?.[0];

    return {
      nctId: protocol.identificationModule.nctId,
      title: protocol.identificationModule.briefTitle,
      officialTitle: protocol.identificationModule.officialTitle,
      briefSummary: protocol.descriptionModule?.briefSummary,
      detailedDescription: protocol.descriptionModule?.detailedDescription,
      status: mapStatus(protocol.statusModule.overallStatus),
      phase: mapPhase(protocol.designModule?.phases),
      studyType: mapStudyType(protocol.designModule?.studyType),
      primaryPurpose: protocol.designModule?.designInfo?.primaryPurpose,
      interventionModel: protocol.designModule?.designInfo?.interventionModel,
      masking: protocol.designModule?.designInfo?.masking,
      allocation: protocol.designModule?.designInfo?.allocation,
      enrollmentCount: protocol.designModule?.enrollmentInfo?.count,
      enrollmentType: protocol.designModule?.enrollmentInfo?.type,
      startDate: protocol.statusModule.startDateStruct?.date
        ? new Date(protocol.statusModule.startDateStruct.date)
        : null,
      completionDate: protocol.statusModule.completionDateStruct?.date
        ? new Date(protocol.statusModule.completionDateStruct.date)
        : null,
      primaryCompletionDate: protocol.statusModule.primaryCompletionDateStruct?.date
        ? new Date(protocol.statusModule.primaryCompletionDateStruct.date)
        : null,
      lastUpdatedDate: protocol.statusModule.lastUpdatePostDateStruct?.date
        ? new Date(protocol.statusModule.lastUpdatePostDateStruct.date)
        : null,
      sponsorName: protocol.sponsorCollaboratorsModule?.leadSponsor?.name,
      sponsorType: protocol.sponsorCollaboratorsModule?.leadSponsor?.class,
      leadSponsorClass: protocol.sponsorCollaboratorsModule?.leadSponsor?.class,
      collaborators: protocol.sponsorCollaboratorsModule?.collaborators?.map((c) => c.name) || [],
      conditions: protocol.conditionsModule?.conditions || [],
      interventions: protocol.armsInterventionsModule?.interventions || [],
      keywords: protocol.conditionsModule?.keywords || [],
      meshTerms: study.protocolSection.derivedSection?.conditionBrowseModule?.meshes?.map((m) => m.term || '') || [],
      primaryOutcomes: protocol.outcomesModule?.primaryOutcomes || [],
      secondaryOutcomes: protocol.outcomesModule?.secondaryOutcomes || [],
      eligibilityText: protocol.eligibilityModule?.eligibilityCriteria,
      eligibilityCriteria: this.parseEligibilityCriteria(protocol.eligibilityModule?.eligibilityCriteria || ''),
      healthyVolunteers: protocol.eligibilityModule?.healthyVolunteers || false,
      minimumAge: parseAge(protocol.eligibilityModule?.minimumAge),
      maximumAge: parseAge(protocol.eligibilityModule?.maximumAge),
      gender: protocol.eligibilityModule?.sex,
      contactName: contact?.name,
      contactPhone: contact?.phone,
      contactEmail: contact?.email,
      overallOfficial: official,
      locations: protocol.contactsLocationsModule?.locations || [],
      fhirResearchStudy: this.convertToFHIRResearchStudy(study),
      lastSyncedAt: new Date(),
    };
  }

  mapLocationsToSites(study: ClinicalTrialsGovStudy, trialId: string): Record<string, any>[] {
    const locations = study.protocolSection.contactsLocationsModule?.locations || [];

    return locations.map((loc) => ({
      trialId,
      facilityName: loc.facility || 'Unknown Facility',
      status: loc.status?.toLowerCase().includes('recruiting') ? 'recruiting' : 'pending',
      city: loc.city || 'Unknown',
      state: loc.state,
      country: loc.country || 'Unknown',
      zipCode: loc.zip,
      latitude: loc.geoPoint?.lat,
      longitude: loc.geoPoint?.lon,
      contactName: loc.contacts?.[0]?.name,
      contactPhone: loc.contacts?.[0]?.phone,
      contactEmail: loc.contacts?.[0]?.email,
      recruitmentStatus: loc.status,
      isActive: true,
    }));
  }
}

export default new TrialRegistryService();
