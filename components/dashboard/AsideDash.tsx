import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/admin/AsideDashboard.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { UserResponse } from "../../interfaces";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Image = dynamic(() => import("next/image").then((res) => res.default));

const Groups2Icon = dynamic(() =>
  import("@mui/icons-material/Groups2").then((res) => res.default)
);

const FilePlusIcon = dynamic(() =>
  import("@mui/icons-material/Difference").then((res) => res.default)
);

const KeyIcon = dynamic(() =>
  import("@mui/icons-material/VpnKey").then((res) => res.default)
);

const JobIcon = dynamic(() =>
  import("@mui/icons-material/Work").then((res) => res.default)
);

const RoleIcon = dynamic(() =>
  import("@mui/icons-material/SupervisedUserCircle").then((res) => res.default)
);

const NewUserIcon = dynamic(() =>
  import("@mui/icons-material/PersonAddAlt").then((res) => res.default)
);

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

const MenuIcon = dynamic(() =>
  import("@mui/icons-material/Menu").then((res) => res.default)
);

const LogoutIcon = dynamic(() =>
  import("@mui/icons-material/Logout").then((res) => res.default)
);

//import Tooltip from '@mui/material/Tooltip';
const Tooltip = dynamic(() =>
  import("@mui/material/Tooltip").then((res) => res.default)
);

const IconButton = dynamic(() =>
  import("@mui/material/IconButton").then((res) => res.default)
);

const AsideDash = () => {
  const { userGlobal, setUserGlobal } = useContext(UserContext);
  const router = useRouter();
  const arrAsPath = router.asPath.split("/");
  const [showMenu, setShowMenu] = useState(false);

  // useEffect(() => {
  //   if (window.localStorage) {
  //     const auth: UserResponse = JSON.parse(localStorage.getItem("auth") || "");
  //     setUserGlobal(auth);
  //   }
  // }, []);

  const pathActive = (path: string) => {
    const pathName = arrAsPath[arrAsPath.length - 1];
    if (pathName === path) {
      return true;
    } else {
      return false;
    }
  };

  const outSession = () => {
    Cookies.remove("token");
    sessionStorage.clear();
    sessionStorage.removeItem("auth");
    router.push("/admin");
  };

  return (
    <>
      <aside className={styles.aside}>
        <div
          className={styles.boxIcon}
          onClick={() => {
            setShowMenu((state) => !state);
          }}
        >
          {showMenu ? (
            <>
              <Image
                src="/images/logos/LogoContact.png"
                alt="Logo de Contact bpo"
                width={150}
                height={70}
                onClick={() => router.push("/")}
              />
              <CloseIcon className={styles.svgMenu} />
            </>
          ) : (
            <MenuIcon className={styles.svgMenu} />
          )}
        </div>

        <div className={styles.asideContainer}>
          <nav
            className={`${styles.menu}  animate__animated  border ${
              showMenu ? "animate__fadeInLeft" : ""
            }`}
          >
            {/* <Tooltip
              title="Ver lista de colaboradores (no empleadores)"
              arrow
              placement="right"
            >
              <Link
                href="/admin/employees"
                className={pathActive("employees") ? styles.activeLink : ""}
              >
                <FileIcon />

                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Lista de Colaboradores (no empleadores)
                </span>
              </Link>
            </Tooltip> */}
            <Tooltip title="Crear Nuevo Puesto" arrow placement="right">
              <Link
                href="/admin/newService"
                className={pathActive("newService") ? styles.activeLink : ""}
              >
                <FilePlusIcon />

                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Crear nuevo Puesto
                </span>
              </Link>
            </Tooltip>
            <Tooltip title="lista de usuarios" arrow placement="right">
              <Link
                href="/admin/listUsers"
                className={pathActive("listUsers") ? styles.activeLink : ""}
              >
                <Groups2Icon />

                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Lista de usuarios
                </span>
              </Link>
            </Tooltip>
            <Tooltip
              title="Puestos Disponibles"
              arrow
              placement="right"
              color="dark"
            >
              <Link
                href="/admin/listServices"
                className={pathActive("listServices") ? styles.activeLink : ""}
              >
                <JobIcon />
                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Puestos Disponibles
                </span>
              </Link>
            </Tooltip>
            <Tooltip
              title="Historial de Puestos desactivados"
              arrow
              placement="right"
              color="dark"
            >
              <Link
                href="/admin/historial"
                className={pathActive("historial") ? styles.activeLink : ""}
              >
                <MenuBookIcon />
                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Historial de Puestos
                </span>
              </Link>
            </Tooltip>
            {userGlobal.superAdmin && (
              <>
                <Tooltip
                  title="Cambiar role a un usuario"
                  arrow
                  placement="right"
                >
                  <Link
                    href="/admin/changeRole"
                    className={
                      pathActive("changeRole") ? styles.activeLink : ""
                    }
                  >
                    <RoleIcon />
                    <span
                      className={`${
                        showMenu ? styles.textBlock : styles.textNone
                      }`}
                    >
                      Cambiar role a un usuario
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip arrow title="Crear un nuevo usuario" placement="right">
                  <Link
                    href="/admin/createNewUser"
                    className={
                      pathActive("createNewUser") ? styles.activeLink : ""
                    }
                  >
                    <NewUserIcon />
                    <span
                      className={`${
                        showMenu ? styles.textBlock : styles.textNone
                      }`}
                    >
                      Crear un nuevo usuario
                    </span>
                  </Link>
                </Tooltip>
              </>
            )}
            <Tooltip title="Cambiar contraseña" arrow placement="right">
              <Link
                href="/admin/changePassword"
                className={
                  pathActive("changePassword") ? styles.activeLink : ""
                }
              >
                <KeyIcon />

                <span
                  className={`${showMenu ? styles.textBlock : styles.textNone}`}
                >
                  {" "}
                  Editar mi contraseña
                </span>
              </Link>
            </Tooltip>
          </nav>
          <div className={styles.profile}>
            <h4
              onClick={outSession}
              className={`${showMenu ? styles.TextBlock : styles.textNone}`}
            >
              Salir
            </h4>

            <LogoutIcon onClick={outSession} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AsideDash;
