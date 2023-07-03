import React, { useState } from "react";
import { sendEmailToNewPassword } from "../apis/employee/useEmployeeFetch";
import ButtonPrimary from "../components/buttons/Button";
import Navbar from "../components/menu/Navbar";
import useForm from "../hooks/useForm";
import styles from "../styles/employees/ForgetPassword.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  // const [emailValue, setEmailValue] = useState("")
  const { email, form, onChange } = useForm({ email: "" });
  const [error, setError] = useState(false);
  const toastAlertSuccess = () =>
    toast.success("hemos enviado un mensaje a tu correo...");
  const toastAlertDanger = () => toast.success("Escribe un email");
  const toastAlertNotExistEmail = () => toast.error("El email no existe");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ([email].includes("")) {
      setError(true);
      return;
    }

    sendEmailToNewPassword("employees/forget-password", form).then((res) => {
      console.log("res", res, form);
      localStorage.setItem("email", email);
      if (res.message === "Hubo un error") {
        toastAlertNotExistEmail();
      } else {
        toastAlertSuccess();
      }
    });
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <section className={styles.container}>
        <h4>Recuperar Contraseña</h4>
        <span>Te enviaremos un mensaje de confirmación a tu correo: </span>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="">Email:</label>
            <input type="text" name="email" value={email} onChange={onChange} />
          </div>
          <div className="field">
            <ButtonPrimary color="dark" content="Enviar" type="submit" />
          </div>
        </form>
      </section>
    </>
  );
};

export default ForgetPassword;
