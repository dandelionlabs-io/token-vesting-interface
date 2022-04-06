import React from "react";

import Navbar from "./components/navbar/Navbar";

import { Route } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import InvestorPage from "./pages/investor";
import ManagerPage from "./pages/manager";
import MainLayout from "./components/utils/layout/MainLayout";

import "./App.scss";

const Frontend = () => {
  const { showModalInfo, setShowModalInfo } = useAuth();

  return (
    <div className="App">
      <Navbar></Navbar>
      <MainLayout id="app_body">
        <Route path="/" element={<InvestorPage />} />
        <Route path="manager" element={<ManagerPage />} />
      </MainLayout>
    </div>
  );
};

export default Frontend;
