import axios from "axios";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://queecom.vercel.app/api";

const api = axios.create({ baseURL: API_URL });

export default api;
