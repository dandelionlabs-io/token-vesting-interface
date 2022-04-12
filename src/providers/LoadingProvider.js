import React, { useState, useContext, createContext } from "react";

const LoadingContext = createContext();

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  return useContext(LoadingContext);
};
