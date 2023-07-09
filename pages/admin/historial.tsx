import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import { useRouter } from "next/router";
import { ServiceI } from "../../interfaces";
import ServiceItem from "../../components/servcies/ServiceItem";
import { TokenContext } from "../../context/CurrentToken";

const HistorialPage = () => {
  const [currentServices, setCurrentServices] = useState<ServiceI[] | []>([]);
  const { privateToken } = useContext(TokenContext);
  const router = useRouter();

  useEffect(() => {
    fetch(`https://work.contactamericas.com/api/services`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const servciesInactives = res.services.filter(
          (service: ServiceI) => !service.status
        );
        console.log({
          servciesInactives,
        });
        setCurrentServices(servciesInactives);
        // setServicesArr(res.services);
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
            // console.log({ servciesActives });
            router.reload();
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Historial de Puestos</title>
        <meta
          name="description"
          content="Contact BPO página administrador de Contact BPO - historial de puestos desactivados"
        />
      </Head>
      <LayoutDashboard>
        <>
          <h1>Lista de Puestos desactivados</h1>
          <hr />
          {currentServices.map((serviceItem) => {
            return (
              <ServiceItem
                key={serviceItem._id}
                service={serviceItem}
                setServicesArr={setCurrentServices}
                changeStatusService={() => changeStatusService(serviceItem)}
              />
            );
          })}
        </>
      </LayoutDashboard>
    </>
  );
};

export default HistorialPage;
