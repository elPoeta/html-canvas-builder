import { ErrorFallbackProps } from "./GlobalErrorBoundary";

export const DetailedErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  resetErrorBoundary,
  errorId,
  retryCount = 0,
  maxRetries = 3,
  onReportIssue,
}) => (
  <div className="p-6 bg-white border rounded-lg shadow-sm max-w-lg mx-auto">
    <div className="flex items-center mb-4">
      <svg
        className="h-6 w-6 text-red-500 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-lg font-semibold text-gray-900">Error Detected</h2>
    </div>

    <p className="text-gray-600 mb-4">
      An error occurred in this section. You can try to reload this component or
      refresh the entire page.
    </p>

    {errorId && (
      <div className="bg-gray-100 rounded p-2 mb-4">
        <p className="text-xs font-mono text-gray-700">Error ID: {errorId}</p>
      </div>
    )}

    <div className="flex gap-3 mb-4">
      <button
        onClick={resetErrorBoundary || resetError}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={retryCount >= maxRetries}
      >
        {retryCount >= maxRetries
          ? `Max Retries (${maxRetries})`
          : `Retry Component ${retryCount > 0 ? `(${retryCount})` : ""}`}
      </button>

      <button
        onClick={() => window.location.reload()}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>

    {onReportIssue && (
      <button
        onClick={onReportIssue}
        className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors mb-4"
      >
        Report this issue
      </button>
    )}

    {process.env.NODE_ENV === "development" && error && (
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          Show error details
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32">
          {error.stack}
        </pre>
      </details>
    )}
  </div>
);
