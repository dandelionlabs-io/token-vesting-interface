import "./App.css";
import InvestorPage from "./pages/investor";
import ManagerPage from "./pages/manager";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvestorPage />} />
          <Route path="manager" element={<ManagerPage />} />{" "}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
