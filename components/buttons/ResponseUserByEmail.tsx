import { GetServerSideProps } from "next";
import React, { useState, useEffect, useContext } from "react";
import { Dropdown } from "@nextui-org/react";
import { chenageStatusJobFetch } from "../../apis/employee/useEmployeeFetch";
import { ServiceApi } from "../../apis/services";
import { EmployeeApi } from "../../apis/employee/employeeApi";
import { API_URL } from "../../utils/constanstApi";
import { TokenContext } from "../../context/CurrentToken";
import { EmployeeJobApi } from "../../apis/employeeJob";
import { toast, ToastContainer } from "react-toastify";

interface Prop {
  idUser: string;
  idService?: string;
  statusUser?: string;
}

interface IResponseApplication {
  _id?: string;
  employee: string;
  service: string;
  status: string;
  confirm?: string;
  __v?: number;
}

const ResponseUserByEmail = ({
  idUser,
  idService,
  statusUser
}: Prop) => {
  
  const [stateStatus, setStateStatus] = useState("");
  const [currentJobInfo, setCurrentJobInfo] = useState<IResponseApplication>(
    {} as IResponseApplication
  );
  const { privateToken } = useContext(TokenContext);
  const [confirmState, setConfirmState] = useState("");

  useEffect(() => {
    getJobApplication(`/employees/get-applications-jobs/${idUser}`);
  }, [statusUser]);

  const getJobApplication = async (url: string) => {
    const { data } = await EmployeeApi.get<IResponseApplication[] | []>(url, {
      headers: {
        Authorization: privateToken.token,
      },
    });

    const value = data.filter((v) => v.service === idService);
    	
    setConfirmState(value[0]?.confirm || "");
    setStateStatus(value[0]?.status || "");
  };

  return (
    <>	 
	{
        	<span className={`${confirmState === "Sí desea continuar" && "text-green-500"} ${confirmState === "No desea continuar" && "text-red-500"}` }>{confirmState}</span> 
        }
	
    </>
  );
};

export default ResponseUserByEmail;
