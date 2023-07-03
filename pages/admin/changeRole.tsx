import React, { useState, useEffect, useContext } from "react";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import useForm from "../../hooks/useForm";
import styles from "../../styles/admin/ChangeRole.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllUsers,
  searchUserAuth,
  updateUserAuth,
} from "../../apis/auth/fetchFunctions";
import { UserResponse } from "../../interfaces";
import { Loading } from "@nextui-org/react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { TokenContext } from "../../context/CurrentToken";

const Head = dynamic(() => import("next/head").then((res) => res.default));

const ChangeRole = () => {
  const { email, onChange } = useForm({ email: "" });
  const toastWarning = (message: string) => toast.warning(message);
  const toastError = (message: string) => toast.error(message);
  const toastSuccess = (message: string) => toast.success(message);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserResponse>({} as UserResponse);
  const [usersData, setUsersData] = useState<UserResponse[] | []>([]);
  const token = Cookies.get("token") || "";
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showUniqueUser, setShowUniqueUser] = useState(false);
  const [userUniqueInfo, setUserUniqueInfo] = useState({} as UserResponse);
  const { privateToken } = useContext(TokenContext);

  const SearchForm = dynamic(() =>
    import("../../components/dashboard/forms/SearchUserForm").then(
      (res) => res.default
    )
  );
  const UniqueUser = dynamic(() =>
    import("../../components/dashboard/tables/UniqueUser").then(
      (res) => res.default
    )
  );

  useEffect(() => {
    getAllUsers("auth", privateToken.token).then((res) => {
      setUsersData(res);
    });
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ([email].includes("")) {
      toastWarning("El campo está vácio...");
      return;
    }
    setLoading(true);
    setShowUniqueUser(true);

    setShowAllUsers(false);
    searchUserAuth(`auth/search/${email}`).then((res) => {
      if (res.message) {
        toastError(res.message);
        setLoading(false);
        setShowUniqueUser(false);
        setUser(res.user);
        setUserUniqueInfo(res.user);
      } else {
        setUser(res.user);
        setLoading(false);
        setUserUniqueInfo(res.user);
        setShowUniqueUser(true);
      }
    });
  };

  const activeUser = (user: UserResponse) => {
    updateUserAuth("auth", { ...user, role: "ADMIN_ROLE" }, token).then(
      (res) => {
        setUser(res.user);
        toastSuccess(
          `el usuario ${user.email} ha sido actualizado como administrador`
        );
      }
    );
  };

  const desactiveUser = (user: UserResponse) => {
    updateUserAuth("auth", { ...user, role: "USER_ROLE" }, token).then(
      (res) => {
        setUser(res.user);
        toastSuccess(
          `el usuario ${user.email} ha sido actualizado como USER_ROLE`
        );
      }
    );
  };

  const changeStatusFunction = (user: UserResponse) => {
    if (user.role === "ADMIN_ROLE") {
      desactiveUser(user);
      getAllUsers("auth", privateToken.token).then((res) => {
        setUsersData(res);
      });
    } else {
      activeUser(user);
      getAllUsers("auth", privateToken.token).then((res) => {
        setUsersData(res);
      });
    }
  };

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Cambia de role a un usuario admin</title>
      </Head>
      <LayoutDashboard>
        <div className={styles.mainGrid}>
          <h1>Busca y activa una cuenta como administrador</h1>
          <ToastContainer />

          <SearchForm onSubmit={onSubmit} email={email} onChange={onChange} />
          <div className="actionWatchAllUsers">
            <button
              className={styles.watchAllUsersButton}
              onClick={() => {
                setShowAllUsers((state) => !state);
                setShowUniqueUser(false);
              }}
            >
              {showAllUsers ? "ocultar lista" : "Ver todos los usuarios"}
            </button>
          </div>
          {loading && <Loading />}
          {showUniqueUser && (
            <UniqueUser
              userUniqueInfo={userUniqueInfo}
              changeStatusFunction={changeStatusFunction}
            />
          )}
          {showAllUsers &&
            usersData.map((user) => {
              return (
                <UniqueUser
                  key={user.id}
                  userUniqueInfo={user}
                  changeStatusFunction={changeStatusFunction}
                />
              );
            })}
        </div>
      </LayoutDashboard>
    </>
  );
};

export default ChangeRole;
