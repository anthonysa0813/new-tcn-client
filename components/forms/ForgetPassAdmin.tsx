import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/admin/form/ForgetPassAdmin.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthAdminApi } from "../../apis/auth";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../toast";
import ModalCredentialsAuth from "../modals/sendCredentialsModalAuth";

const FormControl = dynamic(() =>
  import("@mui/material/FormControl").then((res) => res.default)
);
const TextField = dynamic(() =>
  import("@mui/material/TextField").then((res) => res.default)
);
const Button = dynamic(() =>
  import("@mui/material/Button").then((res) => res.default)
);
const ArrowBackIosNewIcon = dynamic(() =>
  import("@mui/icons-material/ArrowBackIosNew").then((res) => res.default)
);

interface Prop {
  setShowForgetPass: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgetPassAdmin = ({ setShowForgetPass }: Prop) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(!showModal);
  };

  const { errors, touched, getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      console.log(values);
      // setShowLoading(true);
      AuthAdminApi.post(`/recover-account/${values.email}`)
        .then((response) => {
          if (response.status === 200) {
            notifySuccess(response.data.message);
            closeModal();
          }
        })
        .catch((error) => {
          notifyError("El usuario no Existe");
        });
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Debe de ser un email").required("Requerido"),
    }),
  });

  return (
    <>
      {showModal && <ModalCredentialsAuth closeModal={closeModal} />}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <ToastContainer />
        <div
          className={styles.fieldBack}
          onClick={() => setShowForgetPass(false)}
        >
          <ArrowBackIosNewIcon /> <span>Regresar</span>
        </div>
        <h2>Recuperación de cuenta</h2>
        <h3>Escribe el correo:</h3>
        <div className={styles.field}>
          <FormControl sx={{ width: "100%" }} size="small" variant="outlined">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
              sx={{ width: "100%" }}
              {...getFieldProps("email")}
            />
            {errors.email && touched.email && (
              <span className="text-danger ">{errors.email} </span>
            )}
          </FormControl>
        </div>
        <div className={styles.field}>
          <Button
            color="primary"
            sx={{ width: "100%" }}
            variant="contained"
            type="submit"
          >
            Enviar
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgetPassAdmin;
