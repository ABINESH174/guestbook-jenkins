import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const API_URL = '/api/entries';


  const fetchEntries = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    // Ensure data is an array before setting state
    setEntries(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch failed:", err);
    setEntries([]); // Fallback to empty array to prevent .map crash
  }
};

  useEffect(() => { fetchEntries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    setMessage("");
    fetchEntries();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Guestbook (Distributed Build by Devops)</h1>
      <form onSubmit={handleSubmit}>
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Leave a message..." 
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
