import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const uploadAndCheck = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/fingerprint/check", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Music Copyright Checker</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadAndCheck}>Check</button>

      {results && (
        <div>
          <h2>Result:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
