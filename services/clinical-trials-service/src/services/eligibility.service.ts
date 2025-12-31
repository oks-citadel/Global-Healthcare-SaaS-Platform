import { EligibilityCriteria, CriterionItem, PatientProfile, LabResult } from '../types/fhir';

export interface EligibilityResult {
  isEligible: boolean;
  status: 'eligible' | 'potentially_eligible' | 'ineligible' | 'unknown';
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  uncertainCriteria: string[];
  details: CriterionEvaluation[];
  score: number;
}

export interface CriterionEvaluation {
  criterionId: string;
  criterionText: string;
  type: 'inclusion' | 'exclusion';
  result: 'met' | 'not_met' | 'uncertain' | 'not_evaluated';
  reason?: string;
  matchedValue?: string | number | boolean;
  requiredValue?: string | number | boolean;
}

export interface TrialEligibility {
  minimumAge?: number;
  maximumAge?: number;
  gender?: string;
  healthyVolunteers?: boolean;
  eligibilityCriteria?: EligibilityCriteria;
  eligibilityText?: string;
  conditions?: string[];
}

export class EligibilityService {
  evaluateEligibility(
    patient: PatientProfile,
    trial: TrialEligibility
  ): EligibilityResult {
    const evaluations: CriterionEvaluation[] = [];
    const matchedCriteria: string[] = [];
    const unmatchedCriteria: string[] = [];
    const uncertainCriteria: string[] = [];

    // Evaluate basic demographic criteria
    const ageEval = this.evaluateAge(patient.demographics.age, trial.minimumAge, trial.maximumAge);
    evaluations.push(ageEval);
    this.categorizeResult(ageEval, matchedCriteria, unmatchedCriteria, uncertainCriteria);

    const genderEval = this.evaluateGender(patient.demographics.gender, trial.gender);
    evaluations.push(genderEval);
    this.categorizeResult(genderEval, matchedCriteria, unmatchedCriteria, uncertainCriteria);

    // Evaluate structured eligibility criteria
    if (trial.eligibilityCriteria) {
      // Evaluate inclusion criteria
      for (const criterion of trial.eligibilityCriteria.inclusion) {
        const evaluation = this.evaluateCriterion(criterion, patient, 'inclusion');
        evaluations.push(evaluation);
        this.categorizeResult(evaluation, matchedCriteria, unmatchedCriteria, uncertainCriteria);
      }

      // Evaluate exclusion criteria
      for (const criterion of trial.eligibilityCriteria.exclusion) {
        const evaluation = this.evaluateCriterion(criterion, patient, 'exclusion');
        evaluations.push(evaluation);
        this.categorizeResult(evaluation, matchedCriteria, unmatchedCriteria, uncertainCriteria);
      }
    }

    // Evaluate condition match
    if (trial.conditions?.length) {
      const conditionEval = this.evaluateConditions(patient.conditions, trial.conditions);
      evaluations.push(conditionEval);
      this.categorizeResult(conditionEval, matchedCriteria, unmatchedCriteria, uncertainCriteria);
    }

    // Calculate eligibility status and score
    const { status, score } = this.calculateEligibilityStatus(evaluations);

    return {
      isEligible: status === 'eligible',
      status,
      matchedCriteria,
      unmatchedCriteria,
      uncertainCriteria,
      details: evaluations,
      score,
    };
  }

  private categorizeResult(
    evaluation: CriterionEvaluation,
    matched: string[],
    unmatched: string[],
    uncertain: string[]
  ): void {
    if (evaluation.result === 'met') {
      matched.push(evaluation.criterionId);
    } else if (evaluation.result === 'not_met') {
      unmatched.push(evaluation.criterionId);
    } else {
      uncertain.push(evaluation.criterionId);
    }
  }

  private evaluateAge(
    patientAge: number,
    minAge?: number,
    maxAge?: number
  ): CriterionEvaluation {
    const evaluation: CriterionEvaluation = {
      criterionId: 'age',
      criterionText: `Age requirement: ${minAge || 'N/A'} - ${maxAge || 'N/A'} years`,
      type: 'inclusion',
      result: 'met',
      matchedValue: patientAge,
    };

    if (minAge !== undefined && patientAge < minAge) {
      evaluation.result = 'not_met';
      evaluation.reason = `Patient age (${patientAge}) is below minimum age (${minAge})`;
      evaluation.requiredValue = minAge;
    } else if (maxAge !== undefined && patientAge > maxAge) {
      evaluation.result = 'not_met';
      evaluation.reason = `Patient age (${patientAge}) is above maximum age (${maxAge})`;
      evaluation.requiredValue = maxAge;
    } else {
      evaluation.reason = 'Age requirement met';
    }

    return evaluation;
  }

  private evaluateGender(
    patientGender: string,
    requiredGender?: string
  ): CriterionEvaluation {
    const evaluation: CriterionEvaluation = {
      criterionId: 'gender',
      criterionText: `Gender requirement: ${requiredGender || 'All'}`,
      type: 'inclusion',
      result: 'met',
      matchedValue: patientGender,
    };

    if (!requiredGender || requiredGender.toLowerCase() === 'all') {
      evaluation.reason = 'No gender restriction';
      return evaluation;
    }

    const normalizedPatientGender = patientGender.toLowerCase();
    const normalizedRequiredGender = requiredGender.toLowerCase();

    if (
      normalizedRequiredGender === 'male' &&
      !['male', 'm', 'man'].includes(normalizedPatientGender)
    ) {
      evaluation.result = 'not_met';
      evaluation.reason = 'Trial requires male participants';
      evaluation.requiredValue = 'male';
    } else if (
      normalizedRequiredGender === 'female' &&
      !['female', 'f', 'woman'].includes(normalizedPatientGender)
    ) {
      evaluation.result = 'not_met';
      evaluation.reason = 'Trial requires female participants';
      evaluation.requiredValue = 'female';
    } else {
      evaluation.reason = 'Gender requirement met';
    }

    return evaluation;
  }

  private evaluateConditions(
    patientConditions: string[],
    trialConditions: string[]
  ): CriterionEvaluation {
    const evaluation: CriterionEvaluation = {
      criterionId: 'conditions',
      criterionText: `Study conditions: ${trialConditions.join(', ')}`,
      type: 'inclusion',
      result: 'uncertain',
    };

    const normalizedPatientConditions = patientConditions.map((c) => c.toLowerCase());
    const normalizedTrialConditions = trialConditions.map((c) => c.toLowerCase());

    // Check for exact or partial matches
    const matches: string[] = [];
    for (const trialCondition of normalizedTrialConditions) {
      const conditionWords = trialCondition.split(/\s+/);
      for (const patientCondition of normalizedPatientConditions) {
        // Check if patient condition contains trial condition words
        const matchScore = conditionWords.filter((word) =>
          patientCondition.includes(word) || word.includes(patientCondition)
        ).length;

        if (matchScore >= Math.ceil(conditionWords.length * 0.5)) {
          matches.push(trialCondition);
          break;
        }
      }
    }

    if (matches.length > 0) {
      evaluation.result = 'met';
      evaluation.reason = `Patient has matching condition(s): ${matches.join(', ')}`;
      evaluation.matchedValue = matches.join(', ');
    } else {
      evaluation.result = 'uncertain';
      evaluation.reason = 'No direct condition match found - manual review recommended';
    }

    return evaluation;
  }

  private evaluateCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion'
  ): CriterionEvaluation {
    const evaluation: CriterionEvaluation = {
      criterionId: criterion.id,
      criterionText: criterion.text,
      type,
      result: 'uncertain',
    };

    // Skip if no structured data available
    if (!criterion.category || !criterion.field) {
      evaluation.reason = 'Criterion requires manual evaluation';
      return evaluation;
    }

    switch (criterion.category) {
      case 'demographics':
        return this.evaluateDemographicCriterion(criterion, patient, type, evaluation);

      case 'laboratory':
        return this.evaluateLabCriterion(criterion, patient, type, evaluation);

      case 'condition':
        return this.evaluateConditionCriterion(criterion, patient, type, evaluation);

      case 'treatment_history':
        return this.evaluateTreatmentCriterion(criterion, patient, type, evaluation);

      case 'performance_status':
        return this.evaluatePerformanceCriterion(criterion, patient, type, evaluation);

      default:
        evaluation.reason = 'Unknown criterion category';
        return evaluation;
    }
  }

  private evaluateDemographicCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion',
    evaluation: CriterionEvaluation
  ): CriterionEvaluation {
    if (criterion.field === 'age' && criterion.value !== undefined) {
      const patientAge = patient.demographics.age;
      const requiredValue = criterion.value as number;

      let isMet = false;
      switch (criterion.operator) {
        case 'gte':
          isMet = patientAge >= requiredValue;
          break;
        case 'lte':
          isMet = patientAge <= requiredValue;
          break;
        case 'gt':
          isMet = patientAge > requiredValue;
          break;
        case 'lt':
          isMet = patientAge < requiredValue;
          break;
        case 'eq':
          isMet = patientAge === requiredValue;
          break;
        default:
          isMet = false;
      }

      evaluation.matchedValue = patientAge;
      evaluation.requiredValue = requiredValue;

      if (type === 'exclusion') {
        // For exclusion, meeting the criterion means NOT eligible
        evaluation.result = isMet ? 'not_met' : 'met';
        evaluation.reason = isMet
          ? `Patient meets exclusion criterion: age ${patientAge}`
          : `Patient does not meet exclusion criterion`;
      } else {
        evaluation.result = isMet ? 'met' : 'not_met';
        evaluation.reason = isMet
          ? `Age requirement met: ${patientAge} ${criterion.operator} ${requiredValue}`
          : `Age requirement not met: ${patientAge} does not satisfy ${criterion.operator} ${requiredValue}`;
      }
    }

    return evaluation;
  }

  private evaluateLabCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion',
    evaluation: CriterionEvaluation
  ): CriterionEvaluation {
    if (!patient.labResults?.length) {
      evaluation.reason = 'No lab results available for evaluation';
      return evaluation;
    }

    // Find matching lab result
    const labResult = this.findMatchingLabResult(criterion.field!, patient.labResults);

    if (!labResult) {
      evaluation.reason = `Lab result for ${criterion.field} not found`;
      return evaluation;
    }

    const requiredValue = criterion.value as number;
    let isMet = false;

    switch (criterion.operator) {
      case 'gte':
        isMet = labResult.value >= requiredValue;
        break;
      case 'lte':
        isMet = labResult.value <= requiredValue;
        break;
      case 'gt':
        isMet = labResult.value > requiredValue;
        break;
      case 'lt':
        isMet = labResult.value < requiredValue;
        break;
      case 'eq':
        isMet = labResult.value === requiredValue;
        break;
      default:
        isMet = false;
    }

    evaluation.matchedValue = labResult.value;
    evaluation.requiredValue = requiredValue;

    if (type === 'exclusion') {
      evaluation.result = isMet ? 'not_met' : 'met';
      evaluation.reason = isMet
        ? `Patient meets exclusion criterion: ${criterion.field} = ${labResult.value}`
        : `Patient does not meet exclusion criterion`;
    } else {
      evaluation.result = isMet ? 'met' : 'not_met';
      evaluation.reason = isMet
        ? `Lab requirement met: ${criterion.field} ${criterion.operator} ${requiredValue}`
        : `Lab requirement not met: ${criterion.field} = ${labResult.value}`;
    }

    return evaluation;
  }

  private findMatchingLabResult(field: string, labResults: LabResult[]): LabResult | null {
    const fieldAliases: Record<string, string[]> = {
      hemoglobin: ['hgb', 'hb', 'hemoglobin'],
      creatinine: ['cr', 'creat', 'creatinine', 'scr'],
      platelets: ['plt', 'plat', 'platelets'],
      wbc: ['wbc', 'white blood cell', 'leukocytes'],
      anc: ['anc', 'absolute neutrophil count', 'neutrophils'],
      ast: ['ast', 'sgot', 'aspartate aminotransferase'],
      alt: ['alt', 'sgpt', 'alanine aminotransferase'],
      bilirubin: ['bili', 'bilirubin', 'total bilirubin'],
      egfr: ['egfr', 'gfr', 'estimated gfr'],
    };

    const normalizedField = field.toLowerCase();
    const aliases = fieldAliases[normalizedField] || [normalizedField];

    for (const result of labResults) {
      const resultCode = result.code.toLowerCase();
      const resultDisplay = result.display.toLowerCase();

      for (const alias of aliases) {
        if (resultCode.includes(alias) || resultDisplay.includes(alias)) {
          return result;
        }
      }
    }

    return null;
  }

  private evaluateConditionCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion',
    evaluation: CriterionEvaluation
  ): CriterionEvaluation {
    const criterionText = criterion.text.toLowerCase();
    const patientConditions = patient.conditions.map((c) => c.toLowerCase());

    // Extract key condition terms from criterion text
    const conditionKeywords = this.extractConditionKeywords(criterionText);

    let hasMatch = false;
    for (const condition of patientConditions) {
      for (const keyword of conditionKeywords) {
        if (condition.includes(keyword) || keyword.includes(condition)) {
          hasMatch = true;
          evaluation.matchedValue = condition;
          break;
        }
      }
      if (hasMatch) break;
    }

    if (type === 'exclusion') {
      evaluation.result = hasMatch ? 'not_met' : 'met';
      evaluation.reason = hasMatch
        ? `Patient has excluded condition: ${evaluation.matchedValue}`
        : 'Patient does not have excluded condition';
    } else {
      evaluation.result = hasMatch ? 'met' : 'uncertain';
      evaluation.reason = hasMatch
        ? `Patient has required condition`
        : 'Unable to confirm condition match - manual review recommended';
    }

    return evaluation;
  }

  private extractConditionKeywords(text: string): string[] {
    // Remove common words and extract meaningful medical terms
    const stopWords = [
      'diagnosis', 'diagnosed', 'confirmed', 'histologically', 'pathologically',
      'proven', 'documented', 'with', 'have', 'has', 'must', 'required', 'patient',
    ];

    const words = text.toLowerCase().split(/\s+/);
    return words.filter((word) =>
      word.length > 3 && !stopWords.includes(word)
    );
  }

  private evaluateTreatmentCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion',
    evaluation: CriterionEvaluation
  ): CriterionEvaluation {
    // Check medications and procedures for treatment history
    const allTreatments = [
      ...patient.medications.map((m) => m.toLowerCase()),
      ...(patient.procedures?.map((p) => p.toLowerCase()) || []),
    ];

    const criterionText = criterion.text.toLowerCase();
    const treatmentKeywords = this.extractTreatmentKeywords(criterionText);

    let hasMatch = false;
    for (const treatment of allTreatments) {
      for (const keyword of treatmentKeywords) {
        if (treatment.includes(keyword) || keyword.includes(treatment)) {
          hasMatch = true;
          evaluation.matchedValue = treatment;
          break;
        }
      }
      if (hasMatch) break;
    }

    if (type === 'exclusion') {
      evaluation.result = hasMatch ? 'not_met' : 'met';
      evaluation.reason = hasMatch
        ? `Patient has received excluded treatment: ${evaluation.matchedValue}`
        : 'Patient has not received excluded treatment';
    } else {
      // For inclusion, prior treatment requirements are often uncertain
      evaluation.result = 'uncertain';
      evaluation.reason = 'Treatment history requires manual review';
    }

    return evaluation;
  }

  private extractTreatmentKeywords(text: string): string[] {
    const commonDrugs = [
      'chemotherapy', 'radiation', 'immunotherapy', 'surgery',
      'transplant', 'steroids', 'biologics',
    ];

    const words = text.toLowerCase().split(/\s+/);
    const keywords = words.filter((word) => word.length > 4);

    // Add common drug classes if mentioned
    for (const drug of commonDrugs) {
      if (text.includes(drug)) {
        keywords.push(drug);
      }
    }

    return [...new Set(keywords)];
  }

  private evaluatePerformanceCriterion(
    criterion: CriterionItem,
    patient: PatientProfile,
    type: 'inclusion' | 'exclusion',
    evaluation: CriterionEvaluation
  ): CriterionEvaluation {
    // Performance status typically requires specific data not in standard profile
    evaluation.result = 'uncertain';
    evaluation.reason = 'Performance status evaluation requires additional clinical data';
    return evaluation;
  }

  private calculateEligibilityStatus(
    evaluations: CriterionEvaluation[]
  ): { status: 'eligible' | 'potentially_eligible' | 'ineligible' | 'unknown'; score: number } {
    let metCount = 0;
    let notMetCount = 0;
    let uncertainCount = 0;
    let inclusionNotMet = false;
    let exclusionMet = false;

    for (const evaluation of evaluations) {
      if (evaluation.result === 'met') {
        metCount++;
      } else if (evaluation.result === 'not_met') {
        notMetCount++;
        if (evaluation.type === 'inclusion') {
          inclusionNotMet = true;
        } else {
          // Not meeting an exclusion criterion is actually good
          // This means the exclusion doesn't apply to the patient
        }
      } else if (evaluation.result === 'uncertain') {
        uncertainCount++;
      }

      // Check if patient meets an exclusion criterion (bad)
      if (evaluation.type === 'exclusion' && evaluation.result === 'not_met') {
        // not_met for exclusion means the criterion IS present in patient
        // Wait, let me reconsider the logic...
        // For exclusion: result='met' means patient does NOT have the excluded condition (eligible)
        // For exclusion: result='not_met' means patient HAS the excluded condition (ineligible)
      }
    }

    const totalEvaluated = metCount + notMetCount + uncertainCount;
    const score = totalEvaluated > 0
      ? Math.round((metCount / totalEvaluated) * 100)
      : 0;

    // Determine eligibility status
    if (inclusionNotMet || exclusionMet) {
      return { status: 'ineligible', score };
    }

    if (uncertainCount === 0 && notMetCount === 0) {
      return { status: 'eligible', score };
    }

    if (notMetCount === 0 && uncertainCount > 0) {
      return { status: 'potentially_eligible', score };
    }

    if (totalEvaluated === 0) {
      return { status: 'unknown', score: 0 };
    }

    return { status: 'potentially_eligible', score };
  }

  /**
   * Batch evaluate multiple trials for a patient
   */
  evaluateMultipleTrials(
    patient: PatientProfile,
    trials: TrialEligibility[]
  ): Map<number, EligibilityResult> {
    const results = new Map<number, EligibilityResult>();

    for (let i = 0; i < trials.length; i++) {
      const result = this.evaluateEligibility(patient, trials[i]);
      results.set(i, result);
    }

    return results;
  }
}

export default new EligibilityService();
