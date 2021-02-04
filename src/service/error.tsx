import { createContext, HTMLAttributes, useContext, useState } from "react";

interface ErrorContextType {
  readonly error?: string;
  readonly setError: (error: string) => void;
  readonly clearError: () => void;
}

const defaultContext: ErrorContextType = {
  setError: () => {
    return;
  },
  clearError: () => {
    return;
  },
};

const ErrorContext = createContext<ErrorContextType>(defaultContext);

export const useError = (): ErrorContextType => useContext(ErrorContext);

export default function ErrorProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [error, setError] = useState<string>();

  const context: ErrorContextType = {
    error: error,
    setError: setError,
    clearError: () => {
      setError(undefined);
    },
  };

  return <ErrorContext.Provider value={context}>{children}</ErrorContext.Provider>;
}
