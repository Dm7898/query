import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

const fetchResults = async (selectedBranches, selectedSuppliers) => {
  if (!selectedBranches.length || !selectedSuppliers.length) return [];

  const { data } = await api.get(
    `/suppliers/results?branches=${selectedBranches.join(
      ","
    )}&suppliers=${selectedSuppliers.join(",")}`
  );
  return data;
};

export const TestResultsPage = ({ selectedBranches, selectedSuppliers }) => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["results", selectedBranches, selectedSuppliers],
    queryFn: () => fetchResults(selectedBranches, selectedSuppliers),
    enabled: selectedBranches.length > 0 && selectedSuppliers.length > 0,
  });

  if (isLoading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">Error fetching results</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      {data.length > 0 ? (
        <ResultsTable data={data} />
      ) : (
        <p className="text-gray-500">No data available</p>
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
                  <tr key={article.article} className="border-b">
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
