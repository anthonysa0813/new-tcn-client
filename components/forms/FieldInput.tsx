import React from "react";
import styles from "../../styles/employees/Edit.module.css";

const FieldInput = () => {
  return (
    <div className={styles.inputSection}>
      <input type="text" className={styles.input} />
    </div>
  );
};

export default FieldInput;
