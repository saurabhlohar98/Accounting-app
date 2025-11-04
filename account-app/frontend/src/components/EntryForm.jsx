// frontend/src/components/EntryForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const EntryForm = ({ refresh }) => {
  const [transaction, setTransaction] = useState({
    transaction_date: "",
    remarks: "",
    ledger_id: "",
    type: "",
    amount: "",
  });
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchLedgers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ledgers");
      const data = res.data || [];
      data.sort((a, b) => b.id - a.id);
      setLedgers(data);
    } catch (err) {
      console.error("Ledger fetch error:", err);
      toast.error("Failed to load ledgers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleChange = (field, value) => setTransaction({ ...transaction, [field]: value });

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    if (!transaction.transaction_date) { toast.error("Please select a date."); return false; }
    if (new Date(transaction.transaction_date) > new Date()) { toast.error("Transaction date cannot be in the future."); return false; }
    if (!transaction.ledger_id) { toast.error("Please select a ledger."); return false; }
    if (!transaction.type) { toast.error("Please select Debit or Credit."); return false; }
    if (!transaction.amount || Number(transaction.amount) <= 0) { toast.error("Please enter a valid amount."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        transaction_date: transaction.transaction_date,
        remarks: transaction.remarks,
        details: [
          {
            ledger_id: transaction.ledger_id,
            debit: transaction.type === "Debit" ? Number(transaction.amount) : 0,
            credit: transaction.type === "Credit" ? Number(transaction.amount) : 0,
          },
        ],
      };

      const res = await api.post("/transactions", payload);
      toast.success(`Entry saved! Ref: ${res.data.reference_no}`);
      setTransaction({ transaction_date: "", remarks: "", ledger_id: "", type: "", amount: "" });
      refresh();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const selectedLedger = ledgers.find((l) => String(l.id) === String(transaction.ledger_id)) || {};

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-4">➕ Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" value={transaction.transaction_date} onChange={(e) => handleChange("transaction_date", e.target.value)} max={today} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <input type="text" value={transaction.remarks} onChange={(e) => handleChange("remarks", e.target.value)} placeholder="Enter transaction remarks" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Ledger</label>
          <select value={transaction.ledger_id} onChange={(e) => handleChange("ledger_id", e.target.value)} className="border p-2 rounded w-full" required>
            <option value="">Select Ledger</option>
            {loading ? <option disabled>Loading...</option> : ledgers.map((l) => <option key={l.id} value={l.id}>#{l.id} - {l.ledger_name}</option>)}
          </select>

          {transaction.ledger_id && (
            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
              <div><strong>Type:</strong> {selectedLedger.ledger_type || "—"}</div>
              <div className="text-gray-400"><strong>Desc:</strong> {selectedLedger.description || "—"}</div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Transaction Type</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="type" value="Debit" checked={transaction.type === "Debit"} onChange={(e) => handleChange("type", e.target.value)} /> <span>Debit</span></label>
            <label className="flex items-center gap-2"><input type="radio" name="type" value="Credit" checked={transaction.type === "Credit"} onChange={(e) => handleChange("type", e.target.value)} /> <span>Credit</span></label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input type="number" value={transaction.amount} onChange={(e) => handleChange("amount", e.target.value)} placeholder="Enter amount" min="0" step="0.01" className="border p-2 rounded w-full text-right" />
        </div>

        <button type="submit" disabled={saving} className={`px-6 py-2 rounded text-white font-semibold ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
          {saving ? "Saving..." : "💾 Save Transaction"}
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
