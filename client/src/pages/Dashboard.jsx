// src/pages/Dashboard.jsx
//
// TEMPORARY placeholder. The full dashboard (stats, recommended
// users, pending requests, quick actions) is built in Module 5.
// For now this exists so that:
//   1. Login/Register have somewhere real to redirect to
//   2. ProtectedRoute has something to actually protect, so we can
//      verify the whole auth flow (redirect-if-logged-out,
//      access-if-logged-in, logout) end to end.

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "48px 24px", maxWidth: 600, margin: "0 auto" }}>
      <h1>Welcome, {user?.name || "friend"} 👋</h1>
      <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px" }}>
        This is a temporary dashboard. The full version (stats, recommended
        users, requests, quick actions) is coming in Module 5.
      </p>
      <button className="btn btn-secondary" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default Dashboard;
