import React from "react";
import { useGlobalErrors } from "@/providers/globalError/use-globalError";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { staticRoutes } from "@/router/BrowserRouter";

export const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { addError } = useGlobalErrors();

  React.useEffect(() => {
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
      errorMessage = `Router Error ${error.status}: ${error.data?.message || error.statusText}`;
    } else if (error instanceof Error) {
      errorMessage = `Router Error: ${error.message}`;
    } else {
      errorMessage = "Unknown router error occurred";
    }

    addError({
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }, [error, addError]);

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.data?.message || error.statusText || "An error occurred";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "An unknown error occurred";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
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
          {errorStatus ? `Error ${errorStatus}` : "Navigation Error"}
        </h1>

        <p className="text-gray-600 mb-6">{errorMessage}</p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate(`/${staticRoutes.BASE}`)}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
