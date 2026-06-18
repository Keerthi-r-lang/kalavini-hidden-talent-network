// src/App.jsx
//
// This is the root component. Its only job right now is to set up
// React Router with a route for every page in the project plan.
// Most routes point at placeholder pages for now — each page gets
// built out fully in its own module, and we just swap the import
// here without touching the routing structure.
//
// We are NOT adding Navbar/Footer/AuthContext/ProtectedRoute yet —
// those belong to later modules (Components, Context). Keeping
// this file minimal now means later modules can wrap these routes
// without us having to redo this file.

import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
