import React, { useState, useContext, createContext } from "react";

const ErrorContext = createContext();

export default function ErrorProvider({ children }) {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setIsError(true);
  };

  return (
    <ErrorContext.Provider
      value={{
        isError,
        setIsError,
        errorMessage,
        setErrorMessage,
        showErrorModal,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export const useError = () => {
  return useContext(ErrorContext);
};
