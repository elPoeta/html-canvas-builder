import { createContext, useContext } from "react";
import { GlobalError } from "./GlobalErrorProvider";

interface GlobalErrorContextType {
  errors: GlobalError[];
  addError: (error: Omit<GlobalError, "id" | "timestamp">) => void;
  dismissError: (id: string) => void;
  clearErrors: () => void;
}

export const GlobalErrorContext = createContext<
  GlobalErrorContextType | undefined
>(undefined);

export const useGlobalErrors = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error("useGlobalErrors must be used within GlobalErrorProvider");
  }
  return context;
};
