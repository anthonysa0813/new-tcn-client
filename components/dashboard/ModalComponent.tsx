import React from "react";
import { ChildProp } from "../../interfaces/index";
import styles from "../../styles/admin/ModalComponent.module.css";

const ModalComponent = ({ children, center }: ChildProp) => {
  return (
    <div
      className={`${styles.modalContainer} ${center ? styles.centerModal : ""}`}
    >
      {children}
    </div>
  );
};

export default ModalComponent;
