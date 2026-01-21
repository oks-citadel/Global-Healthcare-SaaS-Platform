'use client';

/**
 * InsightCard Component
 * Displays health insights and achievements with engaging visuals
 */

import React from 'react';
import { ChapterInsight, HealthAchievement, InsightType } from '../types';

interface InsightCardProps {
  insight?: ChapterInsight;
  achievement?: HealthAchievement;
  onViewRelatedEvents?: (eventIds: string[]) => void;
  onShare?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  achievement,
  onViewRelatedEvents,
  onShare,
  variant = 'default',
}) => {
  if (achievement) {
    return (
      <AchievementCard
        achievement={achievement}
        onShare={onShare}
        variant={variant}
      />
    );
  }

  if (insight) {
    return (
      <InsightCardContent
        insight={insight}
        onViewRelatedEvents={onViewRelatedEvents}
        variant={variant}
      />
    );
  }

  return null;
};

// Insight card content
interface InsightCardContentProps {
  insight: ChapterInsight;
  onViewRelatedEvents?: (eventIds: string[]) => void;
  variant: 'default' | 'compact' | 'featured';
}

const InsightCardContent: React.FC<InsightCardContentProps> = ({
  insight,
  onViewRelatedEvents,
  variant,
}) => {
  const getInsightStyles = (type: InsightType) => {
    const styles: Record<
      InsightType,
      {
        gradient: string;
        iconBg: string;
        iconColor: string;
        borderColor: string;
      }
    > = {
      trend: {
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
      },
      achievement: {
        gradient: 'from-yellow-500 to-orange-500',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        borderColor: 'border-yellow-200',
      },
      warning: {
        gradient: 'from-orange-500 to-red-500',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200',
      },
      improvement: {
        gradient: 'from-green-500 to-emerald-500',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
      },
      correlation: {
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200',
      },
      reminder: {
        gradient: 'from-indigo-500 to-blue-500',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        borderColor: 'border-indigo-200',
      },
      milestone: {
        gradient: 'from-pink-500 to-rose-500',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600',
        borderColor: 'border-pink-200',
      },
    };
    return styles[type] || styles.trend;
  };

  const getInsightIcon = (type: InsightType) => {
    const icons: Record<InsightType, JSX.Element> = {
      trend: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      achievement: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      warning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      improvement: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      correlation: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      reminder: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      milestone: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
    };
    return icons[type] || icons.trend;
  };

  const styles = getInsightStyles(insight.type);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 p-3 rounded-lg border ${styles.borderColor} bg-white`}>
        <div className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
          {getInsightIcon(insight.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{insight.title}</p>
          <p className="text-xs text-gray-500 truncate">{insight.description}</p>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${styles.gradient}`} />
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 p-3 rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {Math.round(insight.confidence * 100)}% confident
                </span>
              </div>
              <p className="mt-2 text-gray-600">{insight.description}</p>
              {insight.recommendation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm text-blue-800">{insight.recommendation}</p>
                  </div>
                </div>
              )}
              {insight.relatedEvents.length > 0 && onViewRelatedEvents && (
                <button
                  onClick={() => onViewRelatedEvents(insight.relatedEvents)}
                  className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View {insight.relatedEvents.length} related events
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`rounded-xl border ${styles.borderColor} bg-white overflow-hidden`}>
      <div className={`h-1 bg-gradient-to-r ${styles.gradient}`} />
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
            {getInsightIcon(insight.type)}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
            {insight.recommendation && (
              <p className="mt-2 text-sm text-blue-600 flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {insight.recommendation}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement card
interface AchievementCardProps {
  achievement: HealthAchievement;
  onShare?: () => void;
  variant: 'default' | 'compact' | 'featured';
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onShare,
  variant,
}) => {
  const getCategoryStyles = (category: HealthAchievement['category']) => {
    const styles: Record<
      HealthAchievement['category'],
      { gradient: string; bgColor: string; textColor: string }
    > = {
      wellness: {
        gradient: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
      },
      compliance: {
        gradient: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      },
      improvement: {
        gradient: 'from-purple-400 to-pink-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      },
      engagement: {
        gradient: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
      },
      milestone: {
        gradient: 'from-yellow-400 to-amber-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      },
    };
    return styles[category] || styles.milestone;
  };

  const getAchievementIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      star: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      trophy: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      heart: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'shield-check': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      'calendar-check': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    };
    return icons[iconName] || icons.star;
  };

  const styles = getCategoryStyles(achievement.category);
  const formattedDate = new Date(achievement.earnedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
        <div className={`flex-shrink-0 p-2 rounded-lg ${styles.bgColor} ${styles.textColor}`}>
          {getAchievementIcon(achievement.iconName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{achievement.title}</p>
          <p className="text-xs text-gray-500">Earned {formattedDate}</p>
        </div>
        {achievement.points && (
          <span className="flex-shrink-0 text-sm font-bold text-yellow-600">
            +{achievement.points}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-10`} />
        <div className="relative p-8 text-center">
          <div className={`inline-flex p-4 rounded-full ${styles.bgColor} ${styles.textColor} mb-4`}>
            {getAchievementIcon(achievement.iconName)}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{achievement.title}</h3>
          <p className="mt-2 text-gray-600">{achievement.description}</p>
          <p className="mt-4 text-sm text-gray-500">Earned on {formattedDate}</p>
          {achievement.points && (
            <div className="mt-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                +{achievement.points} points
              </span>
            </div>
          )}
          {onShare && (
            <button
              onClick={onShare}
              className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Achievement
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient}`} />
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 p-3 rounded-xl ${styles.bgColor} ${styles.textColor}`}>
            {getAchievementIcon(achievement.iconName)}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900">{achievement.title}</h4>
            <p className="mt-1 text-sm text-gray-600">{achievement.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Earned {formattedDate}</span>
              {achievement.points && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800">
                  +{achievement.points} pts
                </span>
              )}
            </div>
          </div>
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="mt-4 w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Share this achievement
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
