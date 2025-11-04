// frontend/src/components/LedgerList.jsx
import React, { useMemo, useState } from "react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const LedgerList = ({ ledgers, fetchLedgers, selectLedger }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredLedgers = useMemo(() => {
    return ledgers.filter((l) => {
      const matchesSearch = l.ledger_name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter ? l.ledger_type === filter : true;
      return matchesSearch && matchesFilter;
    });
  }, [ledgers, search, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ledger?")) return;
    try {
      await api.delete(`/ledgers/${id}`);
      toast.success("Ledger deleted");
      fetchLedgers();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl w-full max-w-5xl mx-auto border border-gray-100">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">📋 Ledger List</h2>
        <span className="text-sm text-gray-500">Total: {filteredLedgers.length}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="🔍 Search ledger..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-400 outline-none" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none">
          <option value="">All Types</option>
          <option value="Assets">Assets</option>
          <option value="Liabilities">Liabilities</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Ledger Name</th>
              <th className="p-2 border">Ledger Type</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedgers.length > 0 ? (
              filteredLedgers.map((ledger) => (
                <tr key={ledger.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="border p-2 text-center">{ledger.id}</td>
                  <td className="border p-2 font-medium text-gray-700">{ledger.ledger_name}</td>
                  <td className={`border p-2 font-semibold ${ledger.ledger_type === "Expense" ? "text-red-500" : ledger.ledger_type === "Income" ? "text-green-600" : "text-blue-600"}`}>{ledger.ledger_type}</td>
                  <td className="border p-2 text-gray-600">{ledger.description || "—"}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => selectLedger(ledger)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg mr-2">Edit</button>
                    <button onClick={() => handleDelete(ledger.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500 italic">No ledgers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerList;
