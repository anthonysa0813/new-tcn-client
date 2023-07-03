import React, { useEffect, useState } from "react";
import { getUniqueExperience } from "../../apis/experience/useFecthExperience";
import styles from "../../styles/employees/ShowServiceById.module.css";
import { Experience } from "../../interfaces/index";
import dynamic from "next/dynamic";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  idService: string;
  idEmployee?: string;
  setShowService: React.Dispatch<React.SetStateAction<boolean>>;
  exp?: Experience;
}

const ShowServiceById = ({
  idService = "",
  idEmployee = "",
  setShowService,
  exp
}: Prop) => {
  const [experence, setExperence] = useState<Experience>(exp as Experience);

 

  return (
    <section className={styles.showServiceGrid}>
      <div className={styles.boxClose}>
        <CloseIcon
          onClick={() => setShowService(false)}
          className={styles.svg}
        />
      </div>
      <div className={styles.infoHead}>
        <h1>
          {experence.title} - {experence.nameBussiness}
        </h1>
        <div className={styles.field}>
          <p style={{ display: "flex", gap: "1rem" }}>
            <strong>Fecha de Inicio: </strong>
            <p>{experence.dateStart}</p>
          </p>
        </div>
        <div className={styles.field}>
          <p style={{ display: "flex", gap: "1rem" }}>
            <strong>Fecha de Finalización: </strong>
            <p>{experence.dateEnd}</p>
          </p>
        </div>
        <div className={styles.field}>
          <p>ACTIVIDAD DE LA EMPRESA:</p>
          <span>{experence.activytyBussiness}</span>
        </div>
        <div className={styles.field}>
          <p>ÁREA:</p>
          <span>{experence.area}</span>
        </div>

        <div className={styles.field}>
          <p>SUBÁREA:</p>
          <span>{experence.subarea}</span>
        </div>
        <div className={styles.field}>
          <p>PAÍS:</p>
          <span>{experence.country}</span>
        </div>
        <div className={styles.field}>
          <p>NIVEL:</p>
          <span>{experence.level}</span>
        </div>
        <div className={styles.field}>
          <p>¿Trabaja actualmente aquí?:</p>
          <span> {experence.currentJob ? "Sí" : "No"}</span>
        </div>
        <div className={styles.field}>
          <p>Descripción:</p>
          <span>{experence.description}</span>
        </div>
        {experence.nameRef && (
          <div className={styles.fieldRef}>
            <div className={styles.fieldHeadRef}>
              <p>Datos del referente</p>
            </div>
            <div className={styles.field}>
              <p>Nombre Completos:</p>
              <span>{experence.nameRef}</span>
            </div>{" "}
            <div className={styles.field}>
              <p>Email:</p>
              <span>{experence.emailRef}</span>
            </div>{" "}
            <div className={styles.field}>
              <p>País:</p>
              <span>{experence.countryRef}</span>
            </div>{" "}
            <div className={styles.field}>
              <p>Número telefónico:</p>
              <span>{experence.phoneRef}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowServiceById;
