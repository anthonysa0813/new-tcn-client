import React, { useEffect, useState, useContext } from "react";
import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import { ServiceI } from "../../../interfaces";
import styles from "../../../styles/admin/ListServices.module.css";
import ServiceItem from "../../../components/servcies/ServiceItem";
import dynamic from "next/dynamic";
import { TokenContext } from "../../../context/CurrentToken";
import { API_URL } from "../../../utils/constanstApi";

const Head = dynamic(() => import("next/head").then((res) => res.default));

interface Prop {
  services: ServiceI[] | [];
}

const ListServicesPage = () => {
  const [servicesArr, setServicesArr] = useState<ServiceI[] | []>([]);
  const { privateToken } = useContext(TokenContext);

  useEffect(() => {
    fetch(`https://work.contactamericas.com/api/services`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setServicesArr(res.services);
      });
  }, []);

  const changeStatusService = async (currentService: ServiceI) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/services/${currentService._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: privateToken.token,
        },
      }
    ).then((resServ) => {
      if (resServ.status === 200) {
        fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services`)
          .then((res) => res.json())
          .then((data) => {
            setServicesArr(data.services);
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Lista de Puestos de Trabajos</title>
        <meta
          name="description"
          content="Contact BPO página administrador de Contact BPO - lista de trabajos"
        />
      </Head>
      <LayoutDashboard>
        <>
          <h1 className={styles.title}>Puestos de trabajo</h1>
          <hr />
          {servicesArr.map((service: ServiceI) => {
            return (
              <ServiceItem
                key={service._id}
                service={service}
                setServicesArr={setServicesArr}
                changeStatusService={() => changeStatusService(service)}
              />
            );
          })}
        </>
      </LayoutDashboard>
    </>
  );
};

export default ListServicesPage;
