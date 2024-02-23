import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/employees/Applications.module.css";
import {
  Application,
  IApplicationJobResponse,
  Service,
} from "../../../interfaces/index";
import dynamic from "next/dynamic";

interface Prop {
  service: Service;
  applications: IApplicationJobResponse[] | [];
  status?: string;
}

const IoIosArrowUp = dynamic(
  () => import("@mui/icons-material/KeyboardArrowUp")
);

const CardCollapse = ({ service, applications }: Prop) => {
  const [activeDetails, setActiveDetails] = useState(false);
  const [currentService, setCurrentService] = useState("");
  const [totalServiceInfo, setTotalServiceInfo] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    applications.forEach((app) => {
      if (app.service === service._id) {
        // setCurrentStatus(app);
        console.log({
          status: app.status,
        });
        setTotalServiceInfo(app.status);
        getInfoStatus();
      }
    });
  }, []);

  const getInfoStatus = () => {
    const data = applications.map((app) => {
      if (app.service === service._id) {
        if (app.status) {
          // console.log({ status: app.status });
          setCurrentStatus(app.status || "");
        }
        // return app.status;
      }
    });
  };

  return (
    <div key={service._id} className={styles.serviceCard}>
      <div className={styles.serviceCardHead}>
        <div className="title">
          <h3>{service.title}</h3>
          <div className={styles.status}>
            <strong>
              Estado: <span className="text-blue-500">{currentStatus}</span>
            </strong>
            {totalServiceInfo === "" ? (
              <span className=" btn bg-2 purple">Haz Postulado</span>
            ) : null}
            {totalServiceInfo === "CONTRATADO" ? (
              <span className=" btn bg-2 primary">CONTRATADO</span>
            ) : null}
            {totalServiceInfo === "SELECCIONADO" ? (
              <span className=" btn bg-2 green">SELECCIONADO</span>
            ) : null}
            {totalServiceInfo === "DESCARTADO" ? (
              <span className=" btn bg-2 red">DESCARTADO</span>
            ) : null}
          </div>
        </div>
        <IoIosArrowUp
          className={`${styles.icon} ${
            currentService === service._id
              ? styles.activeDetails
              : styles.desactiveDetails
          }`}
          onClick={() => {
            setActiveDetails((state) => !state);
            setCurrentService((state: string) => {
              if (state === service._id) {
                return "";
              } else {
                return service._id || "";
              }
            });
          }}
        />
      </div>
      {currentService === service._id && (
        <div className={styles.serviceCardBody}>
          <p
            dangerouslySetInnerHTML={{ __html: service.description }}
            className={`animate__animated animate__fadeIn`}
          ></p>
        </div>
      )}
    </div>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetch("");

  return {
    props: {},
  };
};

export default CardCollapse;

