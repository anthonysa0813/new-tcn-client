import React, { useContext } from "react";
import Navbar from "../../components/menu/Navbar";
import styles from "../../styles/employees/Layout.module.css";
import dynamic from "next/dynamic";
import { EmployeeContext } from "../../context/EmployeeContext";

interface Prop {
  children: JSX.Element[] | JSX.Element;
  name?: string;
}

const AsideMenuEmployee = dynamic(() =>
  import("../../components/menu/asideMenuEmployee").then((res) => res.default)
);

const LayoutEmployee = ({ children }: Prop) => {
  const {
    employeeGlobal: { name },
  } = useContext(EmployeeContext);

  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <main>
        <div className={styles.profileGrid}>
          {Boolean(name) && <AsideMenuEmployee />}
          {/* <AsideMenuEmployee /> */}
          <div className={`${styles.mainProfile}`}>{children}</div>
        </div>
      </main>
    </div>
  );
};

export default LayoutEmployee;
