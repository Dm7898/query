import React from "react";
// import AgentForm from "../components/AgentForm";
import UploadFile from "../components/UploadFile";
// import SupplierList from "../components/FilterComponent";
import FilterComponent from "../components/FilterComponent";

const Dashboard = () => {
  return (
    <main className="container mx-auto px-3 sm:px-6">
      <UploadFile />
      <FilterComponent />
    </main>
  );
};

export default Dashboard;
