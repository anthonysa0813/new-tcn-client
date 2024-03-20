import React, { Dispatch, SetStateAction } from "react";
import styles from "../../../styles/client/LoginPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendEmailToNewPassword, sendEmailToNewPasswordByDni } from '../../../apis/employee/useEmployeeFetch';
import { toast, ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
interface Prop {
  setShowForgetPasswordForm: Dispatch<SetStateAction<boolean>>;
  setShowLoginForm: Dispatch<SetStateAction<boolean>>;
  setShowForgetByEmail: Dispatch<SetStateAction<boolean>>;
  setShowForgetByDni: Dispatch<SetStateAction<boolean>>;
}

const ArrowBackIosNewIcon = dynamic(() =>
  import("@mui/icons-material/ArrowBackIosNew").then((res) => res.default)
);

const Button = dynamic(() =>
  import("@mui/material/Button").then((res) => res.default)
);

const TextField = dynamic(() =>
  import("@mui/material/TextField").then((res) => res.default)
);

const ForgetAccountByDni = ({
  setShowForgetPasswordForm,
  setShowLoginForm,
  setShowForgetByEmail,
  setShowForgetByDni

}: Prop) => {
  const toastAlertNotExistEmail = () => toast.error("El email no existe");
  const toastAlertSuccess = () =>
    toast.success("hemos enviado un mensaje a tu correo...");
  const { handleSubmit, errors, touched, getFieldProps } = useFormik({
    initialValues: {
      dni: "",
    },
    onSubmit: (values) => {
      sendEmailToNewPasswordByDni("employees/forget-password/dni", {
        dni: values.dni
      }).then(
        (res) => {
          console.log("res", res, values);
          // localStorage.setItem("email", values.email);
          if (res.message === "Hubo un error") {
            toastAlertNotExistEmail();
          } else {
            toastAlertSuccess();
          }
        }
      );

    },
    validationSchema: Yup.object({
      dni: Yup.string().required("Requerido"),
    }),
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div
        className={styles.menu}
        onClick={() => {
          setShowLoginForm(false);
          setShowForgetPasswordForm(false);
          setShowForgetByEmail(true);
          setShowForgetByDni(false);
        }}
      >
        <span>
          <ArrowBackIosNewIcon />
          atrás
        </span>
      </div>
      <h4>Restauración de contraseña por DNI</h4>
      <p>Escribe tu dni y te enviaremos al correo asociado los siguientes pasos:</p>
      <ToastContainer />
      <div className={styles.field}>
        <TextField
          id="outlined-basic"
          label="DNI:"
          variant="outlined"
          size="small"
          {...getFieldProps("dni")}
        />
        {errors.dni && touched.dni && (
          <span className="text-red-500 ">{errors.dni} </span>
        )}
      </div>

      <div className={styles.field}>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          className=" hover:text-white bg-blue-500 text-white"
        >
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default ForgetAccountByDni;

