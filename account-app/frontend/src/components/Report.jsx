// frontend/src/components/Report.jsx
import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const Report = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/ledgers");
        const data = await res.json();
        if (Array.isArray(data)) {
          data.sort((a, b) => b.id - a.id);
          setLedgers(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ledgers");
      }
    };
    fetchLedgers();
  }, []);

  const validateDates = () => {
    if (!fromDate || !toDate) { toast.error("Select both From and To"); return false; }
    if (new Date(fromDate) > new Date(toDate)) { toast.error("'From' cannot be after 'To'"); return false; }
    const today = new Date().toISOString().split("T")[0];
    if (new Date(fromDate) > new Date(today) || new Date(toDate) > new Date(today)) { toast.error("Future dates not allowed"); return false; }
    return true;
  };

  const handleGenerateReport = async () => {
    if (!validateDates()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/reports?fromDate=${fromDate}&toDate=${toDate}&ledgerId=${selectedLedger || "all"}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast.error("No data found for selected range");
        setReportData([]);
      } else {
        setReportData(data);
        toast.success("Report generated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportData.length) return toast.error("No data to print");
    const printContents = reportRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Report</title>
      <style>body{font-family: Arial; margin:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #999;padding:8px;text-align:right;} th:first-child, td:first-child{text-align:left;} th:nth-child(2), td:nth-child(2){text-align:left;}</style>
      </head><body>
      <h2>Ledger Report (${fromDate} to ${toDate})</h2>
      ${printContents}
      </body></html>`);
    win.document.close();
    win.print();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">📊 Ledger Report</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} max={today} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} max={today} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label>Ledger</label>
          <select value={selectedLedger} onChange={(e) => setSelectedLedger(e.target.value)} className="border p-2 rounded w-full">
            <option value="">All Ledgers</option>
            {ledgers.map((l) => <option key={l.id} value={l.id}>#{l.id} - {l.ledger_name}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button onClick={handleGenerateReport} disabled={loading} className={`px-4 py-2 rounded text-white font-semibold ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>{loading ? "Loading..." : "Generate"}</button>
          {reportData.length > 0 && <button onClick={handlePrint} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">🖨 Print</button>}
        </div>
      </div>

      <div ref={reportRef}>
        {reportData.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Ledger</th>
                <th className="p-2 border text-left">Type</th>
                <th className="p-2 border text-right">Total Debit</th>
                <th className="p-2 border text-right">Total Credit</th>
                <th className="p-2 border text-right">Net (D - C)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2 text-left">{row.ledger}</td>
                  <td className="border p-2 text-left text-gray-600 italic">{row.ledger_type}</td>
                  <td className="border p-2 text-right">₹{(row.totalDebit || 0).toFixed(2)}</td>
                  <td className="border p-2 text-right">₹{(row.totalCredit || 0).toFixed(2)}</td>
                  <td className={`border p-2 text-right font-semibold ${row.closing < 0 ? "text-red-600" : "text-green-600"}`}>₹{(row.closing || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 p-6 italic">No report data available.</div>
        )}
      </div>
    </div>
  );
};

export default Report;
