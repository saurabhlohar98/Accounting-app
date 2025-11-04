// frontend/src/components/LedgerForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const LedgerForm = ({ selectedLedger, fetchLedgers, clearSelection }) => {
  const [ledgerName, setLedgerName] = useState("");
  const [ledgerType, setLedgerType] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedLedger) {
      setLedgerName(selectedLedger.ledger_name);
      setLedgerType(selectedLedger.ledger_type);
      setDescription(selectedLedger.description || "");
    } else {
      setLedgerName("");
      setLedgerType("");
      setDescription("");
    }
  }, [selectedLedger]);

  const validateForm = () => {
    if (!ledgerName.trim() || ledgerName.length < 3) {
      toast.error("Ledger name must be at least 3 characters long.");
      return false;
    }
    if (!ledgerType) {
      toast.error("Please select a ledger type.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    const data = { ledger_name: ledgerName.trim(), ledger_type: ledgerType, description: description.trim() };
    try {
      if (selectedLedger) {
        await api.put(`/ledgers/${selectedLedger.id}`, data);
        toast.success("Ledger updated");
      } else {
        await api.post("/ledgers", data);
        toast.success("Ledger added");
      }
      fetchLedgers();
      clearSelection();
      setLedgerName("");
      setLedgerType("");
      setDescription("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl w-full max-w-lg mx-auto mb-6 border border-gray-100">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
        {selectedLedger ? "✏️ Edit Ledger" : "➕ Add New Ledger"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">Ledger Name</label>
          <input type="text" placeholder="Enter Ledger Name" value={ledgerName} onChange={(e) => setLedgerName(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">Ledger Type</label>
          <select value={ledgerType} onChange={(e) => setLedgerType(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" required>
            <option value="">Select Ledger Type</option>
            <option value="Assets">Assets</option>
            <option value="Liabilities">Liabilities</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button type="submit" disabled={saving} className={`px-5 py-2 rounded-lg text-white font-semibold shadow ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
            {saving ? "Saving..." : selectedLedger ? "Update" : "Save"}
          </button>
          {selectedLedger && <button type="button" onClick={clearSelection} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default LedgerForm;
