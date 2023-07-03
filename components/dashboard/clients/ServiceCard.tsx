import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../../context/EmployeeContext";
import {
  EmployeeInterface,
  Service,
  ServiceI,
} from "../../../interfaces/index";
import styles from "../../../styles/client/Campaign.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getEmployeeById } from "../../../apis/employee/useEmployeeFetch";
import { TokenContext } from "../../../context/CurrentToken";
import { EmployeeApi } from "../../../apis/employee";
import Link from "next/link";
import { Button, Grid } from "@nextui-org/react";
import { Modal, useModal, Button as ButtonNext, Text } from "@nextui-org/react";
import { formatDate } from "../../../helpers/formatDate";

interface Prop {
  service: ServiceI;
}
const ModalShowService = dynamic(() =>
  import("./ModalShowService").then((res) => res.default)
);

const ServiceCard = ({ service }: Prop) => {
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [showModal, setShowModal] = useState(false);
  const [servicesId, setServisceId] = useState([] as string[]);
  const [currentServiceId, setCurrentServiceId] = useState("");
  const [isPostulate, setIsPostulate] = useState(false);
  const [idEmployee, setIdEmployee] = useState("");
  const [employeeUnparse, setEmployeeUnparse] = useState("");
  const { privateToken, setPrivateToken } = useContext(TokenContext);
  const { setVisible, bindings } = useModal();

  const router = useRouter();

  useEffect(() => {
    if (typeof window.sessionStorage !== undefined) {
      const token = sessionStorage.getItem("token");
      setPrivateToken({ token: token || "" });
    }
    const resEmployeeLocalStorage =
      window.localStorage.getItem("employee") || "";
    if (Boolean(resEmployeeLocalStorage)) {
      const getId: EmployeeInterface = JSON.parse(
        localStorage.getItem("employee") || ""
      );
      setEmployeeGlobal(getId);
      setIdEmployee(getId.id);
    }
  }, []);

  useEffect(() => {
    if (idEmployee && privateToken.token) {
      getEmployeeById("employees", idEmployee, privateToken.token).then(
        (res) => {
          setServisceId(res?.servicesId || []);
          setCurrentServiceId(service._id || "");
          const isValid = servicesId.includes(currentServiceId);
          setIsPostulate(isValid);
        }
      );
    }
  }, [currentServiceId, idEmployee]);

  const applicationJob = async (idJob: string = "") => {
    if (!employeeGlobal.id) {
      const notify = () => toast.error("Necesitas de una cuenta registrada");
      notify();
      setTimeout(() => {
        router.push("/user/register");
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
      {/* {showModal && (
        <ModalShowService service={service} setShowModal={setShowModal} />
      )} */}
      <Modal
        scroll
        fullScreen
        closeButton
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={32}>
            {service.title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description">
            <div className={styles.infoBody}>
              <p dangerouslySetInnerHTML={{ __html: service.description }}></p>
            </div>
            <div className={styles.infoGeneral}>
              <p>Horario: {service.schedule}</p>
              <p>Salario: S/.{service.salary}</p>
            </div>

            <div className={styles.requirements}>
              <h3>Requerimientos:</h3>
              <ul>
                <li>
                  <p
                    dangerouslySetInnerHTML={{ __html: service.requirements }}
                  ></p>
                </li>
              </ul>
            </div>
            <div className="infoDate">
              <span>Fecha de Publicación: {formatDate(service.createdAt)}</span>
            </div>
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => setVisible(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className={`${styles.card} ${
          isPostulate ? styles.isPostulateActive : ""
        }`}
      >
        <ToastContainer />
        <div className={styles.titleContainer}>
          <Link href={`/jobs/${service._id || ""}/${service.slug}`}>
            <h4 className={styles.title}>{service.title}</h4>
          </Link>

          <span
            className={!service.status ? `${styles.desactiveAnnounce}` : ""}
          >
            {service.status ? "Activo" : "Finalizado"}
          </span>
        </div>
        <div className={styles.bodyGrid}>
          <div className="">
            <div className={styles.infoContainer}>
              <p dangerouslySetInnerHTML={{ __html: service.description }}></p>
            </div>
            <div className="characters">
              <Grid.Container gap={2}>
                <Grid>
                  <Button bordered color="primary" auto>
                    {service.salary}
                  </Button>
                </Grid>
                <Grid>
                  <Button bordered color="primary" auto>
                    {service.schedule}
                  </Button>
                </Grid>
                <Grid>
                  <Button bordered color="primary" auto>
                    {service.type}
                  </Button>
                </Grid>
                <Grid>
                  <Button bordered color="primary" auto>
                    {service.typeJob}
                  </Button>
                </Grid>
              </Grid.Container>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => setVisible(true)}>
              Ver detalles
            </button>
            <button
              className={`${
                isPostulate ? styles.buttonDisabled : styles.button
              }`}
              onClick={() => applicationJob(service?._id)}
              disabled={isPostulate ? true : false}
            >
              {isPostulate ? "Postulado" : "Postular"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCard;
