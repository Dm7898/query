// import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useQuery } from "@tanstack/react-query";

export const ResultsPage = ({ selectedBranches, selectedSuppliers }) => {
  const fetchResults = async () => {
    const { data } = await api.get(
      `/suppliers/results?branches=${selectedBranches.join(
        ","
      )}&suppliers=${selectedSuppliers.join(",")}`
    );
    return data;
  };

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results", selectedBranches, selectedSuppliers],
    queryFn: fetchResults,
    enabled: selectedBranches.length > 0 && selectedSuppliers.length > 0,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    keepPreviousData: true, // Keep old data while fetching new data
    retry: 2, // Retry 2 times before failing
  });

  if (isLoading) return <p>Loading results...</p>;
  if (isError) return <p className="text-red-500">Failed to fetch results</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      {data.length > 0 ? (
        <ResultsTable data={data} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

const ResultsTable = ({ data }) => {
  return (
    <div className="overflow-auto max-h-[500px] border rounded-lg">
      <table className="min-w-full border border-gray-300 shadow-md">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="border px-4 py-2">Branch</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Supplier</th>
            <th className="border px-4 py-2">Article</th>
            <th className="border px-4 py-2">Net Amount</th>
            <th className="border px-4 py-2">NetSlsCostvalue</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((branch) =>
            branch.departments.map((dept) =>
              dept.suppliers.map((supplier) =>
                supplier.articles.map((article, index) => (
                  <tr
                    key={`${branch._id}-${dept.department}-${supplier.supplier}-${article.article}`}
                    className="border-b"
                  >
                    <td className="border px-4 py-2">
                      {index === 0 ? branch._id : ""}
                    </td>
                    <td className="border px-4 py-2">
                      {index === 0 ? dept.department : ""}
                    </td>
                    <td className="border px-4 py-2">
                      {index === 0 ? supplier.supplier : ""}
                    </td>
                    <td className="border px-4 py-2">{article.article}</td>
                    <td className="border px-4 py-2">{article.NetAmount}</td>
                    <td className="border px-4 py-2">
                      {article.NetSlsCostValue}
                    </td>
                    <td className="border px-4 py-2">{article.NetSlsQty}</td>
                  </tr>
                ))
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
