export interface FunnelStep {
  name: string;
  eventType: string;
  filters?: Record<string, any>;
}

export interface FunnelResult {
  steps: Array<{
    name: string;
    eventType: string;
    count: number;
    conversionRate: number;
    dropoffRate: number;
  }>;
  overallConversionRate: number;
  totalStarted: number;
  totalCompleted: number;
  averageTimeToConvert: number;
}

export interface CohortDefinition {
  name: string;
  type: 'first_event' | 'property' | 'date_range';
  eventType?: string;
  property?: string;
  propertyValue?: any;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CohortResult {
  cohort: CohortDefinition;
  size: number;
  periods: Array<{
    period: number;
    activeUsers: number;
    retentionRate: number;
  }>;
  averageRetention: number;
}

export interface RetentionCurve {
  cohortDate: string;
  cohortSize: number;
  retention: Array<{
    day: number;
    activeUsers: number;
    retentionRate: number;
  }>;
}

export interface LTVResult {
  cohortMonth: string;
  customerCount: number;
  averageLTV: number;
  medianLTV: number;
  totalRevenue: number;
  averagePurchases: number;
  averageLifespanDays: number;
  projectedLTV?: number;
}

export interface ChurnResult {
  period: string;
  activeUsers: number;
  churnedUsers: number;
  churnRate: number;
  retainedUsers: number;
  retentionRate: number;
  newUsers: number;
  netGrowth: number;
}

export interface SessionAnalytics {
  date: string;
  totalSessions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  medianSessionDuration: number;
  avgEventsPerSession: number;
  bounceRate: number;
  avgPagesPerSession: number;
}

export interface AttributionModel {
  id: string;
  name: string;
  description: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven';
  config?: Record<string, any>;
}

export interface AttributionResult {
  model: AttributionModel;
  touchpoints: Array<{
    channel: string;
    conversions: number;
    attributedValue: number;
    percentage: number;
    avgTimeToConvert: number;
  }>;
  totalConversions: number;
  totalValue: number;
}

export interface CustomerJourney {
  userId: string;
  journeyId: string;
  startDate: string;
  endDate?: string;
  isConverted: boolean;
  conversionValue?: number;
  touchpoints: Array<{
    timestamp: string;
    channel: string;
    eventType: string;
    properties?: Record<string, any>;
  }>;
  duration: number;
  touchpointCount: number;
}

export interface TouchpointAnalysis {
  channel: string;
  totalTouchpoints: number;
  uniqueUsers: number;
  asFirstTouch: number;
  asLastTouch: number;
  asMiddleTouch: number;
  avgPosition: number;
  conversionRate: number;
}

export interface HeatmapData {
  pageUrl: string;
  resolution: {
    width: number;
    height: number;
  };
  dataPoints: Array<{
    x: number;
    y: number;
    value: number;
  }>;
  totalClicks: number;
  uniqueUsers: number;
  capturedAt: string;
}

export interface SessionRecording {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime: string;
  duration: number;
  pageViews: number;
  events: Array<{
    timestamp: string;
    type: string;
    data: Record<string, any>;
  }>;
  device: {
    type: string;
    os: string;
    browser: string;
    screenResolution: string;
  };
  location?: {
    country: string;
    city?: string;
  };
}

export interface ScrollmapData {
  pageUrl: string;
  resolution: {
    width: number;
    height: number;
  };
  pageHeight: number;
  folds: Array<{
    depth: number;
    percentage: number;
    viewersReached: number;
    viewersPercentage: number;
  }>;
  avgScrollDepth: number;
  totalViews: number;
}

export interface ClickmapData {
  pageUrl: string;
  elements: Array<{
    selector: string;
    elementType: string;
    text?: string;
    clicks: number;
    uniqueClicks: number;
    clickRate: number;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  totalClicks: number;
  uniqueClickers: number;
  pageViews: number;
}
