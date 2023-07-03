import { toast } from "react-toastify";

export const toastWarning = (message: string) => toast.warning(message);
export const toastError = (message: string) => toast.error(message);
export const toastSuccess = (message: string) => toast.success(message);
