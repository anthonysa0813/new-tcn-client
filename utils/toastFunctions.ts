import { toast } from "react-toastify";

const notifyWarning = (message: string) => {
  return toast.warning(message);
};

const notifyError = (message: string) => {
  return toast.error(message);
};

const notifySuccess = (message: string) => {
  return toast.success(message);
};

export default {
  notifyWarning,
  notifyError,
  notifySuccess,
};
