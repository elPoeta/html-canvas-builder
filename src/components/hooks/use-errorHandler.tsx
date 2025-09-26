import { ErrorInfo, useCallback } from "react";
import { ErrorReport } from "../global/error/GlobalErrorBoundary";

type ErrorHandler = (error: Error, errorInfo?: ErrorInfo) => void;

export const useErrorHandler = (): ErrorHandler => {
  return useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught by error handler:", error, errorInfo);

    // Log to monitoring service
    const errorReport: Partial<ErrorReport> = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    console.log("Error logged:", errorReport);
  }, []);
};
