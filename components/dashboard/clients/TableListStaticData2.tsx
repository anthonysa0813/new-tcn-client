import React, { useState, useEffect, useContext, ReactNode } from "react";
import { Button, Card, Modal, Table, Text, useModal } from "@nextui-org/react";
import { EmployeeInterface, Experience, LangObject, ServiceInterface } from "../../../interfaces";
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
import DropDownMui from "../../buttons/DropDownMui";
// import { DropDownMui } from "../../buttons/DropDownMui";

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

const TableListStaticData2 = ({
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
   const [listServiceApply, setListServiceApply] = useState<
     ServiceInterface[] | []
   >([]);

  useEffect(() => {
    console.log({
      currentEmployee
    })
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
        setListServiceApply(res.data.service || []);
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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <p>ID</p>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Tlf
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Conocer más
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Respuesta
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user: EmployeeInterface) => {
              return (
                <tr
                  key={user.id}
                  className="border-b dark:border-gray-700 hover:bg-slate-100 transition ease"
                >
                  <td className="p-4 flex items-center gap-2">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onClick={() => handleSelect(user)}
                    />
                    <p className="font-semibold">{user.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">
                      {user.name} {user.surnames}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{user.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <Button
                      auto
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-900 text-white"
                      onClick={() => {
                        setCurrentEmployee(user);
                        setVisible(true);
                      }}
                    >
                      Ver más
                    </Button>
                  </td>
                  <td className="p-4">
                    {userGlobal.role === "ADMIN_ROLE" ? (
                      // <DropDownSelect
                      //   key={user.id}
                      //   idService={idService}
                      //   idUser={user.id || ""}
                      //   idJob={idService}
                      //   statusUser={user.statusJob || ""}
                      // />

                      <DropDownMui
                        key={user.id}
                        idService={idService}
                        idUser={user.id || ""}
                        idJob={idService}
                        statusUser={user.statusJob || ""}
                      />
                    ) : (
                      <span>{user.statusJob}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <ResponseUserByEmail
                      key={user.id}
                      idService={idService}
                      idUser={user.id || ""}
                      statusUser={user.statusJob || ""}
                    />
                  </td>
                  <td className="p-4">
                      <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-900 transition ease">Mandar a Spam</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
              <strong>País y Distrito:</strong>
              <p>
                {currentEmployee.country} - {currentEmployee.district}
              </p>
            </div>
            <div className={styles.field}>
              <strong>Dirección:</strong>
              <p className="text-sm">{currentEmployee.address || ""}</p>
            </div>
            <div className={styles.field}>
              <strong>Fecha de Nacimiento:</strong>
              <p>{currentEmployee.birthday}</p>
            </div>
            <div className={styles.field}>
              <strong>DNI:</strong>
              <p>{currentEmployee.dni}</p>
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
                  className={` text-white ${
                    currentEmployee.linkedin
                      ? "bg-gray-700 hover:bg-gray-900"
                      : "bg-gray-400"
                  }`}
                  style={{ marginBlock: "1rem" }}
                >
                  <Link href={currentEmployee.linkedin || ""} target="_blank">
                    {!currentEmployee.linkedin
                      ? "No tiene LinkedIn"
                      : "abrir linkedin"}
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
                className={` text-white ${
                  currentEmployee.github
                    ? "bg-gray-700 hover:bg-gray-900"
                    : "bg-gray-400"
                }`}
                style={{ marginBlock: "1rem" }}
              >
                <Link href={currentEmployee.github || ""} target="_blank">
                  {!currentEmployee.github ? "No tiene GitHub" : "abrir GitHub"}
                </Link>
              </Button>
            </div>
            <div className={styles.field}>
              <strong>Cv:</strong>
              <Button
                color="primary"
                auto
                size="sm"
                className={` text-white ${
                  currentEmployee.cv
                    ? "bg-gray-700 hover:bg-gray-900"
                    : "bg-gray-400"
                }`}
                style={{ marginBlock: "1rem" }}
              >
                <Link href={currentEmployee.cv || ""} target="_blank">
                  {!currentEmployee.cv ? "No tiene Cv" : "abrir Cv"}
                </Link>
              </Button>
            </div>
            <div className={styles.field}>
              <strong>¿Por cúal medio nos conoció?</strong>
              <p>{currentEmployee.findUssocial || ""}</p>
            </div>

            <div className={styles.field}>
              <strong>
                ¿Ha aplicado a alguna posición laboralmente anteriormente con
                nosotros?
              </strong>
              <p>{currentEmployee.servicesId?.length! > 0 ? "Sí" : "No"}</p>
            </div>
            <div className={styles.field}>
              <strong>Idiomas:</strong>
              <ul style={{ display: "flex", gap: "1rem" }}>
                {lang.map((lg) => {
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
            <strong className="font-semibold text-1xl">
              Puestos Postulados:
            </strong>
            {listServiceApply.map((service, index) => {
              return (
                <div key={index} className="flex gap-2 items-center">
                  <p>{service.title}</p>
                </div>
              );
            })}
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

      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default TableListStaticData2;

