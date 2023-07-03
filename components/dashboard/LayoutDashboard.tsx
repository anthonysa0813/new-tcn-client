import React from "react";
import { ChildProp } from "../../interfaces";
import styles from "../../styles/admin/Layout.module.css";
import AsideDash from "./AsideDash";
import MainDashboard from "./MainDashboard";

const LayoutDashboard = ({ children }: ChildProp) => {
  return (
    <div className={`${styles.mainGrid}`}>
      <AsideDash />
      <MainDashboard>{children}</MainDashboard>
    </div>
  );
};

export default LayoutDashboard;
