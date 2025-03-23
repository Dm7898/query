import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { TestResultsPage } from "./TestResultsPage";

const fetchCategories = async () => {
  const { data } = await api.get("/suppliers/categories");
  return ["All", ...data];
};

const fetchFilters = async (selectedCategories) => {
  if (!selectedCategories.length) return { branches: [], suppliers: [] };

  const categoriesParam = selectedCategories.includes("All")
    ? "All"
    : selectedCategories.join(",");

  const { data } = await api.get(
    `/suppliers/filters?category=${categoriesParam}`
  );
  return {
    branches: ["All", ...data.branches],
    suppliers: ["All", ...data.suppliers],
  };
};

function TestFilterComponent() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  const categoryRef = useRef(null);
  const branchRef = useRef(null);
  const supplierRef = useRef(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch branches and suppliers based on selected categories
  const { data: filters = { branches: [], suppliers: [] } } = useQuery({
    queryKey: ["filters", selectedCategories],
    queryFn: () => fetchFilters(selectedCategories),
    enabled: selectedCategories.length > 0,
  });

  const toggleSelection = (option, selected, setSelected, allOptions) => {
    if (option === "All") {
      setSelected(selected.includes("All") ? [] : allOptions);
    } else {
      const newSelection = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
      setSelected(
        newSelection.includes("All")
          ? newSelection.filter((item) => item !== "All")
          : newSelection
      );
    }
  };

  const getValidSelections = (selected, allOptions) =>
    selected.includes("All")
      ? allOptions.filter((opt) => opt !== "All")
      : selected;

  const Dropdown = ({ label, options, selected, setSelected, refEl }) => (
    <div className="relative w-full mb-4">
      <div
        className="w-full p-2 border rounded-md shadow-sm bg-white cursor-pointer"
        onClick={() => refEl.current.classList.toggle("hidden")}
      >
        {selected.length > 0 ? selected.join(", ") : `Select ${label}`}
      </div>
      <div
        ref={refEl}
        className="absolute bg-white shadow-md border rounded-md mt-1 hidden z-10 w-full"
      >
        {options.map((option) => (
          <label key={option} className="block px-4 py-2 hover:bg-gray-100">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() =>
                toggleSelection(option, selected, setSelected, options)
              }
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Filter Transactions
      </h2>
      <h4 className="mb-1 font-semibold">Category</h4>
      <Dropdown
        label="Categories"
        options={categories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        refEl={categoryRef}
      />
      <h4 className="mb-1 font-semibold">Branch</h4>
      <Dropdown
        label="Branches"
        options={filters.branches}
        selected={selectedBranches}
        setSelected={setSelectedBranches}
        refEl={branchRef}
      />
      <h4 className="mb-1 font-semibold">Supplier</h4>
      <Dropdown
        label="Suppliers"
        options={filters.suppliers}
        selected={selectedSuppliers}
        setSelected={setSelectedSuppliers}
        refEl={supplierRef}
      />
      <TestResultsPage
        selectedBranches={getValidSelections(
          selectedBranches,
          filters.branches
        )}
        selectedSuppliers={getValidSelections(
          selectedSuppliers,
          filters.suppliers
        )}
      />
    </div>
  );
}

export default TestFilterComponent;
