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
  statusUser: string;
  idUser: string;
  idService?: string;
  idJob?: string;
}

interface IResponseApplication {
  _id?: string;
  employee: string;
  service: string;
  status: string;

  __v?: number;
}

const DropDownSelect = ({
  statusUser,
  idUser,
  idService,
  idJob = "",
}: Prop) => {
  const menuItems = [
    { key: "DESCARTADO", name: "DESCARTADO" },
    { key: "SELECCIONADO", name: "SELECCIONADO" },
    { key: "CONTRATADO", name: "CONTRATADO" },
  ];
  const [stateStatus, setStateStatus] = useState("");
  const [currentJobInfo, setCurrentJobInfo] = useState<IResponseApplication>(
    {} as IResponseApplication
  );
  const { privateToken } = useContext(TokenContext);
  const notifySuccess = () =>
    toast.success("Se ha enviado el mensaje al usuario...");

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
    console.log({ value });
    setCurrentJobInfo(value[0]);
    setStateStatus(value[0]?.status || "");
  };

  const changeStatus = async (value: string) => {
    console.log(value);
    console.log({ idJob, idUser });
    setStateStatus(value);
    const response = await EmployeeApi.put(
      `/employees/status-unique-job/${idJob}/${idUser}`,
      {
        status: value,
      }
    );
    if (value.trim() === "SELECCIONADO") {
      const sendEmailSelect = await EmployeeJobApi.post(`/employeeJob/select`, {
        user: idUser,
        idService: idService,
      });
      notifySuccess();
    } else if (value === "DESCARTADO") {
      const sendEmaildiscarded = await EmployeeJobApi.post(
        `/employeeJob/discarded`,
        {
          user: idUser,
          idService: idService,
        }
      );
      notifySuccess();
    } else if (value === "CONTRATADO") {
      const sendEmailHired = await EmployeeJobApi.post(`/employeeJob/hired`, {
        user: idUser,
        idService: idService,
      });
      notifySuccess();
    }
  };

  return (
    <>
      <ToastContainer />

      <Dropdown>
        <Dropdown.Button flat className="border border-blue-500">{stateStatus}</Dropdown.Button>
        <Dropdown.Menu aria-label="Dynamic Actions" items={menuItems}>
          {menuItems.map((item) => {
            return (
              <Dropdown.Item
                key={item.key}
		className="border"
                color={item.key === "delete" ? "error" : "default"}
              >
                <span onClick={() => changeStatus(item.name)}>{item.name}</span>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default DropDownSelect;
