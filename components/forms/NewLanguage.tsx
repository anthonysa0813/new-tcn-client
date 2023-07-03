import React from "react";
// import { GiPublicSpeaker } from "react-icons/gi";
// import {
//   BsFillFileEarmarkTextFill,
//   BsFillArrowUpRightCircleFill,
// } from "react-icons/bs";
import styles from "../../styles/employees/Edit.module.css";

const NewLanguage = () => {
  return (
    <div className={styles.field}>
      <div className="info">
        <div className={styles.titleHead}>
          {/* <GiPublicSpeaker
            style={{
              marginInline: ".5rem",
              width: "20px",
              height: "20px",
            }}
          /> */}
          <p>Idioma: </p>
        </div>
        <span className={styles.subText}>Ejmplo: {"Inglés - intermedio"}.</span>
        <div className={styles.titleHeadSecondary}>
          {/* <BsFillArrowUpRightCircleFill /> */}
          <p>Nivel: </p>
        </div>
      </div>
      <div className={styles.inputSection}>
        <input type="text" className={styles.input} />
        <select id="">
          <option value="">Seleccione</option>
          <option value="basico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
    </div>
  );
};

export default NewLanguage;
