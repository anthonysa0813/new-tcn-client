import React from "react";
import ModalComponent from "../dashboard/ModalComponent";
import styles from "../../styles/employees/RegisterModalDone.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  closeModal: () => void;
}

const ModalCredentialsAuth = ({ closeModal }: Prop) => {
  return (
    <ModalComponent center>
      <div className={styles.container}>
        <div className={styles.boxClose}>
          <CloseIcon onClick={closeModal} className={styles.svg} />
        </div>
        <div className={styles.logoSection}>
          <Image
            src="/images/undrawForgetPassAuth.svg"
            alt="draw de recuperación de clave"
            width={400}
            height={400}
          />
        </div>
        <div className={styles.infoText}>
          <h1>Recuperación de clave como administrador.</h1>
          <span className={styles.messageText}>
            Te hemos enviado un email para tu ingreso a la plataforma de
            Contact. Por favor revisa la carpeta de spam en caso no lo
            encuentres ó comunicarte con soporte.
          </span>
        </div>
      </div>
    </ModalComponent>
  );
};

export default ModalCredentialsAuth;
