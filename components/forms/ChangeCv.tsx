import React, { useState } from "react";
import styles from "../../styles/components/ChangeCv.module.css";

interface Prop {
  idEmployee: string;
}

const ChangeCv = ({ idEmployee }: Prop) => {
  const [valueCv, setValueCv] = useState("" as any);

  const changeValueCv = (e: any) => {
    setValueCv(e.target.files[0]);
    // console.log(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let dataform = new FormData();
    dataform.append("cv", valueCv);
    // console.log({ idEmployee });
    putCv(dataform);
  };

  const putCv = async (data: any) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/uploads/${idEmployee}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseFetch = await response.json();
    console.log(responseFetch);
  };

  return (
    <form className={styles.modal} onSubmit={handleSubmit}>
      <span className={styles.close}>X</span>
      <div className={styles.content}>
        <span className={styles.title}>Sube tu CV</span>
        <p className={styles.message}>
          El archivo a seleccionar debe de ser PDF.
        </p>

        <div className={styles.actions}>
          <label className={`${styles.button} ${styles["upload-btn"]} `}>
            Elige el archivo
            <input hidden type="file" id="file" onChange={changeValueCv} />
          </label>
        </div>
        <div className={styles.result}>
          <div className={styles["file-uploaded"]}>
            {valueCv && <p className={styles.titlePdf}>{valueCv.name}</p>}
          </div>
        </div>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
};

export default ChangeCv;
