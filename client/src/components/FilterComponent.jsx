import React, { useEffect, useState, useRef } from "react";
import { api } from "../api/api";
import { ResultsPage } from "./ResultsPage";

const FilterComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const categoryRef = useRef(null);
  const branchRef = useRef(null);
  const supplierRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/suppliers/categories");
        setCategories(["All", ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) return;

    const fetchFilters = async () => {
      try {
        const categoriesParam = selectedCategories.includes("All")
          ? "All"
          : selectedCategories.join(",");

        const { data } = await api.get(
          `/suppliers/filters?category=${categoriesParam}`
        );

        setBranches(["All", ...data.branches]);
        setSuppliers(["All", ...data.suppliers]);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, [selectedCategories]);

  const toggleSelection = (option, selected, setSelected) => {
    if (option === "All") {
      setSelected(selected.includes("All") ? [] : [...categories]);
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
  const getValidSelections = (selected, allOptions) => {
    return selected.includes("All")
      ? allOptions.filter((opt) => opt !== "All")
      : selected;
  };
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
              onChange={() => toggleSelection(option, selected, setSelected)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Filter Transactions
      </h2>
      <Dropdown
        label="Categories"
        options={categories}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        refEl={categoryRef}
      />
      <Dropdown
        label="Branches"
        options={branches}
        selected={selectedBranches}
        setSelected={setSelectedBranches}
        refEl={branchRef}
      />
      <Dropdown
        label="Suppliers"
        options={suppliers}
        selected={selectedSuppliers}
        setSelected={setSelectedSuppliers}
        refEl={supplierRef}
      />
      <ResultsPage
        selectedBranches={getValidSelections(selectedBranches, branches)}
        selectedSuppliers={getValidSelections(selectedSuppliers, suppliers)}
      />
    </div>
  );
};

export default FilterComponent;
