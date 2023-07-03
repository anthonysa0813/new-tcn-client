import React, { useState, ChangeEvent, useContext } from "react";
import styles from "../../styles/employees/ModalLogin.module.css";
// import { CloseIcon } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { loginFetchApi } from "../../helpers/useFetch";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import { useRouter } from "next/router";
import { Loading } from "@nextui-org/react";
import Link from "next/link";
import InputWithIcon from "../buttons/InputWithIcon";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import dynamic from "next/dynamic";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  setshowModalLogin: (state: boolean) => void;
}

const notify = () => toast.success("Bienvenido!");
const notifyWarning = () => toast.warning("email y password son requeridos");

const ModalLogin = ({ setshowModalLogin }: Prop) => {
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { email, password } = form;
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const [showPass, setShowPass] = useState(false);

  const closeModal = () => {
    setshowModalLogin(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Todos los campos son obligatorios");
      notifyWarning();
      return;
    }
    setShowLoading(true);

    loginFetchApi("auth/employee/login", form).then((res) => {
      if (res.message) {
        const notifyErrorMessage = () => toast.error(res.message);
        notifyErrorMessage();
        setShowLoading(false);
      }
      if (res.employee) {
        localStorage.setItem("employee", JSON.stringify(res.employee));
        sessionStorage.setItem("token", res.token);
        Cookies.set("token", res.token, { expires: 7 });
        setEmployeeGlobal(res.employee);
        notify();
        setShowLoading(false);
        setTimeout(() => {
          setshowModalLogin(false);
          router.push("/employee/edit");
        }, 1000);
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.mainModal}>
        <div className={styles.modalContainer}>
          <h3>Inicia Sesión</h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <CloseIcon onClick={closeModal} className={styles.iconClose} />
            <div className={styles.field}>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.field} `}>
              <label>Password: </label>
              {/* <InputWithIcon
                type={showPass ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
              >
                {showPass ? (
                  <AiFillEyeInvisible
                    onClick={() => setShowPass((state) => !state)}
                  />
                ) : (
                  <AiFillEye onClick={() => setShowPass((state) => !state)} />
                )}
              </InputWithIcon> */}
            </div>

            <button className={styles.button}>Iniciar Sesión</button>
            <div className={`${styles.field} text-center`}>
              <Link href={"/forgetPassword"}>Olvidé mi contraseña</Link>
            </div>
            <div className={`${styles.field} text-center`}>
              <Link href={"/admin"}>¿Eres admin?</Link>
            </div>
            {showLoading && <Loading />}
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalLogin;
