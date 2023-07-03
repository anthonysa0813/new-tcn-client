import React from "react";
import LayoutEmployee from "./layoutEmployee";
import styles from "../../styles/employees/PaymentsPage.module.css";
import PaymentsCard from "../../components/employees/PaymentsCard";

const PaymentsPage = () => {
  return (
    <LayoutEmployee name="Historial de Pagos">
      <h3>Historial de Pagos</h3>
      <div className={styles.paymentsContainer}>
        <PaymentsCard />
        <PaymentsCard />
        <PaymentsCard />
        <PaymentsCard />
        <PaymentsCard />
        <PaymentsCard />
      </div>
    </LayoutEmployee>
  );
};

export default PaymentsPage;
