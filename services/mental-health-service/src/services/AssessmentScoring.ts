/**
 * Assessment Scoring Functions
 *
 * This file contains scoring implementations for various mental health assessments:
 * - PCL-5 (PTSD Checklist for DSM-5)
 * - AUDIT (Alcohol Use Disorders Identification Test)
 * - DAST-10 (Drug Abuse Screening Test)
 * - MDQ (Mood Disorder Questionnaire)
 * - Y-BOCS (Yale-Brown Obsessive Compulsive Scale)
 * - PSS (Perceived Stress Scale)
 * - General Intake
 *
 * These functions should be integrated into AssessmentService.scoreAssessment()
 */

import { SeverityLevel } from '../generated/client';

export interface AssessmentResult {
  totalScore: number;
  severity: SeverityLevel;
  interpretation: string;
  recommendations: string[];
  subscores?: Record<string, number>;
}

/**
 * PCL-5 PTSD Checklist Scoring
 * 20 items, each scored 0-4 (Not at all to Extremely)
 * Total score range: 0-80
 * Clinical cutoff: 31-33
 * Clusters: B (intrusion 1-5), C (avoidance 6-7), D (negative cognitions 8-14), E (arousal 15-20)
 */
export function scorePCL5(responses: Record<string, number>): AssessmentResult {
  let totalScore = 0;
  for (let i = 1; i <= 20; i++) {
    totalScore += responses[`pcl5_${i}`] || 0;
  }

  // Calculate cluster scores
  let clusterB = 0, clusterC = 0, clusterD = 0, clusterE = 0;
  for (let i = 1; i <= 5; i++) clusterB += responses[`pcl5_${i}`] || 0;
  for (let i = 6; i <= 7; i++) clusterC += responses[`pcl5_${i}`] || 0;
  for (let i = 8; i <= 14; i++) clusterD += responses[`pcl5_${i}`] || 0;
  for (let i = 15; i <= 20; i++) clusterE += responses[`pcl5_${i}`] || 0;

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (totalScore < 20) {
    severity = 'minimal';
    interpretation = 'Minimal PTSD symptoms';
    recommendations.push('Continue monitoring');
    recommendations.push('Practice self-care and stress management');
  } else if (totalScore < 31) {
    severity = 'mild';
    interpretation = 'Mild PTSD symptoms - below clinical threshold';
    recommendations.push('Consider supportive counseling');
    recommendations.push('Trauma-informed psychoeducation');
  } else if (totalScore < 44) {
    severity = 'moderate';
    interpretation = 'Probable PTSD - clinical threshold met (score >= 31)';
    recommendations.push('Comprehensive PTSD evaluation recommended');
    recommendations.push('Consider trauma-focused therapy (CPT, PE, or EMDR)');
  } else if (totalScore < 60) {
    severity = 'moderately_severe';
    interpretation = 'Moderately severe PTSD symptoms';
    recommendations.push('Trauma-focused therapy strongly recommended');
    recommendations.push('Consider medication evaluation');
    recommendations.push('Safety planning may be indicated');
  } else {
    severity = 'severe';
    interpretation = 'Severe PTSD symptoms';
    recommendations.push('Immediate trauma-focused intervention needed');
    recommendations.push('Psychiatric evaluation for medication');
    recommendations.push('Assess for suicidal ideation and safety');
  }

  return {
    totalScore,
    severity,
    interpretation,
    recommendations,
    subscores: {
      intrusion: clusterB,
      avoidance: clusterC,
      negativeCognitions: clusterD,
      arousal: clusterE,
    },
  };
}

/**
 * AUDIT Alcohol Use Screening
 * 10 items with varying scoring
 * Total score range: 0-40
 * Zone I (0-7): Low risk
 * Zone II (8-15): Hazardous use
 * Zone III (16-19): Harmful use
 * Zone IV (20+): Possible dependence
 */
export function scoreAUDIT(responses: Record<string, number>): AssessmentResult {
  let totalScore = 0;
  for (let i = 1; i <= 10; i++) {
    totalScore += responses[`audit_${i}`] || 0;
  }

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (totalScore <= 7) {
    severity = 'none';
    interpretation = 'Low risk drinking';
    recommendations.push('Continue to monitor alcohol consumption');
    recommendations.push('Provide education on safe drinking limits');
  } else if (totalScore <= 15) {
    severity = 'mild';
    interpretation = 'Hazardous drinking';
    recommendations.push('Brief intervention recommended');
    recommendations.push('Advise on reducing alcohol consumption');
  } else if (totalScore <= 19) {
    severity = 'moderate';
    interpretation = 'Harmful drinking';
    recommendations.push('Brief intervention and continued monitoring');
    recommendations.push('Consider referral to addiction specialist');
  } else {
    severity = 'severe';
    interpretation = 'Possible alcohol dependence';
    recommendations.push('Referral to addiction specialist recommended');
    recommendations.push('Consider medically supervised detoxification');
  }

  return { totalScore, severity, interpretation, recommendations };
}

/**
 * DAST-10 Drug Abuse Screening
 * 10 yes/no items
 * Question 3 is reverse scored
 * Total score range: 0-10
 */
export function scoreDAST(responses: Record<string, boolean | number>): AssessmentResult {
  let totalScore = 0;

  for (let i = 1; i <= 10; i++) {
    const answer = responses[`dast_${i}`];
    if (i === 3) {
      // Question 3 is reverse scored (No = 1, Yes = 0)
      totalScore += answer === false || answer === 0 ? 1 : 0;
    } else {
      totalScore += answer === true || answer === 1 ? 1 : 0;
    }
  }

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (totalScore === 0) {
    severity = 'none';
    interpretation = 'No drug use problems reported';
    recommendations.push('Continue monitoring');
  } else if (totalScore <= 2) {
    severity = 'mild';
    interpretation = 'Low level of drug-related problems';
    recommendations.push('Brief intervention and monitoring');
  } else if (totalScore <= 5) {
    severity = 'moderate';
    interpretation = 'Moderate level of drug-related problems';
    recommendations.push('Outpatient treatment recommended');
  } else if (totalScore <= 8) {
    severity = 'moderately_severe';
    interpretation = 'Substantial level of drug-related problems';
    recommendations.push('Intensive outpatient treatment recommended');
  } else {
    severity = 'severe';
    interpretation = 'Severe level of drug-related problems';
    recommendations.push('Intensive treatment required');
    recommendations.push('Consider inpatient or residential treatment');
  }

  return { totalScore, severity, interpretation, recommendations };
}

/**
 * MDQ Mood Disorder Questionnaire (Bipolar Screening)
 * Questions 1-13: Yes/No symptoms
 * Question 14: Did symptoms occur at same time?
 * Question 15: Impairment level (0-3)
 * Positive screen: 7+ symptoms AND concurrent AND impairment >= 2
 */
export function scoreMDQ(responses: Record<string, boolean | number>): AssessmentResult {
  // Count yes responses to questions 1-13
  let symptomCount = 0;
  for (let i = 1; i <= 13; i++) {
    const answer = responses[`mdq_${i}`];
    if (answer === true || answer === 1) {
      symptomCount++;
    }
  }

  const concurrent = responses.mdq_concurrent === true || responses.mdq_concurrent === 1;
  const impairment = typeof responses.mdq_impairment === 'number' ? responses.mdq_impairment : 0;
  const positiveScreen = symptomCount >= 7 && concurrent && impairment >= 2;

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (!positiveScreen && symptomCount < 4) {
    severity = 'none';
    interpretation = 'Negative screen for bipolar disorder';
    recommendations.push('Continue routine monitoring');
  } else if (!positiveScreen) {
    severity = 'mild';
    interpretation = 'Some manic symptoms present but below threshold';
    recommendations.push('Monitor for mood episode development');
  } else if (impairment === 2) {
    severity = 'moderate';
    interpretation = 'Positive screen for bipolar disorder - moderate impairment';
    recommendations.push('Comprehensive psychiatric evaluation recommended');
  } else {
    severity = 'severe';
    interpretation = 'Positive screen for bipolar disorder - significant impairment';
    recommendations.push('Urgent psychiatric evaluation recommended');
  }

  return {
    totalScore: symptomCount,
    severity,
    interpretation,
    recommendations,
    subscores: {
      symptomCount,
      concurrent: concurrent ? 1 : 0,
      impairment,
      positiveScreen: positiveScreen ? 1 : 0,
    },
  };
}

/**
 * Y-BOCS Yale-Brown Obsessive Compulsive Scale
 * 10 items, each scored 0-4
 * Items 1-5: Obsession severity
 * Items 6-10: Compulsion severity
 * Total score range: 0-40
 */
export function scoreYBOCS(responses: Record<string, number>): AssessmentResult {
  let obsessionScore = 0;
  let compulsionScore = 0;

  for (let i = 1; i <= 5; i++) obsessionScore += responses[`ybocs_${i}`] || 0;
  for (let i = 6; i <= 10; i++) compulsionScore += responses[`ybocs_${i}`] || 0;

  const totalScore = obsessionScore + compulsionScore;

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (totalScore <= 7) {
    severity = 'none';
    interpretation = 'Subclinical OCD symptoms';
    recommendations.push('Monitor symptoms');
  } else if (totalScore <= 15) {
    severity = 'mild';
    interpretation = 'Mild OCD';
    recommendations.push('Consider cognitive-behavioral therapy (CBT)');
  } else if (totalScore <= 23) {
    severity = 'moderate';
    interpretation = 'Moderate OCD';
    recommendations.push('CBT with ERP recommended');
    recommendations.push('Consider medication evaluation');
  } else if (totalScore <= 31) {
    severity = 'moderately_severe';
    interpretation = 'Severe OCD';
    recommendations.push('Intensive CBT/ERP treatment recommended');
    recommendations.push('Medication evaluation strongly indicated');
  } else {
    severity = 'severe';
    interpretation = 'Extreme OCD';
    recommendations.push('Intensive outpatient or residential treatment');
    recommendations.push('Aggressive medication management');
  }

  return {
    totalScore,
    severity,
    interpretation,
    recommendations,
    subscores: {
      obsessions: obsessionScore,
      compulsions: compulsionScore,
    },
  };
}

/**
 * PSS Perceived Stress Scale
 * 10 items, each scored 0-4
 * Items 4, 5, 7, 8 are reverse scored
 * Total score range: 0-40
 */
export function scorePSS(responses: Record<string, number>): AssessmentResult {
  let totalScore = 0;
  const reverseItems = [4, 5, 7, 8];

  for (let i = 1; i <= 10; i++) {
    const answer = responses[`pss_${i}`] || 0;
    totalScore += reverseItems.includes(i) ? (4 - answer) : answer;
  }

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (totalScore <= 13) {
    severity = 'none';
    interpretation = 'Low perceived stress';
    recommendations.push('Maintain current stress management practices');
  } else if (totalScore <= 19) {
    severity = 'mild';
    interpretation = 'Moderate perceived stress';
    recommendations.push('Consider stress reduction techniques');
  } else if (totalScore <= 26) {
    severity = 'moderate';
    interpretation = 'Moderate to high perceived stress';
    recommendations.push('Stress management intervention recommended');
  } else if (totalScore <= 33) {
    severity = 'moderately_severe';
    interpretation = 'High perceived stress';
    recommendations.push('Counseling or therapy strongly recommended');
  } else {
    severity = 'severe';
    interpretation = 'Very high perceived stress';
    recommendations.push('Immediate intervention recommended');
    recommendations.push('Mental health evaluation');
  }

  return { totalScore, severity, interpretation, recommendations };
}

/**
 * General Intake Scoring
 * Based on self-rated mental health and intake responses
 */
export function scoreGeneralIntake(responses: Record<string, number | boolean | string>): AssessmentResult {
  const mentalHealthRating = typeof responses.intake_5 === 'number' ? responses.intake_5 : 3;
  const hasPriorTreatment = responses.intake_2 === true || responses.intake_2 === 1;
  const onMedications = responses.intake_3 === true || responses.intake_3 === 1;
  const hasMedicalConditions = responses.intake_4 === true || responses.intake_4 === 1;

  let severity: SeverityLevel;
  let interpretation: string;
  const recommendations: string[] = [];

  if (mentalHealthRating >= 4) {
    severity = 'none';
    interpretation = 'Patient reports good to excellent mental health';
  } else if (mentalHealthRating === 3) {
    severity = 'mild';
    interpretation = 'Patient reports fair mental health';
  } else if (mentalHealthRating === 2) {
    severity = 'moderate';
    interpretation = 'Patient reports fair mental health with some concerns';
  } else {
    severity = 'moderately_severe';
    interpretation = 'Patient reports poor mental health';
  }

  recommendations.push('Comprehensive initial assessment');
  if (hasPriorTreatment) recommendations.push('Obtain prior treatment records');
  if (onMedications) recommendations.push('Review current medication list');
  if (hasMedicalConditions) recommendations.push('Coordinate with primary care provider');

  return {
    totalScore: mentalHealthRating,
    severity,
    interpretation,
    recommendations,
    subscores: {
      selfRatedHealth: mentalHealthRating,
      priorTreatment: hasPriorTreatment ? 1 : 0,
      currentMedications: onMedications ? 1 : 0,
      medicalConditions: hasMedicalConditions ? 1 : 0,
    },
  };
}

/**
 * Integration Instructions:
 *
 * To integrate these scoring functions into AssessmentService.ts, update the
 * scoreAssessment method's switch statement to include:
 *
 * case 'PCL5': return scorePCL5(numericResponses);
 * case 'AUDIT': return scoreAUDIT(numericResponses);
 * case 'DAST': return scoreDAST(responses);
 * case 'MDQ': return scoreMDQ(responses);
 * case 'YBOCS': return scoreYBOCS(numericResponses);
 * case 'PSS': return scorePSS(numericResponses);
 * case 'general_intake': return scoreGeneralIntake(responses);
 *
 * Import this file at the top of AssessmentService.ts:
 * import { scorePCL5, scoreAUDIT, scoreDAST, scoreMDQ, scoreYBOCS, scorePSS, scoreGeneralIntake } from './AssessmentScoring';
 */
