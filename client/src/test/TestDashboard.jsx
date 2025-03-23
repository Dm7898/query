import React from "react";
import TestUploadFile from "./TestUploadFile";
import TestFilterComponent from "./TestFilterComponent";

const TestDashboard = () => {
  return (
    <main className="container mx-auto px-3 sm:px-6">
      <TestUploadFile />
      <TestFilterComponent />
    </main>
  );
};

export default TestDashboard;
