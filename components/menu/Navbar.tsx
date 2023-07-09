import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import styles from "../../styles/client/Navbar.module.css";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";

import {
  CurrentLangContext,
  CurrentLangContextType,
} from "../../context/CurrentLang";
import MenuItemCustom from "./cardMetun";
import { EmployeeInterface } from "../../interfaces";

const PersonIcon = dynamic(() =>
  import("@mui/icons-material/Person").then((res) => res.default)
);

const LogoutIcon = dynamic(() =>
  import("@mui/icons-material/Logout").then((res) => res.default)
);

const Link = dynamic(() => import("next/link").then((res) => res.default));

interface Prop {
  data?: any;
}

const Navbar = () => {
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const { currentLangState, setCurrenLangState } =
    useContext<CurrentLangContextType>(CurrentLangContext);
  const { name, surnames } = employeeGlobal;
  const router = useRouter();
  const logout = () => {
    setEmployeeGlobal({} as EmployeeInterface);
    // localStorage.removeItem("countries");
    // localStorage.removeItem("employee");
    // localStorage.removeItem("email");
    Cookies.remove("token");
    Cookies.remove("employee");

    router.push("/");
  };

  // useEffect(() => {
  //   const resEmployeeLocalStorage =
  //     window.localStorage.getItem("employee") || "";
  //   if (Boolean(resEmployeeLocalStorage)) {
  //     const localStoraEmployee = JSON.parse(
  //       window.localStorage.getItem("employee") || ""
  //     );
  //     setEmployeeGlobal(localStoraEmployee);
  //   }
  // }, []);

  return (
    <>
      <header className={styles.header}>
        <div className="wrapper">
          <div className={styles.headerContainer}>
            <div className={styles.logoContainer}>
              <Image
                src={"/images/logos/LogoContact.png"}
                alt="Logo de Contact BPO"
                width={150}
                height={90}
                onClick={() => router.push("/")}
              />
            </div>
            <nav className={styles.menu}>
              {name && (
                <MenuItemCustom
                  name={name}
                  surnames={surnames}
                  logout={logout}
                />
              )}
              {!name && (
                <>
                  <Link href="/login" className={styles.btn}>
                    <span>Iniciar sesión</span>
                  </Link>
                </>
              )}
              {!name && (
                <>
                  <Link href="/user/register" className={styles.btn}>
                    <span>Regístrate</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   console.log("ctx", ctx);
//   // const response = await import(`../../lang/${locale}.json`);
//   // console.log(response);

//   return {
//     props: {
//       data: "",
//     },
//   };
// };

export default Navbar;
