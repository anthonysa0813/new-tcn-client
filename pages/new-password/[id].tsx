import React, { useEffect, useState } from "react";
import ButtonPrimary from "../../components/buttons/Button";
import Navbar from "../../components/menu/Navbar";
import useForm from "../../hooks/useForm";
import styles from "../../styles/employees/ForgetPassword.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../../apis/employee/useEmployeeFetch";
import { useRouter } from "next/router";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const NewPasswordPage = () => {
  const { query } = useRouter();
  const token = query.id || "";

  const fieldsEmptys = () => toast.error("Todos los campos son obligatorios");
  const passwordNotEquals = () => toast.error("Las contraseñas no son iguales");
  const messageSuccess = () =>
    toast.success("Se ha modificado su contraseña ✌");
  const moreCharacters = () =>
    toast.warning("La contraseña debería de tener más o igual a 6 caracteres");
  const [currentEmail, setCurrentEmail] = useState("");

  useEffect(() => {
    const emailUser = localStorage.getItem("email");
    setCurrentEmail(emailUser || "");
  }, []);

  const { handleSubmit, errors, touched, getFieldProps } = useFormik({
    initialValues: {
      password: "",
      repeatPassword: "",
    },
    onSubmit: (values) => {
      console.log(values);
      resetPassword("employees/new-password", {
        email: currentEmail,
        password: values.password,
        token,
      }).then((res) => {
        console.log(res);
        messageSuccess();
      });
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Requerido"),
      repeatPassword: Yup.string()
        .required("Requerido")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no son iguales"),
    }),
  });

  return (
    <>
      <Navbar />
      <ToastContainer />
      <section className={styles.container}>
        <h4>Recuperar Contraseña</h4>
        <span>Te enviaremos un mensaje de confirmación a tu correo: </span>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              size="small"
              {...getFieldProps("password")}
            />
            {errors.password && touched.password && (
              <span className="text-danger ">{errors.password} </span>
            )}
          </div>
          <div className={styles.field}>
            <TextField
              id="outlined-basic"
              label="Repetir Password"
              variant="outlined"
              size="small"
              {...getFieldProps("repeatPassword")}
            />
            {errors.repeatPassword && touched.repeatPassword && (
              <span className="text-danger ">{errors.repeatPassword} </span>
            )}
            {/* <input
              type="password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={onChange}
            /> */}
          </div>
          <div className="field">
            <Button variant="contained" type="submit">
              Actualizar
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewPasswordPage;
