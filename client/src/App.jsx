import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestDashboard from "./test/TestDashboard";

function App() {
  return (
    <Routes>
      <Route index element={<TestDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test-dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<TestDashboard />} />
    </Routes>
  );
}

export default App;
