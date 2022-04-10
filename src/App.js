import React from "react";

import Navbar from "./components/navbar/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import InvestorPage from "./pages/investor";
import ManagerPage from "./pages/manager";
import MainLayout from "./components/utils/layout/MainLayout";

import "./App.scss";

const App = () => {
  const { showModalInfo, setShowModalInfo } = useAuth();

  return (
    <div className="App">
      <Navbar></Navbar>
      <MainLayout id="app_body">
        <Routes>
          <Route path="/" element={<InvestorPage />} />
          <Route path="manager" element={<ManagerPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
};

export default App;
