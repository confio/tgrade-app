import ErrorBanner from "App/components/ErrorBanner";
import { createContext, HTMLAttributes, useContext, useState } from "react";
import { getErrorFromStackTrace } from "utils/errors";

interface ErrorContextType {
  readonly error?: string;
  readonly handleError: (error: Error) => void;
  readonly clearError: () => void;
}

const defaultContext: ErrorContextType = {
  handleError: () => {
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

  function handleError(error: Error): void {
    console.error(error);
    setError(getErrorFromStackTrace(error));
  }

  const context: ErrorContextType = {
    error,
    handleError,
    clearError: () => {
      setError(undefined);
    },
  };

  return (
    <ErrorContext.Provider value={context}>
      {children}
      <ErrorBanner />
    </ErrorContext.Provider>
  );
}
