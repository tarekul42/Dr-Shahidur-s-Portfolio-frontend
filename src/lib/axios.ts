import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
  timeout: 45000, // 45s – accounts for Render.com free-tier cold-start (can take 30-60s)
  headers: { "Content-Type": "application/json" },
});

// No auth interceptors needed — public frontend has no login
