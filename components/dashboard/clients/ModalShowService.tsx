import React, { useContext } from "react";
import { formatDate } from "../../../helpers/formatDate";
import { ServiceI } from "../../../interfaces";
import styles from "../../../styles/client/Campaign.module.css";
import { useRouter } from "next/router";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../../context/EmployeeContext";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ModalComponent from "../ModalComponent";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  service: ServiceI;
  setShowModal: (state: boolean) => void;
}

const ModalShowService = ({ service, setShowModal }: Prop) => {
  console.log({ service });
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const router = useRouter();

  const closeModal = () => {
    setShowModal(false);
  };

  const applicationJob = async (idJob: string = "") => {
    if (!employeeGlobal.id) {
      const notify = () => toast.error("Necesitas de una cuenta registrada");
      notify();
      setTimeout(() => {
        router.push("/user/register");
      }, 1500);
    }
    const employeeId = employeeGlobal.id;
    await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/employees/${employeeId}/${idJob}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const notify = () => toast.success("Aplicaste a este puesto");
        notify();
      });
  };

  return (
    <ModalComponent>
      {/* <div className={styles.modal}> */}
      <div className={styles.modalContainer}>
        <CloseIcon onClick={closeModal} />
        <div className="headModal">
          <h4>{service.title}</h4>
        </div>
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
              <p dangerouslySetInnerHTML={{ __html: service.requirements }}></p>
            </li>
          </ul>
        </div>
        <div className="infoDate">
          <span>Fecha de Publicación: {formatDate(service.createdAt)}</span>
        </div>
      </div>

      {/* </div> */}
    </ModalComponent>
  );
};

export default ModalShowService;
