import React, { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../../components/menu/Navbar";
import { Router, useRouter } from "next/router";
const Head = dynamic(() => import("next/head").then((res) => res.default));
import styles from "../../../styles/jobs/JobByIdStyles.module.css";
import { ServiceApi } from "../../../apis/services";
import { ServiceI } from "../../../interfaces";
import { GetServerSideProps } from "next";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../../context/EmployeeContext";
import { ToastContainer, toast } from "react-toastify";
import { EmployeeApi } from "../../../apis/employee";
import { TokenContext } from "../../../context/CurrentToken";
import { Button, Grid } from "@nextui-org/react";

interface Prop {
  id: string;
}

const PageByJob = ({ id }: Prop) => {
  const { query, back, push } = useRouter();
  const [jobState, setJobState] = useState({} as ServiceI);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const { privateToken, setPrivateToken } = useContext(TokenContext);

  useEffect(() => {
    // console.log(query.id);
    if (id) {
      console.log(query.id);
      ServiceApi.get(`${id}`).then((res) => {
        console.log(res);
        setJobState(res.data);
      });
    }
  }, [id]);

  const applicationJob = async (idJob: string = "") => {
    if (!employeeGlobal.id) {
      const notify = () => toast.error("Necesitas de una cuenta registrada");
      notify();
      setTimeout(() => {
        push("/user/register");
      }, 700);
      return;
    }
    const employeeId = employeeGlobal.id;
    await EmployeeApi.post("/employees/status-job", {
      idEmployee: employeeGlobal.id,
      idService: idJob,
      status: "",
    });

    fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/employees/${employeeId}/${idJob}`,
      {
        method: "POST",
        headers: {
          Authorization: privateToken.token,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
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
      <Head>
        <title>Contact BPO | Puestos Disponibles</title>
        <meta
          name="description"
          content="Puestos de trabajo disponibles con relación a Contact BPO."
        />
      </Head>
      <Navbar />
      <ToastContainer />

      <section className={styles.hero}>
        <div className={styles.wrapper}>
          <div className={styles.infoGrid}>
            <div className={styles.infoHero}>
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    onClick={() => back()}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
                <span>Volver</span>
              </div>
              <h1>{jobState.title}</h1>
              <div className="infoJornada">
                <span>Remoto</span>
                <span>Tipo de trabajo: Jornada Completa</span>
              </div>
            </div>
            <button
              className={styles.buttonApply}
              onClick={() => applicationJob(jobState._id)}
            >
              Postular
            </button>
          </div>
        </div>
      </section>
      <main className="wrapper">
        <div className={styles.details}>
          <h2>Detalles:</h2>
          <div className={styles.infoContainer}>
            <p dangerouslySetInnerHTML={{ __html: jobState.description }}></p>
          </div>
          <h2>Requerimientos:</h2>
          <div className={styles.infoContainer}>
            <p dangerouslySetInnerHTML={{ __html: jobState.requirements }}></p>
          </div>
        </div>
        <div className="characters">
          <Grid.Container gap={2}>
            <Grid>
              <Button bordered color="primary" auto>
                <span className={styles.textSm}>{jobState.salary}</span>
              </Button>
            </Grid>
            <Grid>
              <Button bordered color="primary" auto>
                <span className={styles.textSm}>{jobState.schedule}</span>
              </Button>
            </Grid>
            <Grid>
              <Button bordered color="primary" auto>
                <span className={styles.textSm}>{jobState.type}</span>
              </Button>
            </Grid>
            <Grid>
              <Button bordered color="primary" auto>
                <span className={styles.textSm}>{jobState.typeJob}</span>
              </Button>
            </Grid>
          </Grid.Container>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params as { id: string };
  console.log({ id });

  return {
    props: {
      id,
    },
  };
};

export default PageByJob;
