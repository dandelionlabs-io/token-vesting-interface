import React from "react";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import InvestorPage from "./pages/investor";
import ManagerPage from "./pages/manager";
import MainLayout from "./components/utils/layout/MainLayout";
import LoadingModal from "./components/modals/loading/LoadingModal";
import ErrorModal from "./components/modals/error/ErrorModal";
import { useError } from "./providers/ErrorProvider";
import { useLoading } from "./providers/LoadingProvider";
import "./App.scss";

const App = () => {
  const { isLoading, setIsLoading } = useLoading();
  const { isError, setIsError, errorMessage } = useError();

  return (
    <div className="App" style={{ backgroundColor: "#00142D" }}>
      <Navbar></Navbar>
      <MainLayout id="app_body">
        <Routes>
          <Route path="/" element={<InvestorPage />} />
          <Route path="manager" element={<ManagerPage />} />
        </Routes>
        <LoadingModal isLoading={isLoading} setIsLoading={setIsLoading} />
        <ErrorModal
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
        />
      </MainLayout>
    </div>
  );
};

export default App;
