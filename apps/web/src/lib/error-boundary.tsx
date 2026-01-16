/**
 * React Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service (e.g., Sentry)
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error boundary when resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      !this.arraysEqual(this.props.resetKeys, prevProps.resetKeys)
    ) {
      this.resetErrorBoundary();
    }
  }

  arraysEqual(a: Array<string | number>, b: Array<string | number>): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  reportError(error: Error, errorInfo: ErrorInfo): void {
    // This is where you would integrate with error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });

    // For now, we'll just log it
    console.error('Error reported:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(
            this.state.error!,
            this.state.errorInfo!
          );
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

function DefaultErrorFallback({
  error,
  errorInfo,
  onReset
}: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '2rem auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#d32f2f',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Something went wrong
        </h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          We're sorry, but something unexpected happened. Please try again.
        </p>
      </div>

      {isDevelopment && (
        <div style={{ marginBottom: '1.5rem' }}>
          <details
            style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: '500',
                marginBottom: '0.5rem',
                userSelect: 'none'
              }}
            >
              Error Details
            </summary>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Error Message:
              </p>
              <pre
                style={{
                  backgroundColor: '#fff',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                  color: '#d32f2f',
                  border: '1px solid #ffcdd2'
                }}
              >
                {error.toString()}
              </pre>

              {error.stack && (
                <>
                  <p
                    style={{
                      fontWeight: '600',
                      marginTop: '1rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Stack Trace:
                  </p>
                  <pre
                    style={{
                      backgroundColor: '#fff',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {error.stack}
                  </pre>
                </>
              )}

              {errorInfo && errorInfo.componentStack && (
                <>
                  <p
                    style={{
                      fontWeight: '600',
                      marginTop: '1rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Component Stack:
                  </p>
                  <pre
                    style={{
                      backgroundColor: '#fff',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      overflow: 'auto',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          </details>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onReset}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1565c0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1976d2';
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#fff',
            color: '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
            e.currentTarget.style.borderColor = '#bdbdbd';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

/**
 * Hook-based error boundary wrapper
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}

/**
 * Page-level Error Boundary with custom styling
 */
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Report to error tracking
        console.error('Page error:', error, errorInfo);
      }}
      fallback={(error, errorInfo) => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We're sorry for the inconvenience. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 bg-gray-50 rounded p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
                  {error.toString()}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
