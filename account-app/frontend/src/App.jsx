// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Ledgers from "./pages/Ledgers";
import Entries from "./pages/Entries";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">Accounting App</Link>
            <nav className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link to="/ledgers" className="text-gray-600 hover:text-gray-900">Ledgers</Link>
              <Link to="/entries" className="text-gray-600 hover:text-gray-900">Entries</Link>
              <Link to="/reports" className="text-gray-600 hover:text-gray-900">Reports</Link>
            </nav>
          </div>
        </header>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ledgers" element={<Ledgers />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
