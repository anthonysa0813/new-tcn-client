import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/admin/form/ForgetPassAdmin.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthAdminApi } from "../../apis/auth";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../toast";
import ModalCredentialsAuth from "../modals/sendCredentialsModalAuth";
import { EmployeeApi } from "../../apis/employee";
import ModalSendNewTokenToActiveEmployee from "../modals/SendNewTokenActiveEmployee";
import { BeatLoader } from "react-spinners";

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
  setShowLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowActivateAccount: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActivateAccountEmployee = ({
  setShowLoginForm,
  setShowActivateAccount,
}: Prop) => {
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
      setLoading(true);
      EmployeeApi.post(`/employees/activate-employee/${values.email}`)
        .then((response) => {
          if (response.status === 200) {
            notifySuccess(response.data.message);
            closeModal();
            setLoading(false)
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
      {showModal && (
        <ModalSendNewTokenToActiveEmployee closeModal={closeModal} />
      )}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <ToastContainer />
        <div
          className={`${styles.fieldBack} dark:text-white text-sm`}
          onClick={() => {
            setShowLoginForm(true);
            setShowActivateAccount(false);
          }}
        >
          <ArrowBackIosNewIcon /> <span>Regresar</span>
        </div>
        <h2>Activar Cuenta</h2>
        <h3>Escribe tu correo:</h3>
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
            className="bg-blue-500 text-white"
          >
            Enviar
          </Button>
          {loading && <BeatLoader color="#0072f5" />}

        </div>
      </form>
    </>
  );
};

export default ActivateAccountEmployee;

