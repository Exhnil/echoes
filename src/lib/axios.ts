import axios from "axios";

console.log(import.meta.env.MODE);
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : import.meta.env.API_URL,
});
