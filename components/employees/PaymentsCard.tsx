import React from "react";
import styles from "../../styles/employees/PaymentsPage.module.css";

const PaymentsCard = () => {
  return (
    <div className={styles.paymentCard}>
      <div className={styles.info}>
        <p>Mes: 10/10/22</p>
        <p>
          Estado: <span className={styles.activeText}>activo</span>{" "}
        </p>
      </div>
      <div className={styles.voucher}>
        <a
          href="https://res.cloudinary.com/dzgbz8lvg/image/upload/v1665593089/RHE10705026977E0014_mrhia1.pdf"
          download
          className={styles.buttonVoucher}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver Voucher
        </a>
      </div>
    </div>
  );
};

export default PaymentsCard;
