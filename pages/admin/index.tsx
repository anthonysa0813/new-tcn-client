import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
// import AsideDash from "../../components/dashboard/AsideDash";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
// import MainDashboard from "../../components/dashboard/MainDashboard";
import { UserContext } from "../../context/UserContext";
// import styles from "../../styles/admin/Dashboard.module.css";

const HomeAdmin = () => {
  const token = Cookies.get("token");
  const { userGlobal } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!token || Object.values(userGlobal).includes("")) {
      router.push("/admin/login");
    }
  }, [token, router, userGlobal]);

  return (
    <LayoutDashboard>
      <h1>dashboard</h1>
    </LayoutDashboard>
  );
};

export default HomeAdmin;
