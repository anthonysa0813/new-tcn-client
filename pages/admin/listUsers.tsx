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
  useEffect(() => {
    console.log({ privateToken: privateToken });
    EmployeeApi.get(`/employees?offset=${offsetNumber}&limit=10`, {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      setGetAllUsers(res.data.users);
      setGetUserNotApply(res.data.usersNotApply);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Lista de usuarios</title>
      </Head>
      <LayoutDashboard>
        <div className={styles.navbar}>
          <h1>{titleState}</h1>
          <Dropdown>
            <Dropdown.Button flat>Filtros de búsqueda</Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="unapply">
                <span
                  onClick={() => {
                    setFirstData(true);
                    setTitleState("Lista de Todos los usuarios");
                  }}
                >
                  Todos los usuarios
                </span>
              </Dropdown.Item>
              <Dropdown.Item key="apply">
                <span
                  onClick={() => {
                    setFirstData(false);

                    setTitleState("Lista de Usuarios que NO aplicaron ");
                  }}
                >
                  No aplicaron
                </span>
              </Dropdown.Item>
              {/* <Dropdown.Item key="country">país</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="">
          <div className="wrapper">
            {firstData ? (
              <TableList data={getAllUsers} offsetSliceValue={0} total={5} />
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
