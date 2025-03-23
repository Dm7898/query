import axios from "axios";

export const api = axios.create({
  baseURL: "https://query-pzf4.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
