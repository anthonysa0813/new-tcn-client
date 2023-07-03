import axios from "axios";

export const EmployeeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
});
