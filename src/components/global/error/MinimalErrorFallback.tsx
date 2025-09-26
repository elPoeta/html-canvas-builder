import { ErrorFallbackProps } from "./GlobalErrorBoundary";

export const MinimalErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="text-red-800 font-medium mb-2">Something went wrong</h2>
    <p className="text-red-600 text-sm mb-3">{error?.message}</p>
    <button
      onClick={resetError}
      className="text-red-600 underline hover:text-red-800 transition-colors"
    >
      Try again
    </button>
  </div>
);
