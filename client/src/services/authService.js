// src/services/authService.js
//
// Thin wrapper around the auth endpoints on our backend. AuthContext
// calls these functions instead of using axios directly - this
// keeps all knowledge of API routes/shapes in one place. If the
// backend route or response shape ever changes, we only update it
// here, not in every component that needs auth.

import api from "./api";

// POST /api/auth/register
// Returns { message, token, user } on success.
// Throws (via axios) on validation errors (400) or duplicate
// email (409) - the caller is responsible for catching these.
export const registerUser = async ({ name, email, password, department, year, bio }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    department,
    year,
    bio,
  });
  return response.data;
};

// POST /api/auth/login
// Returns { message, token, user } on success.
// Throws on invalid credentials (401).
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// GET /api/auth/profile
// Requires a valid token (the axios interceptor in api.js attaches
// it automatically). Returns { user }.
export const fetchProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// PUT /api/auth/profile
// Sends only the fields that are provided; backend handles partial
// updates. Returns { message, user }.
export const updateProfile = async (updates) => {
  const response = await api.put("/auth/profile", updates);
  return response.data;
};
