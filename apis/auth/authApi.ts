import axios from "axios";

export const AuthAdminApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DB_URL}/auth`,
});
