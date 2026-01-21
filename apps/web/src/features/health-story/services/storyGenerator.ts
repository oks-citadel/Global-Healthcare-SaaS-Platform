/**
 * Story Generator Service
 * Converts medical events into patient-friendly narrative stories
 */

import {
  TimelineEvent,
  TimelineEventType,
  StoryChapter,
  ChapterInsight,
  HealthAchievement,
  EventSeverity,
  ChapterType,
  InsightType,
} from '../types';

/**
 * Medical term to plain language mappings
 */
const MEDICAL_TERM_MAPPINGS: Record<string, string> = {
  // Conditions
  'hypertension': 'high blood pressure',
  'hyperlipidemia': 'high cholesterol',
  'diabetes mellitus': 'diabetes',
  'type 2 diabetes mellitus': 'type 2 diabetes',
  'osteoarthritis': 'joint wear and tear',
  'gastroesophageal reflux disease': 'acid reflux (GERD)',
  'chronic obstructive pulmonary disease': 'COPD (lung disease)',
  'hypothyroidism': 'underactive thyroid',
  'hyperthyroidism': 'overactive thyroid',
  'atrial fibrillation': 'irregular heartbeat',
  'myocardial infarction': 'heart attack',
  'cerebrovascular accident': 'stroke',
  'pneumonia': 'lung infection',
  'urinary tract infection': 'bladder infection',
  'acute bronchitis': 'chest cold',

  // Procedures
  'colonoscopy': 'examination of the colon using a camera',
  'endoscopy': 'examination of the digestive tract using a camera',
  'echocardiogram': 'ultrasound of the heart',
  'magnetic resonance imaging': 'MRI scan',
  'computed tomography': 'CT scan',
  'electrocardiogram': 'ECG/EKG (heart rhythm test)',
  'angioplasty': 'procedure to open blocked arteries',
  'cholecystectomy': 'gallbladder removal surgery',
  'appendectomy': 'appendix removal surgery',

  // Lab terms
  'hemoglobin a1c': 'average blood sugar over 3 months',
  'lipid panel': 'cholesterol and fat levels test',
  'complete blood count': 'general blood health test',
  'basic metabolic panel': 'kidney function and electrolytes test',
  'thyroid stimulating hormone': 'thyroid function test',
  'creatinine': 'kidney function marker',
  'glomerular filtration rate': 'kidney filtering rate',
};

/**
 * Story templates for different event types
 */
const STORY_TEMPLATES: Record<TimelineEventType, (event: TimelineEvent) => string> = {
  diagnosis: (event) => {
    const condition = simplifyMedicalTerm(event.title);
    return `On ${formatDate(event.date)}, your healthcare team identified ${condition}. ${event.description ? simplifyMedicalText(event.description) : 'Your doctor discussed treatment options with you.'}`;
  },

  treatment: (event) => {
    return `You started a new treatment on ${formatDate(event.date)}: ${simplifyMedicalText(event.title)}. ${event.description ? simplifyMedicalText(event.description) : ''}`;
  },

  medication: (event) => {
    return `Your doctor prescribed ${event.title} on ${formatDate(event.date)}. ${event.description ? `This medication helps ${simplifyMedicalText(event.description.toLowerCase())}.` : ''}`;
  },

  procedure: (event) => {
    const procedure = simplifyMedicalTerm(event.title);
    return `You had ${procedure} on ${formatDate(event.date)}. ${event.description ? simplifyMedicalText(event.description) : 'The procedure was performed by your healthcare team.'}`;
  },

  lab_result: (event) => {
    return `Lab results from ${formatDate(event.date)} showed ${simplifyMedicalText(event.title)}. ${event.description ? simplifyMedicalText(event.description) : ''}`;
  },

  imaging: (event) => {
    const imagingType = simplifyMedicalTerm(event.title);
    return `You had ${imagingType} imaging done on ${formatDate(event.date)}. ${event.description ? simplifyMedicalText(event.description) : ''}`;
  },

  appointment: (event) => {
    const provider = event.providers[0];
    const providerInfo = provider ? `with ${provider.name} (${provider.specialty})` : 'with your healthcare provider';
    return `You had an appointment ${providerInfo} on ${formatDate(event.date)}. ${event.description ? simplifyMedicalText(event.description) : ''}`;
  },

  hospitalization: (event) => {
    const duration = event.endDate
      ? `from ${formatDate(event.date)} to ${formatDate(event.endDate)}`
      : `starting ${formatDate(event.date)}`;
    return `You were hospitalized ${duration} for ${simplifyMedicalText(event.title.toLowerCase())}. ${event.description ? simplifyMedicalText(event.description) : 'Your care team worked to help you recover.'}`;
  },

  vaccination: (event) => {
    return `You received your ${event.title} vaccination on ${formatDate(event.date)}. ${event.description || 'This helps protect you from illness.'}`;
  },

  vital_reading: (event) => {
    return `Your vital signs on ${formatDate(event.date)}: ${event.title}. ${event.description || ''}`;
  },

  lifestyle_change: (event) => {
    return `On ${formatDate(event.date)}, you made a positive change: ${event.title}. ${event.description || 'Every step counts towards better health!'}`;
  },

  milestone: (event) => {
    return `Congratulations! On ${formatDate(event.date)}, you reached a milestone: ${event.title}. ${event.description || ''}`;
  },

  note: (event) => {
    return `Note from ${formatDate(event.date)}: ${event.description || event.title}`;
  },
};

/**
 * Simplify medical terminology to plain language
 */
export function simplifyMedicalTerm(term: string): string {
  const lowerTerm = term.toLowerCase();

  // Check direct mappings
  if (MEDICAL_TERM_MAPPINGS[lowerTerm]) {
    return MEDICAL_TERM_MAPPINGS[lowerTerm];
  }

  // Check partial matches
  for (const [medical, plain] of Object.entries(MEDICAL_TERM_MAPPINGS)) {
    if (lowerTerm.includes(medical)) {
      return lowerTerm.replace(medical, plain);
    }
  }

  return term;
}

/**
 * Simplify medical text with multiple terms
 */
export function simplifyMedicalText(text: string): string {
  let simplified = text;

  for (const [medical, plain] of Object.entries(MEDICAL_TERM_MAPPINGS)) {
    const regex = new RegExp(medical, 'gi');
    simplified = simplified.replace(regex, plain);
  }

  return simplified;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Generate plain language summary for an event
 */
export function generateEventSummary(event: TimelineEvent): string {
  const template = STORY_TEMPLATES[event.type];
  if (template) {
    return template(event);
  }
  return event.description || event.title;
}

/**
 * Generate a chapter narrative from events
 */
export function generateChapterNarrative(chapter: StoryChapter): string {
  const events = chapter.events;

  if (events.length === 0) {
    return 'No events recorded in this chapter.';
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const startDate = formatDate(sortedEvents[0].date);
  const endDate = sortedEvents.length > 1
    ? formatDate(sortedEvents[sortedEvents.length - 1].date)
    : null;

  let narrative = `This chapter covers your health journey `;
  if (endDate) {
    narrative += `from ${startDate} to ${endDate}. `;
  } else {
    narrative += `starting ${startDate}. `;
  }

  // Group events by type for summary
  const eventsByType = new Map<TimelineEventType, TimelineEvent[]>();
  for (const event of sortedEvents) {
    const existing = eventsByType.get(event.type) || [];
    existing.push(event);
    eventsByType.set(event.type, existing);
  }

  const summaries: string[] = [];

  if (eventsByType.has('diagnosis')) {
    const diagnoses = eventsByType.get('diagnosis')!;
    summaries.push(`You received ${diagnoses.length} diagnosis${diagnoses.length > 1 ? 'es' : ''}`);
  }

  if (eventsByType.has('appointment')) {
    const appointments = eventsByType.get('appointment')!;
    summaries.push(`attended ${appointments.length} appointment${appointments.length > 1 ? 's' : ''}`);
  }

  if (eventsByType.has('procedure')) {
    const procedures = eventsByType.get('procedure')!;
    summaries.push(`had ${procedures.length} procedure${procedures.length > 1 ? 's' : ''}`);
  }

  if (eventsByType.has('lab_result')) {
    const labs = eventsByType.get('lab_result')!;
    summaries.push(`received ${labs.length} lab result${labs.length > 1 ? 's' : ''}`);
  }

  if (summaries.length > 0) {
    narrative += `During this time, you ${summaries.join(', ')}.`;
  }

  return narrative;
}

/**
 * Generate insights from chapter events
 */
export function generateChapterInsights(
  chapter: StoryChapter,
  historicalEvents?: TimelineEvent[]
): ChapterInsight[] {
  const insights: ChapterInsight[] = [];
  const events = chapter.events;

  if (events.length === 0) return insights;

  // Check for improvement trends
  const labResults = events.filter(e => e.type === 'lab_result');
  if (labResults.length >= 2) {
    // Simplified trend detection
    const recentResults = labResults.slice(-2);
    if (recentResults[1].severity === 'low' && recentResults[0].severity !== 'low') {
      insights.push({
        id: `insight-${Date.now()}-improvement`,
        type: 'improvement',
        title: 'Lab Results Improving',
        description: 'Your recent lab results show improvement compared to previous results.',
        confidence: 0.8,
        relatedEvents: recentResults.map(r => r.id),
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Check for medication adherence
  const medicationEvents = events.filter(e => e.type === 'medication');
  if (medicationEvents.length > 0) {
    insights.push({
      id: `insight-${Date.now()}-medication`,
      type: 'reminder',
      title: 'Medication Management',
      description: `You are managing ${medicationEvents.length} medication${medicationEvents.length > 1 ? 's' : ''}. Remember to take them as prescribed.`,
      recommendation: 'Set up daily reminders to help you stay on track with your medications.',
      confidence: 0.9,
      relatedEvents: medicationEvents.map(m => m.id),
      createdAt: new Date().toISOString(),
    });
  }

  // Check for upcoming milestones
  const treatmentEvents = events.filter(e => e.type === 'treatment');
  if (treatmentEvents.length > 0) {
    const longestTreatment = treatmentEvents.reduce((longest, current) => {
      const currentDuration = current.endDate
        ? new Date(current.endDate).getTime() - new Date(current.date).getTime()
        : Date.now() - new Date(current.date).getTime();
      const longestDuration = longest.endDate
        ? new Date(longest.endDate).getTime() - new Date(longest.date).getTime()
        : Date.now() - new Date(longest.date).getTime();
      return currentDuration > longestDuration ? current : longest;
    });

    const daysInTreatment = Math.floor(
      (Date.now() - new Date(longestTreatment.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysInTreatment > 30) {
      insights.push({
        id: `insight-${Date.now()}-milestone`,
        type: 'milestone',
        title: 'Treatment Progress',
        description: `You've been on your treatment plan for over ${Math.floor(daysInTreatment / 30)} month${Math.floor(daysInTreatment / 30) > 1 ? 's' : ''}. Great job staying committed!`,
        confidence: 1,
        relatedEvents: [longestTreatment.id],
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Check for correlation patterns
  if (historicalEvents && historicalEvents.length > 0) {
    const conditionEvents = events.filter(e => e.relatedConditions.length > 0);
    if (conditionEvents.length > 2) {
      const conditionCounts = new Map<string, number>();
      for (const event of conditionEvents) {
        for (const condition of event.relatedConditions) {
          conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
        }
      }

      const dominantCondition = [...conditionCounts.entries()]
        .sort((a, b) => b[1] - a[1])[0];

      if (dominantCondition && dominantCondition[1] > 2) {
        insights.push({
          id: `insight-${Date.now()}-correlation`,
          type: 'correlation',
          title: 'Related Events Pattern',
          description: `Multiple events in this chapter are related to ${simplifyMedicalTerm(dominantCondition[0])}. Your healthcare team is monitoring this closely.`,
          confidence: 0.75,
          relatedEvents: conditionEvents.filter(e =>
            e.relatedConditions.includes(dominantCondition[0])
          ).map(e => e.id),
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return insights;
}

/**
 * Detect potential achievements from events
 */
export function detectAchievements(
  events: TimelineEvent[],
  existingAchievements: HealthAchievement[]
): HealthAchievement[] {
  const newAchievements: HealthAchievement[] = [];
  const existingIds = new Set(existingAchievements.map(a => a.id));

  // First appointment achievement
  const appointments = events.filter(e => e.type === 'appointment' && e.status === 'completed');
  if (appointments.length === 1 && !existingIds.has('first-appointment')) {
    newAchievements.push({
      id: 'first-appointment',
      title: 'Healthcare Journey Begins',
      description: 'You completed your first appointment and started your health journey.',
      iconName: 'star',
      earnedAt: appointments[0].date,
      category: 'engagement',
      points: 100,
      shareableText: 'I started my healthcare journey today!',
    });
  }

  // Regular check-ups achievement
  if (appointments.length >= 4 && !existingIds.has('regular-checkups')) {
    newAchievements.push({
      id: 'regular-checkups',
      title: 'Consistent Care',
      description: 'You have attended at least 4 appointments, showing commitment to your health.',
      iconName: 'calendar-check',
      earnedAt: appointments[3].date,
      category: 'compliance',
      points: 250,
      shareableText: 'I am staying on top of my health with regular check-ups!',
    });
  }

  // Vaccination up to date
  const vaccinations = events.filter(e => e.type === 'vaccination');
  if (vaccinations.length >= 1 && !existingIds.has('vaccination-champion')) {
    newAchievements.push({
      id: 'vaccination-champion',
      title: 'Vaccination Champion',
      description: 'You are up to date on your vaccinations.',
      iconName: 'shield-check',
      earnedAt: vaccinations[vaccinations.length - 1].date,
      category: 'wellness',
      points: 200,
      shareableText: 'I am protected! Staying up to date on my vaccinations.',
    });
  }

  // Lifestyle change achievement
  const lifestyleChanges = events.filter(e => e.type === 'lifestyle_change');
  if (lifestyleChanges.length >= 1 && !existingIds.has('lifestyle-improver')) {
    newAchievements.push({
      id: 'lifestyle-improver',
      title: 'Making Positive Changes',
      description: 'You made a positive lifestyle change to improve your health.',
      iconName: 'heart',
      earnedAt: lifestyleChanges[0].date,
      category: 'improvement',
      points: 150,
      shareableText: 'Making positive changes for a healthier life!',
    });
  }

  // One year health journey
  const oldestEvent = events.reduce((oldest, current) =>
    new Date(current.date) < new Date(oldest.date) ? current : oldest
  , events[0]);

  if (oldestEvent) {
    const daysSinceStart = Math.floor(
      (Date.now() - new Date(oldestEvent.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceStart >= 365 && !existingIds.has('one-year-journey')) {
      newAchievements.push({
        id: 'one-year-journey',
        title: 'One Year Health Journey',
        description: 'You have been actively managing your health for over a year!',
        iconName: 'trophy',
        earnedAt: new Date().toISOString(),
        category: 'milestone',
        points: 500,
        shareableText: 'Celebrating one year of taking charge of my health!',
      });
    }
  }

  return newAchievements;
}

/**
 * Organize events into chapters
 */
export function organizeIntoChapters(
  events: TimelineEvent[],
  chapterType: ChapterType
): StoryChapter[] {
  const chapters: StoryChapter[] = [];

  switch (chapterType) {
    case 'condition':
      return organizeByCondition(events);
    case 'time_period':
      return organizeByTimePeriod(events);
    case 'body_system':
      return organizeByBodySystem(events);
    case 'treatment_plan':
      return organizeByTreatmentPlan(events);
    default:
      return organizeByTimePeriod(events);
  }
}

/**
 * Organize events by medical condition
 */
function organizeByCondition(events: TimelineEvent[]): StoryChapter[] {
  const conditionMap = new Map<string, TimelineEvent[]>();
  const generalEvents: TimelineEvent[] = [];

  for (const event of events) {
    if (event.relatedConditions.length > 0) {
      for (const condition of event.relatedConditions) {
        const existing = conditionMap.get(condition) || [];
        existing.push(event);
        conditionMap.set(condition, existing);
      }
    } else {
      generalEvents.push(event);
    }
  }

  const chapters: StoryChapter[] = [];
  let order = 0;

  for (const [condition, conditionEvents] of conditionMap) {
    const sortedEvents = conditionEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chapter: StoryChapter = {
      id: `chapter-condition-${condition.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'condition',
      title: simplifyMedicalTerm(condition),
      description: `Your journey with ${simplifyMedicalTerm(condition)}`,
      startDate: sortedEvents[0].date,
      endDate: sortedEvents[sortedEvents.length - 1].date,
      events: sortedEvents,
      insights: [],
      summary: '',
      isActive: sortedEvents.some(e => e.status === 'active' || e.status === 'ongoing'),
      order: order++,
    };

    chapter.summary = generateChapterNarrative(chapter);
    chapter.insights = generateChapterInsights(chapter);

    chapters.push(chapter);
  }

  // Add general events chapter
  if (generalEvents.length > 0) {
    const sortedGeneral = generalEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const generalChapter: StoryChapter = {
      id: 'chapter-general-health',
      type: 'condition',
      title: 'General Health',
      description: 'General health events and check-ups',
      startDate: sortedGeneral[0].date,
      endDate: sortedGeneral[sortedGeneral.length - 1].date,
      events: sortedGeneral,
      insights: [],
      summary: '',
      isActive: true,
      order: order,
    };

    generalChapter.summary = generateChapterNarrative(generalChapter);
    generalChapter.insights = generateChapterInsights(generalChapter);

    chapters.push(generalChapter);
  }

  return chapters;
}

/**
 * Organize events by time period (quarterly)
 */
function organizeByTimePeriod(events: TimelineEvent[]): StoryChapter[] {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sortedEvents.length === 0) return [];

  const quarters = new Map<string, TimelineEvent[]>();

  for (const event of sortedEvents) {
    const date = new Date(event.date);
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const key = `${year}-Q${quarter}`;

    const existing = quarters.get(key) || [];
    existing.push(event);
    quarters.set(key, existing);
  }

  const chapters: StoryChapter[] = [];
  let order = 0;

  for (const [period, periodEvents] of quarters) {
    const [year, quarterStr] = period.split('-');
    const quarterNum = parseInt(quarterStr.replace('Q', ''));
    const quarterNames = ['Winter', 'Spring', 'Summer', 'Fall'];

    const chapter: StoryChapter = {
      id: `chapter-${period}`,
      type: 'time_period',
      title: `${quarterNames[quarterNum - 1]} ${year}`,
      description: `Health events from ${quarterNames[quarterNum - 1]} ${year}`,
      startDate: periodEvents[0].date,
      endDate: periodEvents[periodEvents.length - 1].date,
      events: periodEvents,
      insights: [],
      summary: '',
      isActive: period === `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`,
      order: order++,
    };

    chapter.summary = generateChapterNarrative(chapter);
    chapter.insights = generateChapterInsights(chapter);

    chapters.push(chapter);
  }

  return chapters;
}

/**
 * Organize events by body system
 */
function organizeByBodySystem(events: TimelineEvent[]): StoryChapter[] {
  const bodySystemKeywords: Record<string, string[]> = {
    'Cardiovascular': ['heart', 'cardiac', 'blood pressure', 'cholesterol', 'vascular', 'hypertension'],
    'Respiratory': ['lung', 'breathing', 'respiratory', 'pulmonary', 'asthma', 'copd'],
    'Digestive': ['stomach', 'gastro', 'digestive', 'intestinal', 'liver', 'colon'],
    'Endocrine': ['diabetes', 'thyroid', 'hormone', 'metabolic', 'insulin'],
    'Musculoskeletal': ['bone', 'joint', 'muscle', 'arthritis', 'spine', 'orthopedic'],
    'Neurological': ['brain', 'nerve', 'neurological', 'headache', 'migraine'],
    'Mental Health': ['anxiety', 'depression', 'mental', 'psychological', 'psychiatric'],
    'Immune': ['allergy', 'immune', 'autoimmune', 'infection'],
  };

  const systemMap = new Map<string, TimelineEvent[]>();
  const general: TimelineEvent[] = [];

  for (const event of events) {
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    let assigned = false;

    for (const [system, keywords] of Object.entries(bodySystemKeywords)) {
      if (keywords.some(keyword => eventText.includes(keyword))) {
        const existing = systemMap.get(system) || [];
        existing.push(event);
        systemMap.set(system, existing);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      general.push(event);
    }
  }

  const chapters: StoryChapter[] = [];
  let order = 0;

  for (const [system, systemEvents] of systemMap) {
    const sortedEvents = systemEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chapter: StoryChapter = {
      id: `chapter-system-${system.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'body_system',
      title: `${system} Health`,
      description: `Events related to your ${system.toLowerCase()} system`,
      startDate: sortedEvents[0].date,
      endDate: sortedEvents[sortedEvents.length - 1].date,
      events: sortedEvents,
      insights: [],
      summary: '',
      isActive: sortedEvents.some(e => e.status === 'active' || e.status === 'ongoing'),
      order: order++,
    };

    chapter.summary = generateChapterNarrative(chapter);
    chapter.insights = generateChapterInsights(chapter);

    chapters.push(chapter);
  }

  // Add general chapter
  if (general.length > 0) {
    const sortedGeneral = general.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    chapters.push({
      id: 'chapter-general',
      type: 'body_system',
      title: 'General Wellness',
      description: 'General health and wellness events',
      startDate: sortedGeneral[0].date,
      endDate: sortedGeneral[sortedGeneral.length - 1].date,
      events: sortedGeneral,
      insights: generateChapterInsights({ events: sortedGeneral } as StoryChapter),
      summary: generateChapterNarrative({ events: sortedGeneral } as StoryChapter),
      isActive: true,
      order: order,
    });
  }

  return chapters;
}

/**
 * Organize events by treatment plan
 */
function organizeByTreatmentPlan(events: TimelineEvent[]): StoryChapter[] {
  const treatmentEvents = events.filter(
    e => e.type === 'treatment' || e.type === 'medication' || e.type === 'procedure'
  );
  const otherEvents = events.filter(
    e => e.type !== 'treatment' && e.type !== 'medication' && e.type !== 'procedure'
  );

  const chapters: StoryChapter[] = [];

  // Group by related conditions for treatment
  const treatmentByCondition = new Map<string, TimelineEvent[]>();

  for (const event of treatmentEvents) {
    const condition = event.relatedConditions[0] || 'General Treatment';
    const existing = treatmentByCondition.get(condition) || [];
    existing.push(event);
    treatmentByCondition.set(condition, existing);
  }

  let order = 0;

  for (const [condition, conditionEvents] of treatmentByCondition) {
    const sortedEvents = conditionEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    chapters.push({
      id: `chapter-treatment-${condition.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'treatment_plan',
      title: `Treatment for ${simplifyMedicalTerm(condition)}`,
      description: `Your treatment journey for ${simplifyMedicalTerm(condition)}`,
      startDate: sortedEvents[0].date,
      endDate: sortedEvents[sortedEvents.length - 1].date,
      events: sortedEvents,
      insights: generateChapterInsights({ events: sortedEvents } as StoryChapter),
      summary: generateChapterNarrative({ events: sortedEvents } as StoryChapter),
      isActive: sortedEvents.some(e => e.status === 'active' || e.status === 'ongoing'),
      order: order++,
    });
  }

  // Add monitoring chapter for other events
  if (otherEvents.length > 0) {
    const sortedOther = otherEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    chapters.push({
      id: 'chapter-monitoring',
      type: 'treatment_plan',
      title: 'Health Monitoring',
      description: 'Appointments, tests, and health tracking',
      startDate: sortedOther[0].date,
      endDate: sortedOther[sortedOther.length - 1].date,
      events: sortedOther,
      insights: generateChapterInsights({ events: sortedOther } as StoryChapter),
      summary: generateChapterNarrative({ events: sortedOther } as StoryChapter),
      isActive: true,
      order: order,
    });
  }

  return chapters;
}

/**
 * Generate overall story summary
 */
export function generateOverallSummary(chapters: StoryChapter[]): string {
  if (chapters.length === 0) {
    return 'Your health story is just beginning. As you visit healthcare providers and manage your health, your journey will be documented here.';
  }

  const totalEvents = chapters.reduce((sum, ch) => sum + ch.events.length, 0);
  const activeConditions = chapters.filter(ch => ch.isActive && ch.type === 'condition').length;

  let summary = `Your health story includes ${totalEvents} recorded events across ${chapters.length} chapters. `;

  if (activeConditions > 0) {
    summary += `You are actively managing ${activeConditions} health condition${activeConditions > 1 ? 's' : ''}. `;
  }

  // Find recent activity
  const allEvents = chapters.flatMap(ch => ch.events);
  const recentEvents = allEvents.filter(e => {
    const eventDate = new Date(e.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return eventDate >= thirtyDaysAgo;
  });

  if (recentEvents.length > 0) {
    summary += `In the past 30 days, you have had ${recentEvents.length} health-related event${recentEvents.length > 1 ? 's' : ''}. `;
  }

  summary += 'Continue working with your healthcare team to maintain and improve your health.';

  return summary;
}
