"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { EmployeeJobApi } from "../../apis/employeeJob";
import { EmployeeApi } from "../../apis/employee";
import { ToastContainer, toast } from "react-toastify";
import { TokenContext } from "../../context/CurrentToken";

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



export default function DropDownMui({ statusUser, idUser, idService, idJob = "" }: Prop) {
  const menuItems = [
    { key: "DESCARTADO", name: "DESCARTADO" },
    { key: "SELECCIONADO", name: "SELECCIONADO" },
    { key: "CONTRATADO", name: "CONTRATADO" },
  ];
  const [stateStatus, setStateStatus] = React.useState("");
  const [currentJobInfo, setCurrentJobInfo] = React.useState<IResponseApplication>(
    {} as IResponseApplication
  );
  const { privateToken } = React.useContext(TokenContext);
  const notifySuccess = () =>
    toast.success("Se ha enviado el mensaje al usuario...");

  React.useEffect(() => {
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

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <>
      <ToastContainer />
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Seleccionar</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={stateStatus || ""}
            label="Age"
            onChange={handleChange}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.key}
                value={item.key}
                onClick={() => changeStatus(item.key)}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
}

