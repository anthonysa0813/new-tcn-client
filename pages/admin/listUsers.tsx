import React, { useState, useEffect, useContext } from "react";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import { Button, Dropdown } from "@nextui-org/react";
import styles from "../../styles/admin/ListUsers.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "@nextui-org/react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { TokenContext } from "../../context/CurrentToken";
import { getAllUsers } from "../../apis/auth/fetchFunctions";
import { EmployeeApi } from "../../apis/employee";
import { EmployeeInterface } from "../../interfaces";
import TableListStaticData from "../../components/dashboard/clients/TableListStaticData";
import TableList from "../../components/dashboard/clients/TableList";

const Head = dynamic(() => import("next/head").then((res) => res.default));

const ListUsersPage = () => {
  const { privateToken } = useContext(TokenContext);
  const [getAllUsers, setGetAllUsers] = useState([]);
  const [getUserNotApply, setGetUserNotApply] = useState<
    EmployeeInterface[] | []
  >([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [offsetNumber, setOffsetNumber] = useState(0);
  const [titleState, setTitleState] = useState("Lista de Todos los usuarios");
  const [firstData, setFirstData] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    EmployeeApi.get("/employees", {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      setTotalEmployees(res.data.users.length);
    });
  }, []);

  useEffect(() => {
    EmployeeApi.get(`/employees?offset=${10 * pageNumber}&limit=10`, {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      setGetAllUsers(res.data.users);
      setGetUserNotApply(res.data.usersNotApply);
    });
  }, [pageNumber]);

  return (
    <>
      <Head>
        <title>Contact Americas Admin | Lista de usuarios</title>
      </Head>
      <LayoutDashboard>
        <div className={styles.navbar}>
          <h1 className="text-4xl">{titleState}</h1>
          <p className="text-2xl font-semibold">
            Número total de usuarios registrados:{" "}
            <span className="text-blue-500">{totalEmployees}</span>{" "}
          </p>
        </div>
        <div className="">
          <div className="wrapper">
            {firstData ? (
              <TableList
                data={getAllUsers}
                offsetSliceValue={0}
                total={5}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            ) : (
              <TableList
                data={getUserNotApply}
                offsetSliceValue={0}
                total={5}
              />
            )}
          </div>
        </div>
      </LayoutDashboard>
    </>
  );
};

export default ListUsersPage;

