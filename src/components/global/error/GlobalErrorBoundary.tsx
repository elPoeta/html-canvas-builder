import React, { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  userId?: string;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  onRetry?: (retryCount: number) => void;
  maxRetries?: number;
  enableReporting?: boolean;
  reportEmail?: string;
  enableDevelopmentDetails?: boolean;
}

export interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
}

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetError: () => void;
  resetErrorBoundary?: () => void;
  errorId?: string | null;
  retryCount?: number;
  maxRetries?: number;
  onReportIssue?: () => void;
}

export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  ErrorBoundaryState
> {
  private readonly maxRetries: number;
  private readonly enableReporting: boolean;
  private readonly reportEmail: string;
  private readonly enableDevelopmentDetails: boolean;

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };

    // Initialize readonly properties
    this.maxRetries = props.maxRetries ?? 3;
    this.enableReporting = props.enableReporting ?? true;
    this.reportEmail = props.reportEmail ?? "support@example.com";
    this.enableDevelopmentDetails =
      props.enableDevelopmentDetails ?? process.env.NODE_ENV === "development";
  }

  static getDerivedStateFromError() // error: Error,
  : Pick<ErrorBoundaryState, "hasError"> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log("🚨 ERROR BOUNDARY TRIGGERED!");
    const errorId = this.generateErrorId();

    // Log error details
    console.group("🚨 Error Boundary Caught an Error");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("Error ID:", errorId);
    console.groupEnd();

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    this.logErrorToService(error, errorInfo, errorId);
    this.props.onError?.(error, errorInfo, errorId);
  }

  private generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private logErrorToService = (
    error: Error,
    errorInfo: ErrorInfo,
    errorId: string,
  ): void => {
    const errorReport: ErrorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || "",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId,
    };

    console.log("📊 Error logged to monitoring service:", errorReport);

    // integrate with error tracking service:
    // Sentry.captureException(error, { contexts: { errorBoundary: errorReport } });
    // or
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(console.error);
  };

  private handleRetry = (): void => {
    const newRetryCount = this.state.retryCount + 1;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: newRetryCount,
    });

    this.props.onRetry?.(newRetryCount);
  };

  private handleReportIssue = (): void => {
    if (!this.enableReporting || !this.state.error || !this.state.errorId) {
      return;
    }

    const { error, errorId } = this.state;
    const subject = encodeURIComponent(
      `Bug Report: ${error.message || "Application Error"}`,
    );
    const body = encodeURIComponent(
      `Error ID: ${errorId}\nError: ${error.message}\nURL: ${window.location.href}\n\nPlease describe what you were doing when this error occurred:`,
    );

    window.open(`mailto:${this.reportEmail}?subject=${subject}&body=${body}`);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { error, errorId, retryCount } = this.state;
      const canRetry = retryCount < this.maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We've encountered an unexpected error. Our team has been
                notified and is working on a fix.
              </p>

              {errorId && (
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <p className="text-sm font-mono text-gray-700">
                    Error ID: {errorId}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleRetry}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canRetry}
                  >
                    {canRetry
                      ? `Try Again ${retryCount > 0 ? `(${retryCount}/${this.maxRetries})` : ""}`
                      : `Max Retries Reached (${this.maxRetries}/${this.maxRetries})`}
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>

                {this.enableReporting && (
                  <button
                    onClick={this.handleReportIssue}
                    className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
                  >
                    Report this issue
                  </button>
                )}
              </div>

              {/* Development mode: Show error details */}
              {this.enableDevelopmentDetails && error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-red-600 font-medium mb-2">
                    🔧 Developer Details (Development Mode)
                  </summary>
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                    <div className="mb-2">
                      <strong>Error:</strong> {error.message}
                    </div>
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
