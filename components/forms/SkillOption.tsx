import React from "react";
import styles from "../../styles/employees/Edit.module.css";

interface Prop {
  name: string;
}

const SkillOption = ({ name }: Prop) => {
  return (
    <div className={styles.experienceContainer}>
      <span>{name}</span>
      <div className={styles.selection}>
        <select name="" id="">
          <option value="0">Seleccione</option>
          <option value="1">1 año de experiencia</option>
          <option value="2">2 año de experiencia</option>
          <option value="3">3 año de experiencia</option>
          <option value="4">4 año de experiencia</option>
          <option value="5">5 año de experiencia</option>
        </select>
      </div>
    </div>
  );
};

export default SkillOption;
