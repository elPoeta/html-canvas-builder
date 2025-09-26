import { useState, ReactNode, useCallback } from "react";
import { GlobalErrorContext } from "./use-globalError";

export interface GlobalError {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  dismissed?: boolean;
}

interface GlobalErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({
  children,
  maxErrors = 5,
}) => {
  const [errors, setErrors] = useState<GlobalError[]>([]);

  // Memoize addError to prevent unnecessary re-renders
  const addError = useCallback(
    (error: Omit<GlobalError, "id" | "timestamp">) => {
      const newError: GlobalError = {
        ...error,
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        timestamp: new Date().toISOString(),
      };

      setErrors((prev) => {
        const isDuplicate = prev.some(
          (existingError) =>
            existingError.message === newError.message &&
            Date.now() - new Date(existingError.timestamp).getTime() < 5000,
        );

        if (isDuplicate) {
          console.log("Duplicate error prevented:", newError.message);
          return prev;
        }

        const updatedErrors = [newError, ...prev].slice(0, maxErrors);
        return updatedErrors;
      });
    },
    [maxErrors],
  );

  const dismissError = useCallback((id: string) => {
    setErrors((prev) =>
      prev.map((error) =>
        error.id === id ? { ...error, dismissed: true } : error,
      ),
    );
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <GlobalErrorContext.Provider
      value={{ errors, addError, dismissError, clearErrors }}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
};
