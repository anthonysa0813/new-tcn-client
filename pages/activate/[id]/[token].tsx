import React, { useEffect } from "react";
import Navbar from "../../../components/menu/Navbar";
import Image from "next/image";
import styles from "../../../styles/employees/AccountActive.module.css";
import { useRouter } from "next/router";
import { activateUser } from "../../../apis/employee/useEmployeeFetch";

const ActivateAccountPage = () => {
  const { query } = useRouter();
  const { id = "", token = "" } = query;

  useEffect(() => {
    if (id && token) {
      activateUser("/employees/activate", id, token)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <main>
        <div className={styles.logoSection}>
          <Image
            src="/images/undraw_celebrating.svg"
            alt="draw animado celebrando"
            width={500}
            height={500}
          />
        </div>
        <div className={styles.text}>
          <h1>¡Bienvenido, tu cuenta está activa!</h1>
        </div>
      </main>
    </>
  );
};

export default ActivateAccountPage;
