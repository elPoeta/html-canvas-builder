import { useEffect, useRef } from "react";

interface GlobalErrorInfo {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
  stack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

type ErrorHandler = (errorInfo: GlobalErrorInfo) => void;

export const useGlobalErrorHandler = (onError?: ErrorHandler) => {
  const onErrorRef = useRef<ErrorHandler | undefined>(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const errorInfo: GlobalErrorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      console.error("🚨 Global Error Caught:", errorInfo);

      onErrorRef.current?.(errorInfo);

      // Send to monitoring service
      // Sentry.captureException(errorInfo.error || new Error(errorInfo.message), {
      //   extra: errorInfo
      // });
    };

    // Catch unhandled promise rejections (async errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      const errorInfo: GlobalErrorInfo = {
        message: `Unhandled Promise Rejection: ${error.message}`,
        error,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      console.error("🚨 Unhandled Promise Rejection:", errorInfo);

      // Call custom error handler if provided
      onErrorRef.current?.(errorInfo);

      // Prevent the default browser error dialog
      event.preventDefault();
    };

    // Add event listeners only once
    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []); // Empty dependency array - only run once
};
