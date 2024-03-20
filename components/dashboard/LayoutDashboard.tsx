import React, { useContext } from "react";
import { ChildProp } from "../../interfaces";
import styles from "../../styles/admin/Layout.module.css";
import AsideDash from "./AsideDash";
import MainDashboard from "./MainDashboard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { TokenContext } from "../../context/CurrentToken";
import { API_URL } from "../../utils/constanstApi";


const LayoutDashboard = ({ children }: ChildProp) => {
  const { privateToken } = useContext(TokenContext);


  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/admin/login");
    }
    fetch(`${API_URL}/auth`, {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // clear cookies and localstorage
          localStorage.clear();
          

          router.push("/admin/login");
        }
        return res.json();
      })
      .then((auth) => {
        // setAuthDataList(auth);
      })
      .catch((err) => {
        console.log({
          error: err,
        });
      });

  }, []);


  return (
    <div className={`${styles.mainGrid}`}>
      <AsideDash />
      <MainDashboard>{children}</MainDashboard>
    </div>
  );
};

export default LayoutDashboard;

