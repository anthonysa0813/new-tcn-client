import axios from "axios";

export const ServiceApi = axios.create({
  // localhost:5050/api/services
  baseURL: `${process.env.NEXT_PUBLIC_DB_URL}/services`,
});
