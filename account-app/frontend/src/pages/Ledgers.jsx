// frontend/src/pages/Ledgers.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import LedgerForm from "../components/LedgerForm";
import LedgerList from "../components/LedgerList";

const Ledgers = () => {
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);

  const fetchLedgers = async () => {
    try {
      const res = await api.get("/ledgers");
      setLedgers(res.data || []);
    } catch (error) {
      console.error("Error fetching ledgers:", error);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const clearSelection = () => setSelectedLedger(null);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <LedgerForm selectedLedger={selectedLedger} fetchLedgers={fetchLedgers} clearSelection={clearSelection} />
      <LedgerList ledgers={ledgers} fetchLedgers={fetchLedgers} selectLedger={setSelectedLedger} />
    </div>
  );
};

export default Ledgers;
