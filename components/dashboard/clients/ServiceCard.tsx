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
import useForm from "../../../hooks/useForm";
import Cookies from "js-cookie";

interface Prop {
  service: ServiceI;
}
const ModalShowService = dynamic(() =>
  import("./ModalShowService").then((res) => res.default)
);

interface PropForm {
  salary: string;
  jornada: string;
  type: string;
}

const ServiceCard = ({ service }: Prop) => {
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [showModal, setShowModal] = useState(false);
  const [optionShowModal, setOptionShowModal] = useState("");
  const [responseQuestion, setResponseQuestion] = useState(false);
  const [existModal, setExistModal] = useState(false);

  const [showModalSalaryByUser, setShowModalSalaryByUser] = useState(
    service.modalSalary || false
  );
  const [showModalConfirmSalary, setShowModalConfirmSalary] = useState(false);
  const [valueConfirm, setValueConfirm] = useState("");

  const [servicesId, setServisceId] = useState([] as string[]);
  const [currentServiceId, setCurrentServiceId] = useState("");
  const [isPostulate, setIsPostulate] = useState(false);
  const [idEmployee, setIdEmployee] = useState("");
  const [employeeUnparse, setEmployeeUnparse] = useState("");
  const { privateToken, setPrivateToken } = useContext(TokenContext);
  const { setVisible, bindings } = useModal();
  const [preventModalShow, setPreventModalShow] = useState(true);
  const [initialValues, setInitialValues] = useState({
    salary: "",
    jornada: "",
    type: "",
  });
  const [responseConfirmSalary, setResponseConfirmSalary] = useState(false);
  const { jornada, salary, type, onChange, form } =
    useForm<PropForm>(initialValues);

  const router = useRouter();

  useEffect(() => {
    setIdEmployee(employeeGlobal.id || "");
    if (service.modalConfirm) {
      setShowModalConfirmSalary(false);
    } else {
      setShowModalConfirmSalary(true);
    }

    if (service.modalSalary && !service.modalConfirm) {
      setOptionShowModal("1");
      setExistModal(true);
      console.log({ ...service, stateShow: "1" });
    } else if (!service.modalSalary && service.modalConfirm) {
      setOptionShowModal("2");
      setExistModal(true);
      console.log({ ...service, stateShow: "2" });
    } else if (service.modalSalary && service.modalConfirm) {
      setOptionShowModal("3");
      console.log({ ...service, stateShow: "3" });
      setExistModal(true);
    } else {
      // setOptionShowModal("");
      // console.log({ ...service, stateShow: "3" });
      setExistModal(false);
    }

    // if (service.modalConfirm && service.modalSalary) {
    //   setOptionShowModal("3");
    //   setExistModal(true);
    //   console.log({ ...service, stateShow: "3" });
    // } else if (service.modalConfirm && !service.modalSalary) {
    //   setOptionShowModal("1");
    //   setExistModal(true);
    //   console.log({ ...service, stateShow: "1" });
    // } else if (!service.modalSalary && service.modalConfirm) {
    //   setOptionShowModal("2");
    //   console.log({ ...service, stateShow: "2" });
    //   setExistModal(true);
    // }
  }, [service._id]);

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
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); //
    Cookies.set("idJob", idJob, { expires: expirationDate });

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

    if (existModal) {
      setVisible(true);
    }
    // if (showModalSalaryByUser) {
    // }

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
          // window.location.reload();
          // if (existModal) {
          //   if (responseQuestion) {
          //     window.location.reload();
          //   }
          // }
          if (!existModal) {
            window.location.reload();
          }

          notify();
        }
      })
      .catch((err) => console.error(err));
      };

  const handleSubmitSalary = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([type, salary, jornada].includes("")) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services/setSalary-position`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salary: salary,
        type: type,
        jornada: jornada,
        idEmployee: idEmployee,
        idService: service._id,
        confirmSalary: valueConfirm,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVisible(false);
        setResponseQuestion(true);
        setShowModalSalaryByUser(false);
        if (showModalConfirmSalary) {
          setShowModalConfirmSalary(true);
        }
        console.log(data);
        if (data.error) {
          const notifyError = () =>
            toast.error("Ouch!, inténtalo más tarde...");
          notifyError();
        } else {
          const notify = () => toast.success("Se ha mandado su información.");
          notify();
          window.location.reload();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([valueConfirm].includes("")) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services/setSalary-position`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        salary: "",
        type: "",
        jornada: "",
        idEmployee: idEmployee,
        idService: service._id,
        confirmSalary: valueConfirm,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVisible(false);
        setResponseQuestion(true);
        setShowModalSalaryByUser(false);
        if (showModalConfirmSalary) {
          setShowModalConfirmSalary(true);
        }
        console.log(data);
        if (data.error) {
          console.log(data);
          const notifyError = () =>
            toast.error("Ouch!, inténtalo más tarde...");
          notifyError();
        } else {
          const notify = () => toast.success("Se ha mandado su información.");
          notify();
          window.location.reload();
        }
      })
      .catch((err) => console.error(err));
  };

  // service.confirmModal == false
  const eventChange1 = () => {
    if (showModalConfirmSalary) {
      handleSubmitSalary;
    } else {
      setVisible(false);
      setShowModalSalaryByUser(false);
    }
  };

  // service.confirmModal == true
  const eventChange2 = () => {
    setShowModalConfirmSalary(true);
  };

  return (
    <>
      {optionShowModal === "3" && (
        <Modal
          scroll
          preventClose={preventModalShow}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          {...bindings}
        >
          <Modal.Header>
            <Text
              id="modal-title"
              size={20}
              color="red"
              className="font-semibold"
            >
              Este puesto requiere que respondas las siguientes preguntas
            </Text>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitSalary}>
              <div className="">
                {!showModalConfirmSalary ? (
                  <>
                    <div>
                      <Text id="modal-description">
                        ¿Cuál es su pretención salarial para este puesto?
                      </Text>
                      <input
                        type="text"
                        style={{
                          width: "100%",
                          paddingBlock: ".5rem",
                          paddingInline: ".5rem",
                          borderRadius: "1rem",
                        }}
                        className="border border-blue-500"
                        name="salary"
                        value={salary}
                        onChange={onChange}
                        placeholder="Ejemplo: 2000"
                      />
                    </div>
                    <div className="">
                      <Text id="modal-description">
                        Indique el tipo de moneda
                      </Text>
                      <select
                        name="type"
                        id=""
                        className={`${styles.setect} border border-blue-500`}
                        value={type}
                        onChange={onChange}
                      >
                        <option value="">Seleccione</option>
                        <option value="USD">Dólares</option>
                        <option value="PEN">Soles</option>
                      </select>
                    </div>
                    <div className="">
                      <Text id="modal-description">
                        Indique el tipo de jornada
                      </Text>
                      <select
                        name="jornada"
                        id=""
                        className={`${styles.setect} border border-blue-500`}
                        value={jornada}
                        onChange={onChange}
                      >
                        <option value="">Seleccione</option>
                        <option value="hora">Hora</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Text id="modal-description">
                        ¿Por favor confirmar que estás de acuerdo con las
                        condiciones ofrecidas:{" "}
                        <span className="text-blue-500 font-semibold">
                          {service.localCurrency === "PEN" ? "S./" : "$."}{" "}
                          {service.salary}?
                        </span>
                      </Text>
                      <select
                        className="w-full my-5 border border-sky-500 p-2 rounded-lg"
                        name="confirmResponse"
                        id=""
                        onChange={(e) => setValueConfirm(e.target.value)}
                      >
                        <option value="">Seleccione una respuesta</option>
                        <option value="Sí">Sí, acepto</option>
                        <option value="No">No, acepto</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              {/* <button
                className="rounded-lg p-2 w-full text-white bg-blue-500 mt-2 hover:bg-blue-600 transition ease"
                onClick={service.modalConfirm ? eventChange2 : eventChange1}
                type={!showModalConfirmSalary ? "button" : "submit"}
              >
                {!showModalConfirmSalary ? "Siguiente" : "Enviar Respuesta"}
              </button> */}
              {!showModalConfirmSalary && (
                <button
                  className="rounded-lg p-2 w-full text-white bg-blue-500 mt-2 hover:bg-blue-600 transition ease"
                  type="button"
                  onClick={() => {
                    setShowModalConfirmSalary(true);
                  }}
                >
                  Siguiente
                </button>
              )}
              {showModalConfirmSalary && (
                <button
                  className="rounded-lg p-2 w-full text-white bg-blue-500 mt-2 hover:bg-blue-600 transition ease"
                  type="submit"
                >
                  Enviar Respuesta
                </button>
              )}
            </form>
          </Modal.Body>
        </Modal>
      )}
      {/* modal que solo pregunta cual es la pretencio */}
      {optionShowModal === "1" && (
        <Modal
          scroll
          preventClose={preventModalShow}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          {...bindings}
        >
          <Modal.Header>
            <Text id="modal-title" size={20} color="red">
              Este puesto requiere que respondas las siguientes preguntas
            </Text>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitSalary}>
              <div className="">
                <>
                  <div>
                    <Text id="modal-description">
                      ¿Cuál es su pretención salarial para este puesto?
                    </Text>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        paddingBlock: ".5rem",
                        paddingInline: ".5rem",
                        borderRadius: "1rem",
                      }}
                      className="border border-blue-500"
                      name="salary"
                      value={salary}
                      onChange={onChange}
                      placeholder="Ejemplo: 2000"
                    />
                  </div>
                  <div className="">
                    <Text id="modal-description">
                      Indique el tipo de moneda
                    </Text>
                    <select
                      name="type"
                      id=""
                      className="w-full my-5 border border-sky-500 p-2 rounded-lg"
                      value={type}
                      onChange={onChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="USD">Dólares</option>
                      <option value="PEN">Soles</option>
                    </select>
                  </div>
                  <div className="">
                    <Text id="modal-description">
                      Indique el tipo de jornada
                    </Text>
                    <select
                      name="jornada"
                      id=""
                      className={`${styles.setect} border border-blue-500`}
                      value={jornada}
                      onChange={onChange}
                    >
                      <option value="">Seleccione</option>
                      <option value="hora">Hora</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </>
              </div>
              <button
                className="rounded-lg p-2 w-full text-white bg-blue-500 mt-5 hover:bg-blue-600 transition ease"
                type="submit"
              >
                Enviar Respuesta
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {/* modal que solo pregunta si acepta el salario */}
      {optionShowModal === "2" && (
        <Modal
          scroll
          preventClose={preventModalShow}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          {...bindings}
        >
          <Modal.Header>
            <Text id="modal-title" size={20} color="red">
              Este puesto requiere que respondas las siguientes preguntas
            </Text>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitConfirm}>
              <div className="">
                <div>
                  <div>
                    <Text id="modal-description">
                      ¿Por favor confirmar que estás de acuerdo con las
                      condiciones ofrecidas:{" "}
                      <span className="text-blue-500 font-semibold">
                        {service.localCurrency === "PEN" ? "S./" : "$."}{" "}
                        {service.salary}?
                      </span>
                    </Text>
                    <select
                      name="confirmResponse"
                      id=""
                      className="w-full my-5 border border-sky-500 p-2 rounded-lg"
                      onChange={(e) => setValueConfirm(e.target.value)}
                    >
                      <option value="">Seleccione una respuesta</option>
                      <option value="Sí">Sí, acepto</option>
                      <option value="No">No, acepto</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="rounded-lg p-2 w-full text-white bg-blue-500 mt-2 hover:bg-blue-600 transition ease"
                type="submit"
              >
                Enviar Respuesta
              </button>
            </form>
          </Modal.Body>
        </Modal>
      )}

      <div
        className={`${styles.card} ${
          isPostulate ? styles.isPostulateActive : ""
        }`}
      >
        <ToastContainer />
        <div className={styles.titleContainer}>
          <Link href={`/job/${service.slug}`}>
            <h4 className={`${styles.title} font-semibold`}>{service.title}</h4>
          </Link>

          <span
            className={!service.status ? `${styles.desactiveAnnounce}` : ""}
          >
            {service.status ? "Activo" : "Finalizado"}
          </span>
        </div>
        <div className={styles.bodyGrid}>
          <div className={styles.cardContainer}>
            <div className="">
              <div className={styles.infoContainer}>
                <p
                  dangerouslySetInnerHTML={{ __html: service.description }}
                ></p>
              </div>
              <div className="characters">
                <Grid.Container gap={2}>
                  <Grid>
                    <Button bordered color="primary" auto>
                      <span className={styles.textSm}>
                        {service.localCurrency === "PEN" ? "S./" : "$."}
                        {service.salary}
                      </span>
                    </Button>
                  </Grid>
                  <Grid>
                    <Button bordered color="primary" auto>
                      <span className={styles.textSm}>{service.schedule}</span>
                    </Button>
                  </Grid>
                  <Grid>
                    <Button bordered color="primary" auto>
                      <span className={styles.textSm}>{service.type}</span>
                    </Button>
                  </Grid>
                  <Grid>
                    <Button bordered color="primary" auto>
                      <span className={styles.textSm}>{service.typeJob}</span>
                    </Button>
                  </Grid>
                </Grid.Container>
              </div>
            </div>
            <div className={styles.actions}>
              {/* <button className={styles.button} onClick={() => setVisible(true)}>
              Ver detalles
            </button> */}
              <Link href={`/jobs/${service._id || ""}/${service.slug}`}>
                <Button
                  shadow
                  color="primary"
                  auto
                  className="bg-blue-700 text-white"
                  // onClick={() => setVisible(true)}
                >
                  Ver detalles
                </Button>
              </Link>
              {/* <button
              className={`${
                isPostulate ? styles.buttonDisabled : styles.button
              }`}
              onClick={() => applicationJob(service?._id)}
              disabled={isPostulate ? true : false}
            >
              {isPostulate ? "Postulado" : "Postular"}
            </button> */}
              <Button
                shadow
                color={isPostulate ? "gradient" : "success"}
                auto
                className="bg-green-500 text-white"
                onClick={() => applicationJob(service?._id)}
                disabled={isPostulate ? true : false}
              >
                {isPostulate ? "Postulado" : "Postular"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCard;


