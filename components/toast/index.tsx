import { toast } from "react-toastify";

export const notifyWarning = (message: string) => toast.warning(message);
export const notifyWarningCharacter = (message: string) =>
  toast.warning(message);
export const notifySuccess = (message: string) => toast.success(message);
export const notifyError = (message: string) => toast.error(message);
