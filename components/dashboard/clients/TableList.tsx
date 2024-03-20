import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Modal, Table, Text, useModal } from "@nextui-org/react";
import { EmployeeInterface, Experience, LangObject, ServiceInterface } from "../../../interfaces";
import styles from "../../../styles/admin/TableEmployee.module.css";
import { UserContext } from "../../../context/UserContext";
import Link from "next/link";
import { EmployeeApi } from "../../../apis/employee";
import { TokenContext } from "../../../context/CurrentToken";
import { Chip } from "@mui/material";
import { SelectEmployeeContext } from "../../../context/selectUser";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

type Props = {
  data: EmployeeInterface[];
  total?: string | number;
  offsetSliceValue: number;
  isReload?: () => void;
  pageNumber?: number;
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
  showPaginate?: boolean;
  getAllEmployees?: () => Promise<void>;
};

// interface IResponseApplication {
//   _id?: string;
//   employee: string;
//   service: string;
//   status: string;
//   __v?: number;
// }

const TableList = ({
  data,
  total,
  offsetSliceValue = 5,
  pageNumber,
  setPageNumber,
  showPaginate,
  isReload,
  getAllEmployees,
}: Props) => {
  const { setVisible, bindings } = useModal();
  // create another instance to useModal
  const { setVisible: setVisibleToDelete, bindings: bindingsToDelete } =
    useModal();
  const router = useRouter();

  const [currentEmployee, setCurrentEmployee] = useState<EmployeeInterface>(
    {} as EmployeeInterface
  );
  const [experienceUser, setExperienceUser] = useState<Experience[] | []>([]);
  const [lang, setLang] = useState<LangObject[] | []>([]);
  const [currentData, setcurrentData] = useState<EmployeeInterface[] | []>([]);
  const [initialSliceValue, setInitialSliceValue] = useState(0);
  const { userGlobal } = useContext(UserContext);
  const { privateToken } = useContext(TokenContext);
  const { selectEmployees, setSelectEmployees } = useContext(
    SelectEmployeeContext
  );
  const [currentLang, setCurrentLang] = useState<LangObject[] | []>([]);
  const [listServiceApply, setListServiceApply] = useState<
    ServiceInterface[] | []
  >([]);
  const [showModalToDelete, setShowModalToDelete] = useState(false);

  useEffect(() => {
    console.log(currentEmployee);
    if (currentData.length > 0) {
      EmployeeApi.get<EmployeeInterface>(`/employees/${currentEmployee.id}`, {
        headers: {
          Authorization: privateToken.token,
        },
      }).then((res) => {
        console.log({
          lang: res.data.languages,
        });
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
  }, [currentData, currentEmployee]);
  useEffect(() => {
    setcurrentData(data.slice(initialSliceValue, offsetSliceValue));
    console.log(currentData);
  }, [data, offsetSliceValue, initialSliceValue]);

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

  useEffect(() => {
    if (data.length > 0) {
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
    }
  }, [currentEmployee]);

  const isChecked = (employee: EmployeeInterface) => {
    const existEmployee = selectEmployees.find(
      (user) => user.id === employee.id
    );
    if (existEmployee) {
      return true;
    }
    return false;
  };

  const transformDate = (date: string) => {
    if (date) {
      const dateTransform = new Date(date);
      return dateTransform.toLocaleDateString();
    } else {
      return "No hay Datos";
    }
  };

  const deleteEmployee = (employee: EmployeeInterface) => {
    EmployeeApi.delete(`/employees/${employee.id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    }).then((res) => {
      console.log(res);
      setVisibleToDelete(false);
      setShowModalToDelete(false);
      // router.push("/admin");
      // isReload && isReload();
      getAllEmployees && getAllEmployees().then((res) => { 
        console.log({ res });
      });
      // call the toast to show the message success
      toast.success("Usuario eliminado exitosamente");
    });
  };

  return (
    <>
      <ToastContainer />

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
          <Table.Column>Fecha de Registro</Table.Column>
          <Table.Column>Nombres</Table.Column>
          <Table.Column>Tlf</Table.Column>
          <Table.Column>email</Table.Column>
          <Table.Column>País - Distrito</Table.Column>
          <Table.Column>Conocer más</Table.Column>
          <Table.Column>Acciones</Table.Column>
        </Table.Header>
        <Table.Body>
          {data.map((user: EmployeeInterface) => {
            return (
              <Table.Row key={user.id}>
                <Table.Cell>
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={isChecked(user)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => handleSelect(user)}
                  />
                </Table.Cell>
                <Table.Cell>{transformDate(user.createdAt || "")}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.country} - {user.district}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="bg-blue-500 px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ease text-white"
                    onClick={() => {
                      setVisible(true);
                      setCurrentEmployee(user);
                    }}
                  >
                    <span>Ver información</span>
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="px-3 py-2 text-sm text-slate-50 rounded-xl shadow-md text-whit font-semibold bg-red-500 hover:bg-red-700 transition ease"
                    onClick={() => {
                      setVisibleToDelete(true);
                      setCurrentEmployee(user);
                    }}
                  >
                    Eliminar
                  </button>
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
            {currentEmployee.name} {currentEmployee.surnames} /{" "}
            <span className="text-md text-slate-900">
              id:{currentEmployee.id}
            </span>
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
              <ul style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindingsToDelete}
      >
        <Modal.Header>
          <Text id="modal-title" size={24} className={styles.title}>
            ¿Seguro de Eliminar este usuario ?
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full text-center">
            <div className="w-full fles justify-center items-center flex-col ">
              <strong>Nombre / Email:</strong>
              <p>
                {currentEmployee.name} - {currentEmployee.email}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            onClick={() => deleteEmployee(currentEmployee)}
          >
            Sí, ELiminar
          </Button>
        </Modal.Footer>
      </Modal>

      {showPaginate && (
        <div className="flex gap-3 items-center justify-center mt-5">
          {pageNumber!! >= 1 && (
            <button
              onClick={() => setPageNumber!!(pageNumber!! - 1)}
              className="w-[40px] rounded-full shadow-xl h-[40px] bg-slate-100 hover:bg-slate-200 transition ease font-bold flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m15.75 19.5-7.5-7.5 7.5-7.5"
                />
              </svg>
            </button>
          )}
          <button className="w-[40px] rounded-full shadow-xl h-[40px] bg-slate-100 hover:bg-slate-200 transition ease font-bold flex justify-center items-center">
            <span>{pageNumber}</span>
          </button>
          <button
            onClick={() => setPageNumber!!(pageNumber!! + 1)}
            className="w-[40px] rounded-full shadow-xl h-[40px] bg-slate-100 hover:bg-slate-200 transition ease font-bold flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default TableList;

