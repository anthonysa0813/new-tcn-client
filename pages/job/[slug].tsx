import React, { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
// import Navbar from "../../../components/menu/Navbar";
import { useRouter } from "next/router";
const Head = dynamic(() => import("next/head").then((res) => res.default));
import styles from "../../styles/jobs/JobByIdStyles.module.css";
import { ServiceApi } from "../../apis/services";
import { ServiceI } from "../../interfaces";
import { GetServerSideProps } from "next";

import { ToastContainer, toast } from "react-toastify";
import { EmployeeApi } from "../../apis/employee";
import { TokenContext } from "../../context/CurrentToken";
import { Button, Text } from "@nextui-org/react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";
import Navbar from "../../components/menu/Navbar";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";

import Cookies from "js-cookie";
import Image from "next/image";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";


interface Prop {
  slug: string;
}

const PageByJob = ({ slug }: Prop) => {
  const { query, back, push } = useRouter();
  const [jobState, setJobState] = useState({} as ServiceI);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const { privateToken, setPrivateToken } = useContext(TokenContext);

  useEffect(() => {
    if (slug) {
      ServiceApi.get(`/slug/${slug}`).then((res) => {
        console.log(res);
        setJobState(res.data);
      });
    }
  }, [slug]);

  const applicationJob = async (idJob: string = "") => {
    if (!employeeGlobal.id) {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); //
      Cookies.set("idJob", idJob, { expires: expirationDate });
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
        <title>Contact Americas | {jobState.title}</title>
        <meta
          name="description"
          content="Puestos de trabajo disponibles con relación a Contact Americas."
        />
        <meta property="og:title" content={`${jobState.title || ""}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Explora oportunidades laborales emocionantes y descubre tu próximo paso profesional en Contact Americas "
        />
        <meta property="og:url" content="https://work.contactamericas.com/" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/da0d2neas/image/upload/v1709087979/Imagen_TCN.png"
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
                <span>{jobState.type}</span>
                <span>- {jobState.typeJob}</span>
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
        <div className="flex lg:flex-nowrap flex-wrap md:gap-10 md:w-[90%]">
          <div className="">
            <div className={styles.details}>
              <h2 className="text-2xl font-semibold text-blue-900">
                Detalles:
              </h2>
              <div className={styles.infoContainer}>
                <p
                  dangerouslySetInnerHTML={{ __html: jobState.description }}
                ></p>
              </div>
              <h2 className="text-2xl font-semibold text-blue-900">
                Requerimientos:
              </h2>
              <div className={styles.infoContainer}>
                <p
                  dangerouslySetInnerHTML={{ __html: jobState.requirements }}
                ></p>
              </div>
            </div>
            <div className="">
              <Text size={18}>
                ¿Aún tienes dudas? Puedes preguntarnos en nuestro canal de
                WhatsApp.
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
            <div className="my-5 ">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-2 rounded-lg border-blue-500 border-2 text-blue-500 font-semibold">
                  <span>
                    {" "}
                    {jobState.localCurrency == "PEN" ? "S/" : "$"}
                    {jobState.salary}
                  </span>
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
          </div>
          <div className="md:w-full  border-red-500 lg:mt-10 mb-10">
            <div className="flex flex-wrap gap-2   ">
              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/da0d2neas/image/upload/v1710720358/410854940_778548617623857_5433103938503023123_n.jpg"
                  }
                  alt={""}
                  width={700}
                  height={600}
                  className="w-40 h-40 aspect-video object-cover rounded-md md:w-full lg:w-44 lg:h-44"
                />
              </div>
              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/da0d2neas/image/upload/v1710720362/410795412_778548584290527_4184241231428360036_n.jpg"
                  }
                  alt={""}
                  width={700}
                  height={600}
                  className="w-40 h-40 aspect-video object-cover rounded-md md:w-full lg:w-44 lg:h-44"
                />
              </div>
              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/da0d2neas/image/upload/v1710720354/420143824_794859459326106_3381224388367741244_n.jpg"
                  }
                  alt={""}
                  width={400}
                  height={300}
                  className="w-40 h-40 aspect-auto rounded-md md:w-full lg:w-44 lg:h-44"
                />
              </div>
              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/da0d2neas/image/upload/v1710720350/426126555_810125367799515_4321708370018438253_n.jpg"
                  }
                  alt={""}
                  width={500}
                  height={400}
                  className="w-40 h-40 aspect-video object-cover rounded-md md:w-full  lg:w-44 lg:h-44"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 ">
              <a
                href="https://www.facebook.com/ContactBPO"
                target="_blank"
                className="flex items-center gap-1 text-sm hover:text-blue-500 transition ease"
              >
                <FacebookIcon />
                {/* <span>Facebook</span> */}
              </a>
              <a
                href="https://www.instagram.com/contactbpo/"
                target="_blank"
                className="flex items-center hover:text-rose-500  transition ease  gap-1 text-sm"
              >
                <InstagramIcon />
                {/* <span>Instagram</span> */}
              </a>
              <a
                href="https://www.linkedin.com/company/contactamericas/"
                target="_blank"
                className="flex items-center gap-1 text-sm hover:text-blue-700  transition ease"
              >
                <LinkedInIcon />
                {/* <span>Linkedln</span> */}
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  // console.log({ slug });

  return {
    props: {
      slug,
    },
  };
};

export default PageByJob;


