<<<<<<< HEAD
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/users" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
=======
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const healthRes = await fetch("/api/health");
        const healthData = await healthRes.json();
        setMessage(healthData.message);

        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Fetch failed:", error);
        setMessage("Failed to connect to API");
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      <h1>React + API + Database</h1>
      <p>{message}</p>

      <h2>Users from database</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </main>
>>>>>>> a27d471288da41a1c783a30707e8ff1f68fbf2f3
  );
}

export default App;