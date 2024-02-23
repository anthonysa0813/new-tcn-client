import React, { useState, useEffect, useContext } from "react";
import LayoutEmployee from "./layoutEmployee";
import styles from "../../styles/client/Campaign.module.css";
import { Service, ServiceI } from "../../interfaces";
import dynamic from "next/dynamic";
import { TokenContext } from "../../context/CurrentToken";
const Head = dynamic(() => import("next/head").then((res) => res.default));
import { API_URL } from "../../utils/constanstApi";
import { Loading } from "@nextui-org/react";
import { BounceLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then((res) => {
        return res.json();
      })
      .then((serv) => {
        const servicesActive = serv.services.filter(
          (service: ServiceI) => service.status
        );

        setServices(servicesActive);
        setLoading(false);
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
        <>
          {loading && (
            <div className={styles.loadingContainer}>
              <h3>Cargando Puestos...</h3>
              <BounceLoader color="#0072f5" />
            </div>
          )}
        </>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.mainContainer}>
              {services?.length > 0 ? (
                <>
                  <h3>Puestos de trabajo</h3>
                </>
              ) : (
                <div className={styles.loadingContainer}>
                  <h3>No existe puestos disponibles</h3>
                </div>
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
