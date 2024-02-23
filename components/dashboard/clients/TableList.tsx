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

type Props = {
  data: EmployeeInterface[];
  total?: string | number;
  offsetSliceValue: number;
  pageNumber?: number;
  setPageNumber?: React.Dispatch<React.SetStateAction<number>>;
};

// interface IResponseApplication {
//   _id?: string;
//   employee: string;
//   service: string;
//   status: string;
//   __v?: number;
// }

const TableList = ({ data, total, offsetSliceValue = 5, pageNumber, setPageNumber }: Props) => {
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
          <Table.Column>Nombres</Table.Column>
          <Table.Column>Tlf</Table.Column>
          <Table.Column>email</Table.Column>
          <Table.Column>País - Distrito</Table.Column>
          <Table.Column>Conocer más</Table.Column>
        </Table.Header>
        <Table.Body>
          {data.map((user: EmployeeInterface) => {
            return (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.phone}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.country} - { user.district }</Table.Cell>
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
              <p>{currentEmployee.country}</p>
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
              <strong>¿Ha aplicado a alguna posición laboralmente anteriormente con nosotros?</strong>
              <p>{currentEmployee.servicesId?.length! > 0 ? "Sí" : "No"}</p>
            </div>
            {/* <div className={styles.field}>
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
            </div> */}
          </div>
          {/* <div className={styles.field}>
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
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
    </>
  );
};

export default TableList;

