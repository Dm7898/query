import axios from "axios";

export const api = axios.create({
  baseURL: "https://query-pzf4.onrender.com",
  headers: { "Content-Type": "application/json" },
});
