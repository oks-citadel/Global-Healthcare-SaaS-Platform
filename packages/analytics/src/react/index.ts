/**
 * React hooks and components for Analytics
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import type {
  AnalyticsClient,
  ConsentLevel,
  ConsentState,
  EventCategory,
  AnalyticsEventName,
} from "../index";

// ============================================================================
// Context
// ============================================================================

interface AnalyticsContextValue {
  client: AnalyticsClient | null;
  track: (
    name: string,
    properties?: Record<string, any>,
    category?: EventCategory,
  ) => Promise<void>;
  page: (
    path: string,
    title?: string,
    properties?: Record<string, any>,
  ) => Promise<void>;
  identify: (userId?: string, traits?: Record<string, any>) => Promise<void>;
  trackConversion: (
    name: string,
    value?: number,
    properties?: Record<string, any>,
  ) => Promise<void>;
  trackError: (
    error: Error | string,
    properties?: Record<string, any>,
  ) => Promise<void>;
  trackEngagement: (
    action: string,
    properties?: Record<string, any>,
  ) => Promise<void>;
  updateConsent: (level: ConsentLevel) => Promise<void>;
  getConsent: () => ConsentState | null;
  hasConsent: (required: ConsentLevel) => boolean;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export interface AnalyticsProviderProps {
  client: AnalyticsClient;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  client,
  children,
}: AnalyticsProviderProps): React.ReactElement {
  // Initialize on mount
  useEffect(() => {
    client.initialize().catch(console.error);
  }, [client]);

  const track = useCallback(
    async (
      name: string,
      properties?: Record<string, any>,
      category?: EventCategory,
    ) => {
      await client.track(name, properties, category);
    },
    [client],
  );

  const page = useCallback(
    async (path: string, title?: string, properties?: Record<string, any>) => {
      await client.page(path, title, properties);
    },
    [client],
  );

  const identify = useCallback(
    async (userId?: string, traits?: Record<string, any>) => {
      await client.identify(userId, traits);
    },
    [client],
  );

  const trackConversion = useCallback(
    async (name: string, value?: number, properties?: Record<string, any>) => {
      await client.trackConversion(name, value, properties);
    },
    [client],
  );

  const trackError = useCallback(
    async (error: Error | string, properties?: Record<string, any>) => {
      await client.trackError(error, properties);
    },
    [client],
  );

  const trackEngagement = useCallback(
    async (action: string, properties?: Record<string, any>) => {
      await client.trackEngagement(action, properties);
    },
    [client],
  );

  const updateConsent = useCallback(
    async (level: ConsentLevel) => {
      await client.updateConsent(level);
    },
    [client],
  );

  const getConsent = useCallback(() => {
    return client.getConsent();
  }, [client]);

  const hasConsent = useCallback(
    (required: ConsentLevel) => {
      return client.hasConsent(required);
    },
    [client],
  );

  const value = useMemo(
    () => ({
      client,
      track,
      page,
      identify,
      trackConversion,
      trackError,
      trackEngagement,
      updateConsent,
      getConsent,
      hasConsent,
    }),
    [
      client,
      track,
      page,
      identify,
      trackConversion,
      trackError,
      trackEngagement,
      updateConsent,
      getConsent,
      hasConsent,
    ],
  );

  return React.createElement(AnalyticsContext.Provider, { value }, children);
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Access the full analytics context
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}

/**
 * Track an event with optional automatic properties
 */
export function useTrackEvent() {
  const { track } = useAnalytics();
  return track;
}

/**
 * Track page views automatically when path changes
 */
export function usePageView(path: string, title?: string): void {
  const { page } = useAnalytics();
  const prevPath = useRef<string>();

  useEffect(() => {
    if (path !== prevPath.current) {
      prevPath.current = path;
      page(path, title);
    }
  }, [path, title, page]);
}

/**
 * Automatically track page views in Next.js/React Router
 */
export function useAutoPageView(): void {
  const { page } = useAnalytics();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track initial page
    page(window.location.pathname, document.title);

    // Track history changes
    const handlePopState = () => {
      page(window.location.pathname, document.title);
    };

    window.addEventListener("popstate", handlePopState);

    // For pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      page(window.location.pathname, document.title);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      page(window.location.pathname, document.title);
    };

    return () => {
      window.removeEventListener("popstate", handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [page]);
}

/**
 * Track time spent on page
 */
export function useTimeOnPage(pageName: string): void {
  const { track } = useAnalytics();
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();

    return () => {
      const timeSpent = Date.now() - startTime.current;
      track(
        "time_on_page",
        {
          page: pageName,
          duration_ms: timeSpent,
          duration_seconds: Math.round(timeSpent / 1000),
        },
        "engagement",
      );
    };
  }, [pageName, track]);
}

/**
 * Track user consent state
 */
export function useConsent(): {
  consent: ConsentState | null;
  updateConsent: (level: ConsentLevel) => Promise<void>;
  hasAnalyticsConsent: boolean;
  hasMarketingConsent: boolean;
} {
  const { getConsent, updateConsent, hasConsent } = useAnalytics();

  return {
    consent: getConsent(),
    updateConsent,
    hasAnalyticsConsent: hasConsent("analytics"),
    hasMarketingConsent: hasConsent("marketing"),
  };
}

/**
 * Track element visibility (for scroll tracking)
 */
export function useTrackVisibility(
  elementRef: React.RefObject<HTMLElement>,
  eventName: string,
  properties?: Record<string, any>,
): void {
  const { track } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          track(eventName, properties, "engagement");
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, eventName, properties, track]);
}

/**
 * Track click events on an element
 */
export function useTrackClick(
  eventName: string,
  properties?: Record<string, any>,
) {
  const { track } = useAnalytics();

  return useCallback(() => {
    track(eventName, properties, "user_action");
  }, [track, eventName, properties]);
}

// ============================================================================
// Components
// ============================================================================

/**
 * Track clicks on wrapped element
 */
export interface TrackClickProps {
  event: string;
  properties?: Record<string, any>;
  children: React.ReactElement;
}

export function TrackClick({
  event,
  properties,
  children,
}: TrackClickProps): React.ReactElement {
  const { track } = useAnalytics();

  const handleClick = useCallback(
    (originalOnClick?: React.MouseEventHandler) => {
      return (e: React.MouseEvent) => {
        track(event, properties, "user_action");
        if (originalOnClick) {
          originalOnClick(e);
        }
      };
    },
    [track, event, properties],
  );

  return React.cloneElement(children, {
    onClick: handleClick(children.props.onClick),
  });
}

/**
 * Consent banner component
 */
export interface ConsentBannerProps {
  onAcceptAll: () => void;
  onAcceptEssential: () => void;
  onCustomize?: () => void;
  children?: React.ReactNode;
}

export function ConsentBanner({
  onAcceptAll,
  onAcceptEssential,
  onCustomize,
  children,
}: ConsentBannerProps): React.ReactElement {
  const { updateConsent, getConsent } = useAnalytics();
  const consent = getConsent();

  // Don't show if already consented
  if (consent && consent.level !== "none") {
    return React.createElement(React.Fragment);
  }

  const handleAcceptAll = async () => {
    await updateConsent("all");
    onAcceptAll();
  };

  const handleAcceptEssential = async () => {
    await updateConsent("essential");
    onAcceptEssential();
  };

  if (children) {
    return React.createElement(React.Fragment, null, children);
  }

  // Default banner UI
  return React.createElement(
    "div",
    {
      role: "dialog",
      "aria-label": "Cookie consent",
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "16px",
        backgroundColor: "#fff",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
      },
    },
    React.createElement(
      "div",
      {
        style: {
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        },
      },
      React.createElement(
        "p",
        { style: { flex: 1, margin: 0 } },
        "We use cookies to improve your experience. By continuing, you agree to our use of cookies.",
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: "8px" } },
        React.createElement(
          "button",
          {
            onClick: handleAcceptEssential,
            style: {
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
            },
          },
          "Essential Only",
        ),
        onCustomize &&
          React.createElement(
            "button",
            {
              onClick: onCustomize,
              style: {
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer",
              },
            },
            "Customize",
          ),
        React.createElement(
          "button",
          {
            onClick: handleAcceptAll,
            style: {
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: "pointer",
            },
          },
          "Accept All",
        ),
      ),
    ),
  );
}

// ============================================================================
// HOC
// ============================================================================

/**
 * HOC to track component mounts/unmounts
 */
export function withPageTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageName: string,
): React.FC<P> {
  const WithPageTracking: React.FC<P> = (props) => {
    const { page } = useAnalytics();

    useEffect(() => {
      page(pageName, pageName);
    }, [page]);

    return React.createElement(WrappedComponent, props);
  };

  WithPageTracking.displayName = `withPageTracking(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithPageTracking;
}

// ============================================================================
// Exports
// ============================================================================

export { AnalyticsContext };
