import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../components/menu/Navbar";

const ConfirmPageJob = () => {
  const queries = useRouter();

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <h1 style={{ marginBlock: "100px" }}>¡Gracias por responder!</h1>
      </div>
    </>
  );
};

export default ConfirmPageJob;
