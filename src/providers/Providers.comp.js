import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import LoadingProvider from "./LoadingProvider";
import ErrorProvider from "./ErrorProvider";

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>{children}</AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}
