import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Formatter from "./components/Formatter";

function App() {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (session) localStorage.setItem("session", JSON.stringify(session));
    else localStorage.removeItem("session");
  }, [session]);

  if (!session) return <Login onLogin={setSession} />;

  return <Formatter session={session} onLogout={() => setSession(null)} />;
}

export default App;
