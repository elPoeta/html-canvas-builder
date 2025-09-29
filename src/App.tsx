/* eslint-disable @typescript-eslint/no-explicit-any */

import { GlobalErrorBoundary } from "./components/global/error/GlobalErrorBoundary";
import { ErrorInfo, useCallback } from "react";
import { GlobalErrorProvider } from "./providers/globalError/GlobalErrorProvider";
import { GlobalErrorNotifications } from "./components/global/error/GlobalErrorNotifications";
import { useGlobalErrors } from "./providers/globalError/use-globalError";
import { useGlobalErrorHandler } from "./providers/globalError/use-globalErrorHandler";
import HtmlCanvasBuilder from "./components/htmlBuilder/HtmlCanvasBuilder";

const isDevelopment = `${new URL(window.location.href).origin}`
  .trim()
  .includes("dev");

const AppContent: React.FC = () => {
  const { addError } = useGlobalErrors();

  const handleReactError = useCallback(
    (error: Error, errorInfo: ErrorInfo, errorId: string) => {
      console.error("🚨 React Error Boundary:", { error, errorInfo, errorId });

      addError({
        message: `React Error: ${error.message}`,
        stack: error.stack,
      });
    },
    [addError],
  );

  const handleGlobalError = useCallback(
    (errorInfo: any) => {
      addError({
        message: errorInfo.message,
        stack: errorInfo.stack,
      });
    },
    [addError],
  );

  useGlobalErrorHandler(handleGlobalError);

  return (
    <>
      <GlobalErrorBoundary
        maxRetries={3}
        onError={handleReactError}
        enableReporting={true}
        enableDevelopmentDetails={isDevelopment}
      >
        <HtmlCanvasBuilder />
      </GlobalErrorBoundary>

      <GlobalErrorNotifications />
    </>
  );
};

function App() {
  return (
    <GlobalErrorProvider maxErrors={10}>
      <AppContent />
    </GlobalErrorProvider>
  );
}

export default App;
