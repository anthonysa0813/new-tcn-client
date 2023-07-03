import { EmployeeApi } from "../apis/employee";

interface IResponseApplication {
  _id?: string;
  employee: string;
  service: string;
  status: string;
  __v?: number;
}

export const getJobApplication = async (
  idEmployee: string,
  idService: string
) => {
  const { data } = await EmployeeApi.get<IResponseApplication[] | []>(
    `/employees/get-applications-jobs/${idEmployee}`
  );
  const value = data.find((v) => v.service === idService);
  return value?.status || "";
};
