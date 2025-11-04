// frontend/src/components/EntryList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

const EntryList = ({ refresh }) => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const res = await api.get("/transactions");
      setEntries(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load entries");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchEntries();
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📋 Transactions</h2>

      {entries.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Reference</th>
              <th className="p-2">Remarks</th>
              <th className="p-2">Details</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2">{entry.transaction_date}</td>
                <td className="p-2">{entry.reference_no}</td>
                <td className="p-2">{entry.remarks}</td>
                <td className="p-2">
                  {entry.details.map((d) => (
                    <div key={d.id}>
                      #{d.ledger?.id} - {d.ledger?.ledger_name}:{" "}
                      <strong>{d.debit > 0 ? `Dr ${d.debit}` : `Cr ${d.credit}`}</strong>
                    </div>
                  ))}
                </td>
                <td className="p-2">
                  <button onClick={() => handleDelete(entry.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EntryList;
