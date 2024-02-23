import React, { useContext, useEffect } from "react";
import Navbar from "../../../components/menu/Navbar";
import Image from "next/image";
import styles from "../../../styles/employees/AccountActive.module.css";
import { useRouter } from "next/router";
import { activateUser } from "../../../apis/employee/useEmployeeFetch";
import Cookies from "js-cookie";
import Link from "next/link";
import { EmployeeApi } from "../../../apis/employee";
import { TokenContext } from "../../../context/CurrentToken";
import { ToastContainer, toast } from "react-toastify";


const ActivateAccountPage = () => {
  const { query } = useRouter();
  const { id = "", token = "" } = query;
  const { privateToken, setPrivateToken } = useContext(TokenContext);

  useEffect(() => {
    if (id && token) {
      activateUser("/employees/activate", id, token)
        .then((res) => {
	   const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);
          Cookies.set("status", "true", {
            expires: expirationDate,
          });
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const idJob = Cookies.get("idJob");


    if (idJob) {
      applyJobIfExistId(idJob);
    }
   
  }, [id]);


  const applyJobIfExistId = async (idJob: string) => {

    await EmployeeApi.post("/employees/status-job", {
      idEmployee: id,
      idService: idJob,
      status: "",
     });
    fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/employees/${id}/${idJob}`,
      {
        method: "POST",
        headers: {
          Authorization: privateToken.token,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log({data});
        if (data.message) {
          const notifyError = () => toast.error(data.message);
          notifyError();
        } else {
          const notify = () => toast.success("haz aplicado a este puesto");
          notify();
        }
      })
      .catch((err) => console.error(err));
    };




  return (
    <>
      <ToastContainer />
      <Navbar />
      <main>
        <div className={styles.logoSection}>
          <Image
            src="/images/undraw_celebrating.svg"
            alt="draw animado celebrando"
            width={500}
            height={500}
          />
        </div>
        <div className={styles.text}>
          <h1>¡Bienvenido, tu cuenta está activa!</h1>
        </div>
        <div className="text-center mt-5">
          <Link
            href="/employee/edit"
            className="mt-5 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 transition ease"
          >
            Ver mi Perfil
          </Link>
        </div>
      </main>
    </>
  );
};

export default ActivateAccountPage;

