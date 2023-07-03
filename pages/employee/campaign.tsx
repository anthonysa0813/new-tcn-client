import React, { useState, useEffect, useContext } from "react";
import LayoutEmployee from "./layoutEmployee";
import styles from "../../styles/client/Campaign.module.css";
import { GetServerSideProps } from "next/types";
import { Service, ServiceI } from "../../interfaces";
import dynamic from "next/dynamic";
import NotFoundJobs from "../../components/cards/NotFoundJobs";
import { TokenContext } from "../../context/CurrentToken";
const Head = dynamic(() => import("next/head").then((res) => res.default));
import { API_URL } from "../../utils/constanstApi";

interface ServiceProp {
  services: ServiceI[] | [];
}
const ServiceCard = dynamic(
  () => import("../../components/dashboard/clients/ServiceCard"),
  {
    ssr: false,
  }
);

const CampaignEmployees = () => {
  const [services, setServices] = useState([]);
  const {
    privateToken: { token },
    setPrivateToken,
  } = useContext(TokenContext);

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((res) => {
        return res.json();
      })
      .then((serv) => {
        console.log(serv.services);
        setServices(serv.services);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Contact BPO | Puestos Disponibles</title>
        <meta
          name="description"
          content="Puestos de trabajo disponibles con relación a Contact BPO."
        />
      </Head>
      <LayoutEmployee>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.mainContainer}>
              {services?.length > 0 ? (
                <h3>Puestos de trabajos</h3>
              ) : (
                <h3>No hay puestos disponibles por el momento</h3>
              )}
              <div className={styles.servicesGrid}>
                {services?.map((service: ServiceI) => {
                  return (
                    <>
                      <ServiceCard key={service._id} service={service} />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </LayoutEmployee>
    </>
  );
};
export default CampaignEmployees;
