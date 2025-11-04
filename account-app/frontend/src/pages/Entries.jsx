// frontend/src/pages/Entries.jsx
import React, { useState } from "react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";

const Entries = () => {
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-6 p-6">
      <EntryForm refresh={handleRefresh} />
      <EntryList refresh={refresh} />
    </div>
  );
};

export default Entries;
