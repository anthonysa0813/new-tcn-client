import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, useModal } from "@nextui-org/react";
import { EmployeeInterface, Service, ServiceI } from "../../interfaces";
import styles from "../../styles/admin/ListServices.module.css";
import TableListStaticData from "../dashboard/clients/TableListStaticData";
import { generateExcelFile } from "../../helpers/exportFileExcel";
import { ServiceApi } from "../../apis/services";
import Link from "next/link";
import { TokenContext } from "../../context/CurrentToken";

interface Prop {
  service: ServiceI;
  changeStatusService: () => Promise<void>;
  setServicesArr: React.Dispatch<React.SetStateAction<[] | ServiceI[]>>;
}

interface IDeleteResponse {
  message: string;
}

const ServiceItem = ({
  service,
  changeStatusService,
  setServicesArr,
}: Prop) => {
  const [offsetSliceValue, setOffsetSliceValue] = useState(5);
  const [currentService, setCurrentService] = useState({} as ServiceI);
  const { setVisible, bindings } = useModal();
  const [currentPuesto, setCurrentPuesto] = useState("");
  const { privateToken } = useContext(TokenContext);

  useEffect(() => {
    setCurrentService(service);
    console.log("service", service);
  }, [service]);

  const watchAllEmployee = (data: EmployeeInterface[] | []) => {
    setOffsetSliceValue(data.length);
  };

  const setInfoJob = async (name: string) => {
    setCurrentPuesto(name);
    setVisible(true);
  };

  const deleteJob = async (id: string) => {
    const { data } = await ServiceApi.delete(`/${id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    });
    setServicesArr((service) => {
      const removeSericeArr = service.filter((serv) => serv._id !== id);
      return removeSericeArr;
    });
  };

  return (
    <>
      <div key={currentService._id} className={styles.tableService}>
        <div className={styles.tableHead}>
          <h4 className={styles.title}>{currentService.title}</h4>
          <Button
            size={"xs"}
            style={{ padding: ".5rem" }}
            color={currentService.status ? "success" : "error"}
            onClick={() => changeStatusService()}
          >
            {" "}
            {currentService.status ? "Activo" : "Finalizado"}
          </Button>
          <Link href={`/admin/listServices/${currentService._id}`}>
            <Button
              size={"xs"}
              style={{ padding: ".5rem" }}
              color={"gradient"}
              type="button"
              // onClick={() => watchAllEmployee(currentService.employees || [])}
            >
              {" "}
              Ver Todos
            </Button>
          </Link>
          <Button
            size={"xs"}
            style={{ padding: ".5rem" }}
            color={"default"}
            onClick={() => generateExcelFile(currentService.employees)}
          >
            {" "}
            Descargar Lista
          </Button>
          <Link href={`/admin/${currentService._id}/updateService`}>
            <Button
              size={"xs"}
              style={{ padding: ".5rem" }}
              color={"warning"}
              onClick={() => console.log("editando")}
            >
              {" "}
              Editar
            </Button>
          </Link>
          <Button
            size={"xs"}
            style={{ padding: ".5rem" }}
            color={"error"}
            onClick={() => setInfoJob(currentService.title)}
          >
            {" "}
            Eliminar Puesto
          </Button>
        </div>
        <TableListStaticData
          data={currentService.employees || []}
          // total={service.employees.length}
          idService={currentService._id || ""}
          supervisor={service.supervisor || ""}
          offsetSliceValue={offsetSliceValue}
        />
      </div>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Body>
          <div className={styles.field}>
            <strong>
              ¿Seguro que desea Eliminar el Puesto <span>{currentPuesto}</span>?
            </strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            onClick={() => deleteJob(currentService._id || "")}
          >
            Sí, eliminar
          </Button>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ServiceItem;
