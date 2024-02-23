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
import { Button, Grid, Text } from "@nextui-org/react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

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
    if (id) {
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
        <title>Contact BPO | {jobState.title}</title>
        <meta
          name="description"
          content="Puestos de trabajo disponibles con relación a Contact BPO."
        />
        <meta property="og:title" content={`${jobState.title || ""}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Explora oportunidades laborales emocionantes y descubre tu próximo paso profesional en Contact BPO "
        />
        <meta property="og:url" content="https://work.contactamericas.com/" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/da0d2neas/image/upload/v1694022571/grupo-personas-trabajando-plan-negocios-oficina_1_f3megn.jpg"
        />
      </Head>
      <Navbar />
      <ToastContainer />

      <section className={styles.hero}>
        <div className={styles.wrapper}>
          <div className={styles.infoGrid}>
            <div className={styles.infoHero}>
              <Link
                className={`${styles.iconContainer} cursor-pointer`}
                href="/"
              >
                <div className={styles.icon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </div>
                <span>Volver</span>
              </Link>
              <h1>{jobState.title}</h1>
              <div className="flex items-center gap-2">
                <span>Remoto</span>
                <span>- Jornada Completa</span>
              </div>
            </div>

            <Button
              shadow
              color="primary"
              className="bg-blue-500 text-white"
              auto
              onClick={() => applicationJob(jobState._id)}
            >
              Postular
            </Button>
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
        <div className="">
          <Text size={18}>
            ¿Aún tienes dudas? Puedes preguntarnos en nuestro canal de WhatsApp.
          </Text>
          <Link
            href={
              `https://wa.me/${
                jobState.localCurrency == "PEN"
                  ? `51${jobState.whatsapp}`
                  : `1${jobState.whatsapp}`
              }?text=${encodeURIComponent(
                `¡Hola! Quiero postular al puesto ${jobState.title}`
              )}` || ""
            }
            target="_blank"
          >
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 transition ease flex items-center gap-2"
            >
              <WhatsAppIcon />
              <span className="font-semibold">WhatsApp</span>
            </button>
          </Link>
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2 rounded-lg border-blue-500 border-2 text-blue-500 font-semibold">
                <span>  {jobState.localCurrency == "PEN" ? "S/" : "$"}
                  {jobState.salary}</span>
          </div>
        <div className="p-2 rounded-lg border-blue-500 border-2 text-blue-500 font-semibold">
                <span>{jobState.schedule}</span>
          </div>
	 <div className="p-2 rounded-lg border-blue-500 border-2 text-blue-500 font-semibold">
                <span>{jobState.type}</span>
          </div>
   	  <div className="p-2 rounded-lg border-blue-500 border-2 text-blue-500 font-semibold ">
                <span>{jobState.typeJob}</span>
          </div>
            
          </div>
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

