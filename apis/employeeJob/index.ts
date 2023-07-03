import axios from "axios";

export const EmployeeJobApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
});
