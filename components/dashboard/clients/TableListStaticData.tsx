import React, { useState, useEffect, useContext, ReactNode } from "react";
import { Button, Card, Modal, Table, Text, useModal } from "@nextui-org/react";
import { EmployeeInterface, Experience, LangObject } from "../../../interfaces";
import styles from "../../../styles/admin/TableEmployee.module.css";
import DropDownSelect from "../../buttons/DrownDownSelect";
import ResponseUserByEmail from "../../buttons/ResponseUserByEmail";
import { UserContext } from "../../../context/UserContext";
import Link from "next/link";
import { EmployeeApi } from "../../../apis/employee";
import { TokenContext } from "../../../context/CurrentToken";
import { Chip } from "@mui/material";
import { CurrentLangContext } from "../../../context/CurrentLang";
import {
  getExperienceByEmployee,
  getSalaryEmployeeToPosition,
} from "../../../apis/experience/useFecthExperience";
import { formatDateUser } from "../../../helpers/formatDateUser";
import { EmployeeJobApi } from "../../../apis/employeeJob";
import SkillsByUserPills from "../../pills/SkillsByUserPills";
import { SelectEmployeeContext } from "../../../context/selectUser";

type Props = {
  data: EmployeeInterface[];
  total?: string | number;
  offsetSliceValue: number;
  idService: string;
  supervisor?: string;
};

interface SkillProp {
  employee: string;
  level: string;
  name: string;
  __v?: number;
  _id?: string;
}

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
  const [currentSelectUser, setCurrentSelectUser] = useState<
    EmployeeInterface[] | []
  >([]);
  const { selectEmployees, setSelectEmployees } = useContext(
    SelectEmployeeContext
  );
  const [experienceUser, setExperienceUser] = useState<Experience[] | []>([]);
  const [lang, setLang] = useState<LangObject[] | []>([]);
  const [currentData, setcurrentData] = useState<EmployeeInterface[] | []>([]);
  const [initialSliceValue, setInitialSliceValue] = useState(0);
  const { userGlobal } = useContext(UserContext);
  const { privateToken } = useContext(TokenContext);
  const [currentLang, setCurrentLang] = useState<LangObject[] | []>([]);
  const [currentSkills, setCurrentSkills] = useState<SkillProp[] | []>([]);
  const [fieldSalary, setFieldSalary] = useState(false);
  const [infoSalary, setInfoSalary] = useState({
    type: "",
    jornada: "",
    salary: "",
  });

  useEffect(() => {
    if (currentData.length > 0) {
      EmployeeJobApi.get(
        `/employeeJob/getinfo?idUser=${currentEmployee.id}&idService=${idService}`
      ).then((res) => {
        console.log({ employeeJobStatus: res });
      });
      EmployeeApi.get<EmployeeInterface>(`/employees/${currentEmployee.id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        console.log({ res });
        setExperienceUser(res.data.experiences || []);
        setLang(res.data.languages || []);
        setCurrentLang(res.data.languages || []);
      });

      // current employeeJobStatus
      getExperienceByEmployee(
        "get-applications-jobs",
        currentEmployee.id || "",
        privateToken.token
      ).then((res) => {});

      console.log({
        idService,
        idEmployee: currentEmployee.id || "",
      });

      getSalaryEmployeeToPosition(currentEmployee.id || "", idService).then(
        (res) => {
          if (res.length > 0) {
            setFieldSalary(true);
            setInfoSalary(res[0]);
          } else {
            setFieldSalary(false);
          }
          console.log({ resSalary: res });
        }
      );

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
    //console.log({currentEmployee})
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
        setCurrentSkills(res.data.skills || []);
      });

      // get skill by user
      EmployeeApi.get(`/knoledge/${currentData[0].id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        // console.log(res.data);
      });
      // get user information
    }
  }, [currentData]);
  useEffect(() => {
    setcurrentData(data.slice(initialSliceValue, offsetSliceValue));
    console.log({ data, offsetSliceValue, initialSliceValue });
  }, [data, offsetSliceValue, initialSliceValue]);

  const changeStatusJob = async (idJob: string, idEmployee: string) => {
    console.log({ message: "change status", idJob, idEmployee });
    EmployeeApi.put(`/employees/status-job/${idJob}/${idEmployee}`, {
      status: "VISTO",
    });
  };

  const handleSelect = (employee: EmployeeInterface) => {
    //if exist employee not add to array
    const existEmployee = selectEmployees.find(
      (user) => user.id === employee.id
    );
    if (!existEmployee) {
      setSelectEmployees([...selectEmployees, employee]);
    } else {
      setSelectEmployees(
        selectEmployees.filter((user) => user.id !== employee.id)
      );
    }
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
          <Table.Column>ID</Table.Column>
          <Table.Column>Nombre</Table.Column>
          <Table.Column>Tlf</Table.Column>
          <Table.Column>email</Table.Column>
          <Table.Column>Conocer más</Table.Column>
          <Table.Column>Estado</Table.Column>
          <Table.Column>Respuesta</Table.Column>
        </Table.Header>
        <Table.Body>
          {currentData.map((user: EmployeeInterface) => {
            return (
              <Table.Row key={user.id}>
                <Table.Cell>
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => handleSelect(user)}
                  />
                </Table.Cell>
                <Table.Cell>{user.name} </Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="primary"
                    auto
                    className="bg-blue-500 text-white"
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
                <Table.Cell>
                  <ResponseUserByEmail
                    key={user.id}
                    idService={idService}
                    idUser={user.id || ""}
                    statusUser={user.statusJob || ""}
                  />
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
                  className="bg-gray-700 hover:bg-gray-900 text-white"
                  style={{ marginBlock: "1rem" }}
                >
                  <Link href={currentEmployee.linkedin || ""} target="_blank">
                    {currentEmployee.linkedin
                      ? "linkedin"
                      : "no tiene linkedin"}
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
                className="bg-slate-700 hover:bg-slate-900 text-white"
                style={{ marginBlock: "1rem" }}
              >
                <Link href={currentEmployee.github || ""} target="_blank">
                  {currentEmployee.github ? "abrir github" : "no tiene github"}
                </Link>
              </Button>
            </div>
            <div className={styles.field}>
              <strong>Cv:</strong>
              <Button
                color="primary"
                auto
                size="sm"
                className="bg-slate-700 hover:bg-slate-900 text-white"
                style={{ marginBlock: "1rem" }}
                onClick={() =>
                  changeStatusJob(idService, currentEmployee.id || "")
                }
              >
                <Link href={currentEmployee.cv || ""} target="_blank">
                  {currentEmployee.cv ? "abrir cv" : "no tiene cv"}
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
            <strong>Habilidades:</strong>
            <div className="flex gap-2 items-center flex-wrap">
              {<SkillsByUserPills id={currentEmployee.id || ""} />}
            </div>
          </div>
          {fieldSalary && (
            <div className="">
              <h5>Información adicional</h5>
              <strong>Pregunta: ¿Cuál es su pretención salarial?</strong>
              <p>
                Respuesta: {infoSalary.type === "USD" ? "$." : "S./"}
                {infoSalary.salary} -{" "}
                {infoSalary.jornada === "mensual" ? "Mensual" : "x Hora"}
              </p>
            </div>
          )}
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
                        {formatDateUser(experience.dateStart || "")} //{" "}
                        {experience.dateEnd
                          ? formatDateUser(experience.dateEnd || "")
                          : ""}
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

