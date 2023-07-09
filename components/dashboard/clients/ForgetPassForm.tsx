import React, { Dispatch, SetStateAction } from "react";
import styles from "../../../styles/client/LoginPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendEmailToNewPassword } from "../../../apis/employee/useEmployeeFetch";
import { toast, ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
interface Prop {
  setShowForgetPasswordForm: Dispatch<SetStateAction<boolean>>;
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

const ForgetPassForm = ({ setShowForgetPasswordForm }: Prop) => {
  const toastAlertNotExistEmail = () => toast.error("El email no existe");
  const toastAlertSuccess = () =>
    toast.success("hemos enviado un mensaje a tu correo...");
  const { handleSubmit, errors, touched, getFieldProps } = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      sendEmailToNewPassword("employees/forget-password", values).then(
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
      email: Yup.string().email("Debe de ser un email").required("Requerido"),
    }),
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div
        className={styles.menu}
        onClick={() => setShowForgetPasswordForm((state) => !state)}
      >
        <span>
          <ArrowBackIosNewIcon />
          Volver
        </span>
      </div>
      <h4>Restauración de contraseña</h4>
      <p>Te enviaremos los siguientes pasos a tu correo</p>
      <ToastContainer />
      <div className={styles.field}>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          size="small"
          {...getFieldProps("email")}
        />
        {errors.email && touched.email && (
          <span className="text-danger ">{errors.email} </span>
        )}
      </div>

      <div className={styles.field}>
        <Button color="primary" variant="contained" type="submit">
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default ForgetPassForm;
