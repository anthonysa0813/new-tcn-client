import React, { FC } from "react";
import { ChildProp } from "../../interfaces";
import styles from "../../styles/admin/MainDashboard.module.css";

const MainDashboard = ({ children }: ChildProp) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default MainDashboard;
