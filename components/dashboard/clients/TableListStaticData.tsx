import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Modal, Table, Text, useModal } from "@nextui-org/react";
import { EmployeeInterface, Experience, LangObject } from "../../../interfaces";
import styles from "../../../styles/admin/TableEmployee.module.css";
import DropDownSelect from "../../buttons/DrownDownSelect";
import { UserContext } from "../../../context/UserContext";
import Link from "next/link";
import { EmployeeApi } from "../../../apis/employee";
import { TokenContext } from "../../../context/CurrentToken";
import { Chip } from "@mui/material";
import { CurrentLangContext } from "../../../context/CurrentLang";
import { getExperienceByEmployee } from "../../../apis/experience/useFecthExperience";

type Props = {
  data: EmployeeInterface[];
  total?: string | number;
  offsetSliceValue: number;
  idService: string;
  supervisor?: string;
};

// interface IResponseApplication {
//   _id?: string;
//   employee: string;
//   service: string;
//   status: string;
//   __v?: number;
// }

const TableListStaticData = ({
  data,
  total,
  offsetSliceValue = 5,
  idService,
  supervisor,
}: Props) => {
  const { setVisible, bindings } = useModal();
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeInterface>(
    {} as EmployeeInterface
  );
  const [experienceUser, setExperienceUser] = useState<Experience[] | []>([]);
  const [lang, setLang] = useState<LangObject[] | []>([]);
  const [currentData, setcurrentData] = useState<EmployeeInterface[] | []>([]);
  const [initialSliceValue, setInitialSliceValue] = useState(0);
  const { userGlobal } = useContext(UserContext);
  const { privateToken } = useContext(TokenContext);
  const [currentLang, setCurrentLang] = useState<LangObject[] | []>([]);

  useEffect(() => {
    if (currentData.length > 0) {
      EmployeeApi.get<EmployeeInterface>(`/employees/${currentEmployee.id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        // console.log({ res });
        setExperienceUser(res.data.experiences || []);
        setLang(res.data.languages || []);
        setCurrentLang(res.data.languages || []);
      });

      // current employeeJobStatus
      getExperienceByEmployee(
        "get-applications-jobs",
        currentEmployee.id || "",
        privateToken.token
      ).then((res) => {
        console.log({ res });
      });

      // get skill by user
      EmployeeApi.get(`/knoledge/${currentData[0].id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        console.log(res.data);
      });

      // traer experiencia por usuario
      getExperienceByEmployee(
        "experiences",
        currentEmployee.id || "",
        privateToken.token
      ).then((res) => {
        // console.log("res", res.data);
      });
    }
  }, [currentEmployee]);

  useEffect(() => {
    if (currentData.length > 0) {
      EmployeeApi.get<EmployeeInterface>(`/employees/${currentData[0].id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        setExperienceUser(res.data.experiences || []);
        setLang(res.data.languages || []);
      });

      // get skill by user
      EmployeeApi.get(`/knoledge/${currentData[0].id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        console.log(res.data);
      });

      // get user information
    }
  }, [currentData]);
  useEffect(() => {
    setcurrentData(data.slice(initialSliceValue, offsetSliceValue));
  }, [data, offsetSliceValue, initialSliceValue]);

  const changeStatusJob = async (idJob: string, idEmployee: string) => {
    console.log({ message: "change status", idJob, idEmployee });
    EmployeeApi.put(`/employees/status-job/${idJob}/${idEmployee}`, {
      status: "VISTO",
    });
  };

  return (
    <>
      <Table
        aria-label="Example table with static content"
        css={{
          height: "auto",
          minWidth: "100%",
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "$gray400",
          marginTop: "$1",
        }}
      >
        <Table.Header>
          <Table.Column>Nombre</Table.Column>
          <Table.Column>Tlf</Table.Column>
          <Table.Column>email</Table.Column>
          <Table.Column>Conocer más</Table.Column>
          <Table.Column>Estado</Table.Column>
        </Table.Header>
        <Table.Body>
          {currentData.map((user: EmployeeInterface) => {
            return (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="primary"
                    auto
                    onClick={() => {
                      setVisible(true);
                      setCurrentEmployee(user);
                    }}
                  >
                    <span>Ver información</span>
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  {userGlobal.role === "ADMIN_ROLE" ? (
                    <DropDownSelect
                      key={user.id}
                      idService={idService}
                      idUser={user.id || ""}
                      idJob={idService}
                      statusUser={user.statusJob || ""}
                    />
                  ) : (
                    <span>{user.statusJob}</span>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={24} className={styles.title}>
            {currentEmployee.name} {currentEmployee.surnames}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.gridBody}>
            <div className={styles.field}>
              <strong>País:</strong>
              <p>
                {currentEmployee.country} - {currentEmployee.district}
              </p>
            </div>
            <div className={styles.field}>
              <strong>Email:</strong>
              <p>{currentEmployee.email}</p>
            </div>
            <div className={styles.field}>
              <strong>Número telefónico:</strong>
              <p>{currentEmployee.phone}</p>
            </div>
            <div className={styles.field}>
              <strong>LinkedIn:</strong>
              <p>
                <Button
                  color="primary"
                  auto
                  size="sm"
                  style={{ marginBlock: "1rem" }}
                >
                  <Link href={currentEmployee.linkedin || ""} target="_blank">
                    abrir LinkeDln
                  </Link>
                </Button>
              </p>
            </div>
            <div className={styles.field}>
              <strong>GitHub:</strong>
              <Button
                color="primary"
                auto
                size="sm"
                style={{ marginBlock: "1rem" }}
              >
                <Link href={currentEmployee.github || ""} target="_blank">
                  abrir github
                </Link>
              </Button>
            </div>
            <div className={styles.field}>
              <strong>Cv:</strong>
              <Button
                color="primary"
                auto
                size="sm"
                style={{ marginBlock: "1rem" }}
                onClick={() =>
                  changeStatusJob(idService, currentEmployee.id || "")
                }
              >
                <Link href={currentEmployee.cv || ""} target="_blank">
                  abrir el enlace del cv
                </Link>
              </Button>
            </div>
            <div className={styles.field}>
              <strong>Idiomas:</strong>
              <ul style={{ display: "flex", gap: "1rem" }}>
                {currentLang.map((lg) => {
                  return (
                    <Chip
                      key={lg.idEmployee}
                      label={`${lg.lang} - ${lg.levelOral}`}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={styles.field}>
            <strong>Experiencia Laboral:</strong>
            {experienceUser.map((experience) => {
              return (
                <div className="" key={experience._id}>
                  <h5>
                    {experience.title} - {experience.level} -{" "}
                    {experience.country}
                  </h5>
                  <div className={styles.titleExp}>
                    <p className={styles.experienceField}>
                      Área: <span>{experience.area}</span>
                    </p>
                  </div>
                  <div className={styles.titleExp}>
                    <p className={styles.experienceField}>
                      Actividad de la empresa:{" "}
                      <span>{experience.activytyBussiness}</span>
                    </p>
                  </div>
                  <div className={styles.titleExp}>
                    <p className={styles.experienceField}>
                      Fechas:{" "}
                      <span>
                        {experience.dateStart} - {experience.dateEnd}
                      </span>
                    </p>
                    <p className={styles.experienceField}>
                      ¿Trababaja actualmente aquí?:{" "}
                      <span>{experience.currentJob ? "Sí" : "No"}</span>
                    </p>

                    <p className={styles.experienceField}>
                      Descripción: <span>{experience.description}</span>
                    </p>
                    <Card css={{ mw: "100%", marginBlock: "1rem" }}>
                      <Card.Body>
                        <Text h4>Referencia</Text>
                        <div className="referenceGrid">
                          <p className={styles.experienceField}>
                            Nombres: <span>{experience.nameRef}</span>
                          </p>
                          <p className={styles.experienceField}>
                            Número: <span>{experience.phoneRef}</span>
                          </p>
                          <p className={styles.experienceField}>
                            Email: <span>{experience.emailRef}</span>
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableListStaticData;
