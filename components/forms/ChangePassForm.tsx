import dynamic from "next/dynamic";
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { resetPassword } from "../../apis/employee/useEmployeeFetch";
import { EmployeeContext } from "../../context/EmployeeContext";
import useForm from "../../hooks/useForm";
import styles from "../../styles/employees/ChangePassword.module.css";
import ButtonPrimary from "../buttons/Button";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
  notifyWarningCharacter,
} from "../toast";

const ChangePassForm = () => {
  const { password, onChange } = useForm({
    password: "",
  });
  const { employeeGlobal } = useContext(EmployeeContext);
  const [tokenValue, setTokenValue] = useState("");

  useEffect(() => {
    if (typeof window.sessionStorage !== "undefined") {
      const token = sessionStorage.getItem("token");
      setTokenValue(token || "");
    }
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([password].includes("")) {
      notifyWarning("Necesitas escribir una nueva contraseña");
      return;
    }
    if (password.length < 6) {
      notifyWarningCharacter("debe de ser mayor o igual a 6 caracteres");
      return;
    }
    resetPassword("employees/new-password", {
      email: employeeGlobal.email,
      token: tokenValue,
      password: password,
    })
      .then((res) => {
        console.log(res);
        if ((res.message = "La contraseña ha sido modificado")) {
          notifySuccess("Se ha modificado su contraseña");
        }
      })
      .catch((err) => {
        notifyError("Hubo un errror");
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.section}>
        <div className={styles.keyContainer}>
          <label>Nueva Contraseña: </label>
          <ToastContainer />
          <div className={styles.inputSection}>
            <input
              type="text"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <ButtonPrimary
        color="dark"
        content="guardar"
        onClick={() => console.log("jeje")}
        type="submit"
      />
    </form>
  );
};

export default ChangePassForm;
