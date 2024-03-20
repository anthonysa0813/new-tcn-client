import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
// import AsideDash from "../../components/dashboard/AsideDash";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
// import MainDashboard from "../../components/dashboard/MainDashboard";
import { UserContext } from "../../context/UserContext";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; 
import WorkIcon from "@mui/icons-material/Work";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { EmployeeApi } from "../../apis/employee";
import { TokenContext } from "../../context/CurrentToken";
import { EmployeeTotalResponse } from "../../interfaces/employee";
import { API_URL } from "../../utils/constanstApi";
import { ServiceI, UserResponse } from "../../interfaces";
import Link from "next/link";

// import styles from "../../styles/admin/Dashboard.module.css";

const HomeAdmin = () => {
  const token = Cookies.get("token");
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const router = useRouter();
  const { privateToken } = useContext(TokenContext);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [servicesDataList, setServicesDataList] = useState<ServiceI[] | []>([])
  const [authDataList, setAuthDataList] = useState<UserResponse[] | []>([]);



  useEffect(() => {
      // console.log({ privateToken });
      
      EmployeeApi.get("/employees", {
        headers: {
          Authorization: `${privateToken.token}`,
        },
      }).then((res) => {
        setTotalEmployees(res.data.users.length);
      });

      fetch(`${API_URL}/services`)
        .then((res) => {
          return res.json();
        })
        .then((serv) => {
          const servciesActives = serv.services.filter(
            (service: ServiceI) => service.status
          );
          setServicesDataList(servciesActives);
        });
      // console.log({ privateToken })
      fetch(`${API_URL}/auth`, {
        headers: {
          Authorization: `${privateToken.token}`,
        },
      })
        .then((res) => {
          
          return res.json();
        })
        .then((auth) => {
          setAuthDataList(auth);
        }).catch((err) => {
          console.log({
            error: err
          })
         });
    }, []);

  return (
    <LayoutDashboard>
      <div className="">
        <div className="md:h-[400px]  h-[100px] ">
          <Image
            src="https://res.cloudinary.com/da0d2neas/image/upload/v1710728989/heroadmin.png"
            alt="hero"
            height={300}
            width={1200}
            className="object-cover w-full h-full rounded-xl"
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Link href="/admin/newService" className="px-3 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-700 transition ease">
            <AddIcon /> Nuevo Puesto
          </Link>
          <Link href="/admin/createNewUser" className="px-3 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-700 transition ease">
            <AddIcon /> Nuevo Usuario
          </Link>
          <Link href="/admin/listServices" className="px-3 py-2 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-700 transition ease">
            <RemoveRedEyeIcon /> Puestos Activos
          </Link>
        </div>
      </div>
      <div className=" mt-10 w-full flex items-center justify-center md:px-40">
        <div className=" gap-2 w-full grid grid-cols-6">
          <Link href="/admin/listUsers" className="md:col-span-2 col-span-full  p-3 rounded-lg flex gap-4 bg-slate-100">
            <div className="">
              <PersonIcon className="text-6xl text-blue-600" />
            </div>
            <div className="">
              <span className="text-3xl font-bold text-blue-600 block">
                {totalEmployees}
              </span>
              <span className="md:text-2xl text-1xl md:font-bold font-semibold"> Usuarios Registrados</span>
            </div>
          </Link>
          <Link href="/admin/listServices" className="md:col-span-2 col-span-full p-3 rounded-lg flex gap-4 bg-slate-100">
            <div className="">
              <WorkIcon className="text-6xl text-blue-600" />
            </div>
            <div className="">
              <span className="text-3xl font-bold text-blue-600 block">
                {servicesDataList.length}
              </span>
              <span className="md:text-2xl text-1xl md:font-bold font-semibold">Puestos activos</span>
            </div>
          </Link>
          <Link href="/admin/changeRole" className="md:col-span-2 col-span-full p-3 rounded-lg flex gap-4 bg-slate-100">
            <div className="">
              <ManageAccountsIcon className="text-6xl text-blue-600" />
            </div>
            <div className="">
              <span className="text-3xl font-bold text-blue-600 block">{ authDataList.length }</span>
              <span className="md:text-2xl text-1xl md:font-bold font-semibold"> Usuarios administrativos activos</span>
            </div>
          </Link>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default HomeAdmin;

