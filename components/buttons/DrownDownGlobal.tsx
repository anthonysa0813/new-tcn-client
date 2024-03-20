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
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTypeSelect: React.Dispatch<React.SetStateAction<string>>;
}
interface IResponseApplication {
  _id?: string;
  employee: string;
  service: string;
  status: string;

  __v?: number;
}

export const DropDownSelectGlobal = ({setVisible, setTypeSelect}: Prop) => {
  const menuItems = [
    { key: "email", name: "Por Email" },
    { key: "distrito", name: "Por Distrito" },
    // { key: "pais", name: "Por Pais" },
  ];
  const [stateStatus, setStateStatus] = useState("Buscar por:");
  const [currentJobInfo, setCurrentJobInfo] = useState<IResponseApplication>(
    {} as IResponseApplication
  );



  return (
    <>
      <ToastContainer />

      <Dropdown>
        <Dropdown.Button flat className="border border-blue-500">
          {stateStatus}
        </Dropdown.Button>
        <Dropdown.Menu aria-label="Dynamic Actions" items={menuItems}>
          {menuItems.map((item) => {
            return (
              <Dropdown.Item
                key={item.key}
                className="border"
                color={item.key === "delete" ? "error" : "default"}
              >
                <span onClick={() => {
                  setStateStatus(item.name);
                  setVisible(true);
                  setTypeSelect(item.key);
                }}>{item.name}</span>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};




