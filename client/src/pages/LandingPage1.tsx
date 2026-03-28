import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

function LoginModal({ role, onClose, onSuccess }) {
  const [username, setUsername] = useState(role === "admin" ? "admin" : "employee");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/oauth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) onSuccess();
  };

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default function LandingPage() {
  const { user, loading, refresh } = useAuth();
  const [, navigate] = useLocation();
  const [showLogin, setShowLogin] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === "admin" ? "/admin" : "/employee/checkin");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return (
    <div>
      {showLogin && (
        <LoginModal
          role={showLogin}
          onClose={() => setShowLogin(null)}
          onSuccess={() => {
            refresh();
            setShowLogin(null);
          }}
        />
      )}

      <button onClick={() => setShowLogin("admin")}>Admin</button>
      <button onClick={() => setShowLogin("employee")}>Employee</button>
    </div>
  );
}
