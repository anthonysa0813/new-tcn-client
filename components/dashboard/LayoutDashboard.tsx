import React from "react";
import { ChildProp } from "../../interfaces";
import styles from "../../styles/admin/Layout.module.css";
import AsideDash from "./AsideDash";
import MainDashboard from "./MainDashboard";
import { useEffect } from "react";
import { useRouter } from "next/router";


const LayoutDashboard = ({ children }: ChildProp) => {


  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/admin/login");
    }
  }, []);


  return (
    <div className={`${styles.mainGrid}`}>
      <AsideDash />
      <MainDashboard>{children}</MainDashboard>
    </div>
  );
};

export default LayoutDashboard;

