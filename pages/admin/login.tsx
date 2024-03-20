import React, { useState } from "react";

import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import styles from "../../styles/admin/Login.module.css";

import { Paper } from "@mui/material";
import ForgetPassAdmin from "../../components/forms/ForgetPassAdmin";

const LoginAdminFormComponent = dynamic(() =>
  import("../../components/forms/LoginAdminForm").then((res) => res.default)
);

const Head = dynamic(() => import("next/head").then((res) => res.default));

const LoginAdminForm = () => {
  const [showForgetPass, setShowForgetPass] = useState(false);

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Login</title>
        <meta
          name="description"
          content="Contact BPO página administrador de Contact BPO"
        />
      </Head>
      <main className={styles.main}>
        <Paper elevation={2}>
          {showForgetPass ? (
            <ForgetPassAdmin setShowForgetPass={setShowForgetPass} />
          ) : (
            <LoginAdminFormComponent setShowForgetPass={setShowForgetPass} />
          )}
        </Paper>
        <ToastContainer />
      </main>
    </>
  );
};

export default LoginAdminForm;

