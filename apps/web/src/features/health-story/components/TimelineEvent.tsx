'use client';

/**
 * TimelineEvent Component
 * Renders a single event in the health timeline with plain language descriptions
 */

import React, { useState } from 'react';
import {
  TimelineEvent as TimelineEventData,
  EventProvider,
  EventAttachment,
} from '../types';
import { getEventTypeInfo, getSeverityInfo } from '../hooks/useTimelineEvents';
import { generateEventSummary } from '../services/storyGenerator';

interface TimelineEventProps {
  event: TimelineEventData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onViewRelated?: (eventId: string) => void;
  showConnector?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  isExpanded = false,
  onToggleExpand,
  onViewRelated,
  showConnector = true,
  isFirst = false,
  isLast = false,
}) => {
  const [showAttachments, setShowAttachments] = useState(false);

  const typeInfo = getEventTypeInfo(event.type);
  const severityInfo = getSeverityInfo(event.severity);
  const plainLanguageSummary = event.plainLanguageSummary || generateEventSummary(event);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    const statusStyles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      resolved: 'bg-gray-100 text-gray-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[event.status] || statusStyles.active
        }`}
      >
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </span>
    );
  };

  const renderProvider = (provider: EventProvider) => (
    <div key={provider.id} className="flex items-center space-x-2 mt-2">
      {provider.imageUrl ? (
        <img
          src={provider.imageUrl}
          alt={provider.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">
            {provider.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="text-sm">
        <p className="font-medium text-gray-900">{provider.name}</p>
        <p className="text-gray-500">{provider.specialty}</p>
      </div>
    </div>
  );

  const renderAttachment = (attachment: EventAttachment) => (
    <a
      key={attachment.id}
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.name}
        </p>
        <p className="text-xs text-gray-500">
          {(attachment.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </a>
  );

  return (
    <div className="relative">
      {/* Timeline connector */}
      {showConnector && (
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
          {isFirst && <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent" />}
          {isLast && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />}
        </div>
      )}

      {/* Event card */}
      <div className="relative flex items-start space-x-4 pb-8">
        {/* Event type indicator */}
        <div
          className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            severityInfo.bgColor
          } ring-4 ring-white`}
        >
          <EventTypeIcon type={event.type} className={`w-6 h-6 ${severityInfo.color}`} />
        </div>

        {/* Event content */}
        <div className="flex-1 min-w-0">
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
              isExpanded ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {/* Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={onToggleExpand}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}
                    >
                      {typeInfo.label}
                    </span>
                    {getStatusBadge()}
                    {event.severity !== 'info' && event.severity !== 'low' && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityInfo.bgColor} ${severityInfo.color}`}
                      >
                        {severityInfo.label}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(event.date)}
                    {event.endDate && ` - ${formatDate(event.endDate)}`}
                    {' '}at {formatTime(event.date)}
                  </p>
                </div>
                <button
                  className="ml-4 text-gray-400 hover:text-gray-600"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
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

              {/* Plain language summary - always visible */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {plainLanguageSummary}
                </p>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {/* Location */}
                {event.location && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Location
                    </h4>
                    <p className="text-sm text-gray-600">
                      {event.location.facilityName}
                      {event.location.city && `, ${event.location.city}`}
                      {event.location.state && `, ${event.location.state}`}
                    </p>
                  </div>
                )}

                {/* Providers */}
                {event.providers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Healthcare Providers
                    </h4>
                    <div className="space-y-1">
                      {event.providers.map(renderProvider)}
                    </div>
                  </div>
                )}

                {/* Related conditions */}
                {event.relatedConditions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Related Conditions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.relatedConditions.map((condition) => (
                        <span
                          key={condition}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {event.attachments.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowAttachments(!showAttachments)}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <svg
                        className={`w-4 h-4 mr-1 transition-transform ${
                          showAttachments ? 'transform rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Attachments ({event.attachments.length})
                    </button>
                    {showAttachments && (
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {event.attachments.map(renderAttachment)}
                      </div>
                    )}
                  </div>
                )}

                {/* Related events */}
                {event.relatedEvents.length > 0 && onViewRelated && (
                  <div className="mt-4">
                    <button
                      onClick={() => onViewRelated(event.id)}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      View {event.relatedEvents.length} related event
                      {event.relatedEvents.length > 1 ? 's' : ''}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Event type icon component
interface EventTypeIconProps {
  type: string;
  className?: string;
}

const EventTypeIcon: React.FC<EventTypeIconProps> = ({ type, className = '' }) => {
  const icons: Record<string, JSX.Element> = {
    diagnosis: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    treatment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    medication: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    procedure: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    lab_result: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    imaging: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    appointment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    hospitalization: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    vaccination: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    vital_reading: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    lifestyle_change: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    milestone: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    note: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  };

  return icons[type] || icons.note;
};

export default TimelineEvent;
