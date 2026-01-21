'use client';

/**
 * ChapterHeader Component
 * Renders a chapter header in the health story timeline with summary and insights
 */

import React, { useState } from 'react';
import { StoryChapter, ChapterInsight, ChapterType } from '../types';

interface ChapterHeaderProps {
  chapter: StoryChapter;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onViewChapter?: (chapterId: string) => void;
  showInsights?: boolean;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  chapter,
  isExpanded = false,
  onToggleExpand,
  onViewChapter,
  showInsights = true,
}) => {
  const [showAllInsights, setShowAllInsights] = useState(false);

  const formatDateRange = () => {
    const start = new Date(chapter.startDate);
    const end = chapter.endDate ? new Date(chapter.endDate) : null;

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric',
    };

    if (end) {
      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
    }
    return `Since ${start.toLocaleDateString('en-US', formatOptions)}`;
  };

  const getChapterTypeIcon = (type: ChapterType) => {
    const icons: Record<ChapterType, JSX.Element> = {
      condition: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      time_period: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      body_system: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      treatment_plan: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    };
    return icons[type] || icons.condition;
  };

  const getInsightIcon = (type: ChapterInsight['type']) => {
    const iconClasses: Record<string, { icon: JSX.Element; bgColor: string; textColor: string }> = {
      trend: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
      },
      achievement: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      },
      warning: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600',
      },
      improvement: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ),
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
      },
      correlation: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        ),
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      },
      reminder: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        ),
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
      },
      milestone: {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        ),
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-600',
      },
    };
    return iconClasses[type] || iconClasses.trend;
  };

  const visibleInsights = showAllInsights
    ? chapter.insights
    : chapter.insights.slice(0, 2);

  return (
    <div className="mb-6">
      {/* Chapter header card */}
      <div
        className={`bg-gradient-to-r ${
          chapter.isActive
            ? 'from-blue-50 to-indigo-50 border-blue-200'
            : 'from-gray-50 to-slate-50 border-gray-200'
        } rounded-xl border-2 overflow-hidden`}
      >
        {/* Main header */}
        <div
          className="p-5 cursor-pointer hover:bg-white/50 transition-colors"
          onClick={onToggleExpand}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Chapter type icon */}
              <div
                className={`flex-shrink-0 p-3 rounded-lg ${
                  chapter.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {getChapterTypeIcon(chapter.type)}
              </div>

              {/* Chapter info */}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {chapter.title}
                  </h2>
                  {chapter.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatDateRange()}</p>
                <p className="text-sm text-gray-600 mt-2">{chapter.description}</p>
              </div>
            </div>

            {/* Event count and expand button */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {chapter.events.length}
                </p>
                <p className="text-xs text-gray-500">events</p>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isExpanded ? 'Collapse chapter' : 'Expand chapter'}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chapter summary */}
          {chapter.summary && (
            <div className="mt-4 p-4 bg-white/70 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                {chapter.summary}
              </p>
            </div>
          )}
        </div>

        {/* Insights section */}
        {showInsights && chapter.insights.length > 0 && (
          <div className="px-5 pb-5 border-t border-gray-200/50">
            <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-3">
              Insights
            </h3>
            <div className="space-y-2">
              {visibleInsights.map((insight) => {
                const iconStyle = getInsightIcon(insight.type);
                return (
                  <div
                    key={insight.id}
                    className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100"
                  >
                    <div
                      className={`flex-shrink-0 p-1.5 rounded ${iconStyle.bgColor} ${iconStyle.textColor}`}
                    >
                      {iconStyle.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {insight.description}
                      </p>
                      {insight.recommendation && (
                        <p className="text-sm text-blue-600 mt-1 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {insight.recommendation}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {Math.round(insight.confidence * 100)}% confident
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {chapter.insights.length > 2 && (
              <button
                onClick={() => setShowAllInsights(!showAllInsights)}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {showAllInsights
                  ? 'Show fewer insights'
                  : `Show ${chapter.insights.length - 2} more insights`}
              </button>
            )}
          </div>
        )}

        {/* View chapter button */}
        {onViewChapter && (
          <div className="px-5 pb-5">
            <button
              onClick={() => onViewChapter(chapter.id)}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              View Full Chapter Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterHeader;
