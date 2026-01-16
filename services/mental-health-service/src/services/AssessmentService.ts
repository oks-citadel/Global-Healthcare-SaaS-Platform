import { AssessmentType, SeverityLevel } from '../generated/client';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options?: { value: number; label: string }[];
  type: 'scale' | 'yes_no' | 'multiple_choice' | 'text';
}

export interface AssessmentResult {
  totalScore: number;
  severity: SeverityLevel;
  interpretation: string;
  recommendations: string[];
  subscores?: Record<string, number>;
}

export class AssessmentService {
  // PHQ-9 (Patient Health Questionnaire - Depression)
  static readonly PHQ9_QUESTIONS: AssessmentQuestion[] = [
    {
      id: 'phq9_1',
      question: 'Little interest or pleasure in doing things',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_2',
      question: 'Feeling down, depressed, or hopeless',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_3',
      question: 'Trouble falling or staying asleep, or sleeping too much',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_4',
      question: 'Feeling tired or having little energy',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_5',
      question: 'Poor appetite or overeating',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_6',
      question: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_7',
      question: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_8',
      question: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'phq9_9',
      question: 'Thoughts that you would be better off dead, or of hurting yourself',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ];

  // GAD-7 (Generalized Anxiety Disorder)
  static readonly GAD7_QUESTIONS: AssessmentQuestion[] = [
    {
      id: 'gad7_1',
      question: 'Feeling nervous, anxious, or on edge',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_2',
      question: 'Not being able to stop or control worrying',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_3',
      question: 'Worrying too much about different things',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_4',
      question: 'Trouble relaxing',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_5',
      question: 'Being so restless that it is hard to sit still',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_6',
      question: 'Becoming easily annoyed or irritable',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'gad7_7',
      question: 'Feeling afraid, as if something awful might happen',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ];

  // Columbia Suicide Severity Rating Scale (C-SSRS) - Screening Version
  static readonly CSSRS_QUESTIONS: AssessmentQuestion[] = [
    {
      id: 'cssrs_1',
      question: 'Have you wished you were dead or wished you could go to sleep and not wake up?',
      type: 'yes_no',
    },
    {
      id: 'cssrs_2',
      question: 'Have you actually had any thoughts of killing yourself?',
      type: 'yes_no',
    },
    {
      id: 'cssrs_3',
      question: 'Have you been thinking about how you might do this?',
      type: 'yes_no',
    },
    {
      id: 'cssrs_4',
      question: 'Have you had these thoughts and had some intention of acting on them?',
      type: 'yes_no',
    },
    {
      id: 'cssrs_5',
      question: 'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?',
      type: 'yes_no',
    },
    {
      id: 'cssrs_6',
      question: 'Have you ever done anything, started to do anything, or prepared to do anything to end your life?',
      type: 'yes_no',
    },
  ];

  static scorePHQ9(responses: Record<string, number>): AssessmentResult {
    let totalScore = 0;

    for (let i = 1; i <= 9; i++) {
      const answer = responses[`phq9_${i}`] || 0;
      totalScore += answer;
    }

    let severity: SeverityLevel;
    let interpretation: string;
    const recommendations: string[] = [];

    if (totalScore >= 0 && totalScore <= 4) {
      severity = 'none';
      interpretation = 'Minimal or no depression';
      recommendations.push('Monitor symptoms');
      recommendations.push('Maintain healthy lifestyle');
    } else if (totalScore >= 5 && totalScore <= 9) {
      severity = 'mild';
      interpretation = 'Mild depression';
      recommendations.push('Watchful waiting, repeat PHQ-9 at follow-up');
      recommendations.push('Consider counseling, psychotherapy, or other interventions');
    } else if (totalScore >= 10 && totalScore <= 14) {
      severity = 'moderate';
      interpretation = 'Moderate depression';
      recommendations.push('Treatment plan needed - counseling and/or medication');
      recommendations.push('Follow-up in 2-4 weeks');
    } else if (totalScore >= 15 && totalScore <= 19) {
      severity = 'moderately_severe';
      interpretation = 'Moderately severe depression';
      recommendations.push('Active treatment with medication and/or psychotherapy');
      recommendations.push('Close follow-up weekly or biweekly');
    } else {
      severity = 'severe';
      interpretation = 'Severe depression';
      recommendations.push('Immediate initiation of pharmacotherapy and/or psychotherapy');
      recommendations.push('Consider psychiatric consultation');
      recommendations.push('Weekly follow-up required');
    }

    // Check for suicidal ideation (question 9)
    if (responses.phq9_9 > 0) {
      recommendations.unshift('ALERT: Suicidal ideation present - assess suicide risk immediately');
    }

    return { totalScore, severity, interpretation, recommendations };
  }

  static scoreGAD7(responses: Record<string, number>): AssessmentResult {
    let totalScore = 0;

    for (let i = 1; i <= 7; i++) {
      const answer = responses[`gad7_${i}`] || 0;
      totalScore += answer;
    }

    let severity: SeverityLevel;
    let interpretation: string;
    const recommendations: string[] = [];

    if (totalScore >= 0 && totalScore <= 4) {
      severity = 'minimal';
      interpretation = 'Minimal anxiety';
      recommendations.push('Monitor symptoms');
      recommendations.push('Relaxation techniques and stress management');
    } else if (totalScore >= 5 && totalScore <= 9) {
      severity = 'mild';
      interpretation = 'Mild anxiety';
      recommendations.push('Watchful waiting, consider counseling');
      recommendations.push('Stress management and relaxation techniques');
    } else if (totalScore >= 10 && totalScore <= 14) {
      severity = 'moderate';
      interpretation = 'Moderate anxiety';
      recommendations.push('Probable GAD - further assessment recommended');
      recommendations.push('Consider counseling and/or medication');
    } else {
      severity = 'severe';
      interpretation = 'Severe anxiety';
      recommendations.push('Active treatment required');
      recommendations.push('Consider medication and psychotherapy (CBT)');
      recommendations.push('Follow-up in 2-4 weeks');
    }

    return { totalScore, severity, interpretation, recommendations };
  }

  static scoreCSSRS(responses: Record<string, boolean>): AssessmentResult {
    let riskLevel = 0;
    const positiveResponses: string[] = [];

    // Calculate risk level based on positive responses
    if (responses.cssrs_1) {
      riskLevel = 1;
      positiveResponses.push('Wish to be dead');
    }
    if (responses.cssrs_2) {
      riskLevel = 2;
      positiveResponses.push('Suicidal thoughts');
    }
    if (responses.cssrs_3) {
      riskLevel = 3;
      positiveResponses.push('Suicidal thoughts with method');
    }
    if (responses.cssrs_4) {
      riskLevel = 4;
      positiveResponses.push('Suicidal intent');
    }
    if (responses.cssrs_5) {
      riskLevel = 5;
      positiveResponses.push('Suicidal intent with plan');
    }
    if (responses.cssrs_6) {
      riskLevel = 6;
      positiveResponses.push('Suicidal behavior');
    }

    let severity: SeverityLevel;
    let interpretation: string;
    const recommendations: string[] = [];

    if (riskLevel === 0) {
      severity = 'none';
      interpretation = 'No suicidal ideation detected';
      recommendations.push('Continue monitoring');
    } else if (riskLevel === 1) {
      severity = 'mild';
      interpretation = 'Low risk - passive suicidal ideation';
      recommendations.push('Enhanced clinical care and monitoring');
      recommendations.push('Safety plan recommended');
    } else if (riskLevel === 2) {
      severity = 'moderate';
      interpretation = 'Moderate risk - active suicidal ideation';
      recommendations.push('Crisis intervention required');
      recommendations.push('Develop comprehensive safety plan');
      recommendations.push('Consider hospitalization');
    } else if (riskLevel >= 3 && riskLevel <= 4) {
      severity = 'moderately_severe';
      interpretation = 'High risk - suicidal ideation with intent';
      recommendations.push('IMMEDIATE ACTION REQUIRED');
      recommendations.push('Do not leave patient alone');
      recommendations.push('Psychiatric consultation required');
      recommendations.push('Strong consideration for hospitalization');
    } else {
      severity = 'severe';
      interpretation = 'Imminent risk - suicidal plan or recent behavior';
      recommendations.push('EMERGENCY INTERVENTION REQUIRED');
      recommendations.push('Immediate psychiatric hospitalization');
      recommendations.push('Initiate crisis protocol');
      recommendations.push('Contact emergency services (911)');
    }

    return {
      totalScore: riskLevel,
      severity,
      interpretation,
      recommendations,
      subscores: {
        riskLevel,
        positiveIndicators: positiveResponses.length,
      },
    };
  }

  static getAssessmentQuestions(type: AssessmentType): AssessmentQuestion[] {
    switch (type) {
      case 'PHQ9':
        return this.PHQ9_QUESTIONS;
      case 'GAD7':
        return this.GAD7_QUESTIONS;
      default:
        return [];
    }
  }

  static scoreAssessment(
    type: AssessmentType,
    responses: Record<string, number | boolean>
  ): AssessmentResult {
    // Filter out boolean values and cast to number-only record
    const numericResponses = Object.fromEntries(
      Object.entries(responses).filter(([, v]) => typeof v === 'number')
    ) as Record<string, number>;

    switch (type) {
      case 'PHQ9':
        return this.scorePHQ9(numericResponses);
      case 'GAD7':
        return this.scoreGAD7(numericResponses);
      default:
        return {
          totalScore: 0,
          severity: 'none',
          interpretation: 'Assessment type not implemented',
          recommendations: [],
        };
    }
  }
}
