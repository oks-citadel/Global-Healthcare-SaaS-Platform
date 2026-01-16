import { getDistance } from 'geolib';
import eligibilityService, { EligibilityResult, TrialEligibility } from './eligibility.service';
import { PatientProfile, MatchResult, SiteDistance, EligibilityCriteria } from '../types/fhir';

export interface TrialForMatching {
  id: string;
  nctId: string;
  title: string;
  status: string;
  phase?: string;
  conditions: string[];
  minimumAge?: number;
  maximumAge?: number;
  gender?: string;
  healthyVolunteers?: boolean;
  eligibilityCriteria?: EligibilityCriteria;
  eligibilityText?: string;
  sites?: SiteForMatching[];
  keywords?: string[];
  meshTerms?: string[];
  interventions?: any[];
}

export interface SiteForMatching {
  id: string;
  facilityName: string;
  city: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  status: string;
  isActive: boolean;
}

export interface MatchingOptions {
  maxDistance?: number; // in miles
  distanceUnit?: 'miles' | 'km';
  minMatchScore?: number;
  includeInactive?: boolean;
  statusFilter?: string[];
  phaseFilter?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'score' | 'distance' | 'relevance';
}

export interface MatchingResult {
  matches: TrialMatch[];
  totalCount: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  processingTime: number;
}

export interface TrialMatch {
  trial: {
    id: string;
    nctId: string;
    title: string;
    status: string;
    phase?: string;
    conditions: string[];
  };
  matchScore: number;
  eligibilityStatus: 'eligible' | 'potentially_eligible' | 'ineligible' | 'unknown';
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  uncertainCriteria: string[];
  distance?: number;
  distanceUnit: 'miles' | 'km';
  nearestSites: SiteDistance[];
  matchDetails: {
    conditionMatch: number;
    demographicMatch: number;
    criteriaMatch: number;
    proximityScore: number;
  };
}

export class MatchingService {
  private readonly EARTH_RADIUS_MILES = 3959;
  private readonly EARTH_RADIUS_KM = 6371;

  /**
   * Match a patient profile against multiple clinical trials
   */
  async matchPatientToTrials(
    patient: PatientProfile,
    trials: TrialForMatching[],
    options: MatchingOptions = {}
  ): Promise<MatchingResult> {
    const startTime = Date.now();
    const {
      maxDistance = 100,
      distanceUnit = 'miles',
      minMatchScore = 0,
      includeInactive = false,
      statusFilter = ['recruiting', 'enrolling_by_invitation', 'not_yet_recruiting'],
      phaseFilter,
      limit = 50,
      offset = 0,
      sortBy = 'score',
    } = options;

    // Filter trials by status and phase
    let filteredTrials = trials.filter((trial) => {
      if (!includeInactive && !statusFilter.includes(trial.status)) {
        return false;
      }
      if (phaseFilter?.length && trial.phase && !phaseFilter.includes(trial.phase)) {
        return false;
      }
      return true;
    });

    // Calculate matches
    const matches: TrialMatch[] = [];

    for (const trial of filteredTrials) {
      const match = await this.calculateTrialMatch(patient, trial, { maxDistance, distanceUnit });

      if (match && match.matchScore >= minMatchScore) {
        matches.push(match);
      }
    }

    // Sort matches
    this.sortMatches(matches, sortBy);

    // Apply pagination
    const totalCount = matches.length;
    const paginatedMatches = matches.slice(offset, offset + limit);

    return {
      matches: paginatedMatches,
      totalCount,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Calculate match between a patient and a single trial
   */
  async calculateTrialMatch(
    patient: PatientProfile,
    trial: TrialForMatching,
    options: { maxDistance?: number; distanceUnit?: 'miles' | 'km' } = {}
  ): Promise<TrialMatch | null> {
    const { maxDistance = 100, distanceUnit = 'miles' } = options;

    // Calculate eligibility
    const trialEligibility: TrialEligibility = {
      minimumAge: trial.minimumAge,
      maximumAge: trial.maximumAge,
      gender: trial.gender,
      healthyVolunteers: trial.healthyVolunteers,
      eligibilityCriteria: trial.eligibilityCriteria,
      eligibilityText: trial.eligibilityText,
      conditions: trial.conditions,
    };

    const eligibilityResult = eligibilityService.evaluateEligibility(patient, trialEligibility);

    // Calculate site distances
    let nearestSites: SiteDistance[] = [];
    let minDistance: number | undefined;

    if (patient.location && trial.sites?.length) {
      nearestSites = this.calculateSiteDistances(
        patient.location,
        trial.sites.filter((s) => s.isActive && s.latitude && s.longitude),
        distanceUnit
      );

      // Filter by max distance
      nearestSites = nearestSites.filter((s) => s.distance <= maxDistance);

      if (nearestSites.length > 0) {
        minDistance = nearestSites[0].distance;
      }
    }

    // If no sites within distance and location is required, skip
    if (patient.location && trial.sites?.length && nearestSites.length === 0) {
      // Still include but with low proximity score
      minDistance = undefined;
    }

    // Calculate component scores
    const conditionMatch = this.calculateConditionMatchScore(patient.conditions, trial.conditions);
    const demographicMatch = this.calculateDemographicMatchScore(eligibilityResult);
    const criteriaMatch = eligibilityResult.score;
    const proximityScore = this.calculateProximityScore(minDistance, maxDistance);

    // Calculate overall match score
    const matchScore = this.calculateOverallMatchScore({
      conditionMatch,
      demographicMatch,
      criteriaMatch,
      proximityScore,
    });

    return {
      trial: {
        id: trial.id,
        nctId: trial.nctId,
        title: trial.title,
        status: trial.status,
        phase: trial.phase,
        conditions: trial.conditions,
      },
      matchScore,
      eligibilityStatus: eligibilityResult.status,
      matchedCriteria: eligibilityResult.matchedCriteria,
      unmatchedCriteria: eligibilityResult.unmatchedCriteria,
      uncertainCriteria: eligibilityResult.uncertainCriteria,
      distance: minDistance,
      distanceUnit,
      nearestSites: nearestSites.slice(0, 5), // Return top 5 nearest sites
      matchDetails: {
        conditionMatch,
        demographicMatch,
        criteriaMatch,
        proximityScore,
      },
    };
  }

  /**
   * Calculate distances from patient location to trial sites
   */
  private calculateSiteDistances(
    patientLocation: { latitude: number; longitude: number },
    sites: SiteForMatching[],
    unit: 'miles' | 'km'
  ): SiteDistance[] {
    const distances: SiteDistance[] = [];

    for (const site of sites) {
      if (!site.latitude || !site.longitude) continue;

      const distanceMeters = getDistance(
        { latitude: patientLocation.latitude, longitude: patientLocation.longitude },
        { latitude: site.latitude, longitude: site.longitude }
      );

      // Convert to requested unit
      const distanceInUnit = unit === 'miles'
        ? distanceMeters / 1609.344
        : distanceMeters / 1000;

      distances.push({
        siteId: site.id,
        name: site.facilityName,
        distance: Math.round(distanceInUnit * 10) / 10,
        unit,
      });
    }

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance);

    return distances;
  }

  /**
   * Calculate condition match score using text similarity
   */
  private calculateConditionMatchScore(
    patientConditions: string[],
    trialConditions: string[]
  ): number {
    if (!trialConditions.length) return 100;
    if (!patientConditions.length) return 0;

    let matchedCount = 0;
    const normalizedPatient = patientConditions.map((c) => c.toLowerCase());
    const normalizedTrial = trialConditions.map((c) => c.toLowerCase());

    for (const trialCondition of normalizedTrial) {
      const words = trialCondition.split(/\s+/).filter((w) => w.length > 3);

      for (const patientCondition of normalizedPatient) {
        // Calculate word overlap
        const patientWords = patientCondition.split(/\s+/);
        const matchingWords = words.filter((w) =>
          patientWords.some((pw) => pw.includes(w) || w.includes(pw))
        );

        if (matchingWords.length >= Math.ceil(words.length * 0.5)) {
          matchedCount++;
          break;
        }
      }
    }

    return Math.round((matchedCount / normalizedTrial.length) * 100);
  }

  /**
   * Calculate demographic match score from eligibility result
   */
  private calculateDemographicMatchScore(eligibilityResult: EligibilityResult): number {
    const demographicCriteria = eligibilityResult.details.filter(
      (d) => ['age', 'gender'].includes(d.criterionId)
    );

    if (!demographicCriteria.length) return 100;

    const metCount = demographicCriteria.filter((d) => d.result === 'met').length;
    return Math.round((metCount / demographicCriteria.length) * 100);
  }

  /**
   * Calculate proximity score based on distance
   */
  private calculateProximityScore(distance?: number, maxDistance: number = 100): number {
    if (distance === undefined) return 50; // Neutral score if no location
    if (distance <= 25) return 100;
    if (distance <= 50) return 80;
    if (distance <= maxDistance) return 60;
    return 40;
  }

  /**
   * Calculate overall match score from components
   */
  private calculateOverallMatchScore(components: {
    conditionMatch: number;
    demographicMatch: number;
    criteriaMatch: number;
    proximityScore: number;
  }): number {
    // Weighted average
    const weights = {
      conditionMatch: 0.30,
      demographicMatch: 0.20,
      criteriaMatch: 0.35,
      proximityScore: 0.15,
    };

    const score =
      components.conditionMatch * weights.conditionMatch +
      components.demographicMatch * weights.demographicMatch +
      components.criteriaMatch * weights.criteriaMatch +
      components.proximityScore * weights.proximityScore;

    return Math.round(score);
  }

  /**
   * Sort matches by specified criteria
   */
  private sortMatches(matches: TrialMatch[], sortBy: string): void {
    switch (sortBy) {
      case 'distance':
        matches.sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;

      case 'relevance':
        // Sort by condition match first, then score
        matches.sort((a, b) => {
          const conditionDiff = b.matchDetails.conditionMatch - a.matchDetails.conditionMatch;
          if (conditionDiff !== 0) return conditionDiff;
          return b.matchScore - a.matchScore;
        });
        break;

      case 'score':
      default:
        matches.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }
  }

  /**
   * Find trials by condition keywords
   */
  async findTrialsByCondition(
    condition: string,
    trials: TrialForMatching[]
  ): Promise<TrialForMatching[]> {
    const normalizedCondition = condition.toLowerCase();
    const words = normalizedCondition.split(/\s+/).filter((w) => w.length > 3);

    return trials.filter((trial) => {
      // Check conditions
      const conditionMatch = trial.conditions.some((c) => {
        const lowerCondition = c.toLowerCase();
        return words.some((w) => lowerCondition.includes(w));
      });

      if (conditionMatch) return true;

      // Check keywords
      if (trial.keywords) {
        const keywordMatch = trial.keywords.some((k) => {
          const lowerKeyword = k.toLowerCase();
          return words.some((w) => lowerKeyword.includes(w));
        });
        if (keywordMatch) return true;
      }

      // Check mesh terms
      if (trial.meshTerms) {
        const meshMatch = trial.meshTerms.some((m) => {
          const lowerMesh = m.toLowerCase();
          return words.some((w) => lowerMesh.includes(w));
        });
        if (meshMatch) return true;
      }

      return false;
    });
  }

  /**
   * Generate match summary for reporting
   */
  generateMatchSummary(matches: TrialMatch[]): {
    totalMatches: number;
    eligibleCount: number;
    potentiallyEligibleCount: number;
    averageScore: number;
    averageDistance?: number;
    topConditions: string[];
  } {
    const eligibleCount = matches.filter((m) => m.eligibilityStatus === 'eligible').length;
    const potentiallyEligibleCount = matches.filter(
      (m) => m.eligibilityStatus === 'potentially_eligible'
    ).length;

    const averageScore = matches.length > 0
      ? Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)
      : 0;

    const matchesWithDistance = matches.filter((m) => m.distance !== undefined);
    const averageDistance = matchesWithDistance.length > 0
      ? Math.round(
          matchesWithDistance.reduce((sum, m) => sum + (m.distance || 0), 0) /
            matchesWithDistance.length
        )
      : undefined;

    // Get top conditions from matches
    const conditionCounts = new Map<string, number>();
    for (const match of matches) {
      for (const condition of match.trial.conditions) {
        conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
      }
    }

    const topConditions = Array.from(conditionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([condition]) => condition);

    return {
      totalMatches: matches.length,
      eligibleCount,
      potentiallyEligibleCount,
      averageScore,
      averageDistance,
      topConditions,
    };
  }
}

export default new MatchingService();
