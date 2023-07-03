import React, { useEffect, useState, useContext } from "react";
import DatalistInput from "react-datalist-input";
import styles from "../../styles/admin/ModalFilter.module.css";
import { v4 as uuidv4 } from "uuid";
import { Languages, nivels, skills } from "../../utils/activitiesToBussiness";
import ButtonPrimary from "../buttons/Button";
import { EmployeeInterface } from "../../interfaces";
import {
  getEmployeeByFilterHability,
  getEmployeeFilterByLanguage,
  searchEmployeeByFilter,
} from "../../apis/employee/useEmployeeFetch";
import useForm from "../../hooks/useForm";
import dynamic from "next/dynamic";
import { TokenContext } from "../../context/CurrentToken";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  setShowModalFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setEmployeeData: React.Dispatch<React.SetStateAction<EmployeeInterface[]>>;
  setDataList: React.Dispatch<React.SetStateAction<EmployeeInterface[] | []>>;
}

const options = [
  { id: uuidv4(), value: "idiomas" },
  { id: uuidv4(), value: "habilidades y/o conocimientos" },
  { id: uuidv4(), value: "email" },
  { id: uuidv4(), value: "dni" },
  { id: uuidv4(), value: "estado" },
];

const optionStatusJob = [
  { id: uuidv4(), value: "DESCARTADO" },
  { id: uuidv4(), value: "SELECCIONADO" },
  { id: uuidv4(), value: "CONTRATADO" },
];

const ModalFilter = ({
  setShowModalFilters,
  setEmployeeData,
  setDataList,
}: Prop) => {
  const [mainValue, setMainValue] = useState("");
  const [showLangInput, setShowLangInput] = useState(false);
  const [lang, setLang] = useState("");
  const [nivelLang, setNivelLang] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [skillValue, setSkillValue] = useState("");
  const [dniState, setDniState] = useState(false);
  const [emailState, setEmailState] = useState(false);
  const [stateJobState, setStateJobState] = useState(false);
  const [statusJob, setStatusJob] = useState("");
  const { privateToken } = useContext(TokenContext);

  const { dni, email, onChange } = useForm({
    email: "",
    dni: "",
  });

  useEffect(() => {
    switch (mainValue) {
      case "idiomas":
        setShowLangInput(true);
        setShowSkillInput(false);
        setDniState(false);
        setEmailState(false);
        setStateJobState(false);
        break;
      case "habilidades y/o conocimientos":
        setShowSkillInput(true);
        setShowLangInput(false);
        setDniState(false);
        setEmailState(false);
        setStateJobState(false);
        break;
      case "dni":
        setDniState(true);
        setShowSkillInput(false);
        setShowLangInput(false);
        setEmailState(false);
        setStateJobState(false);
        break;
      case "email":
        setEmailState(true);
        setDniState(false);
        setShowSkillInput(false);
        setShowLangInput(false);
        setStateJobState(false);
        break;
      case "estado":
        setStateJobState(true);
        setEmailState(false);
        setDniState(false);
        setShowSkillInput(false);
        setShowLangInput(false);
        break;
      default:
        setShowLangInput(false);
        setShowSkillInput(false);
        setEmailState(false);
        setDniState(false);
        setStateJobState(false);
        break;
    }
  }, [mainValue]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showLangInput) {
      getEmployeeFilterByLanguage(
        "language",
        lang,
        nivelLang,
        privateToken.token
      ).then((res) => {
        const filterArr = res.filter((user: any) => user.employee !== null);
        const getEmployee = filterArr.map((user: any) => user.employee);
        setDataList(getEmployee);
        setEmployeeData(getEmployee);
      });
    }

    if (showSkillInput) {
      getEmployeeByFilterHability("knoledge", skillValue).then((res) => {
        let newArr = res.map((userResponse: any) => userResponse.employee);
        setEmployeeData(newArr);
        setDataList(newArr);
      });
    }
    if (dniState) {
      searchEmployeeByFilter("employees/search", "dni", dni).then((res) => {
        setEmployeeData(res);
        setDataList(res);
      });
    }

    if (statusJob) {
      searchEmployeeByFilter("employees/search", "statusJob", statusJob).then(
        (res) => {
          setEmployeeData(res);
          setDataList(res);
        }
      );
    }

    if (email) {
      searchEmployeeByFilter("employees/search", "email", email).then((res) => {
        setEmployeeData(res);
        setDataList(res);
      });
    }
  };

  return (
    <form className={styles.modalFilterGrid} onSubmit={onSubmit}>
      <div className={styles.boxClose}>
        <CloseIcon
          onClick={() => setShowModalFilters((state) => !state)}
          className={styles.svg}
        />
      </div>
      <h1>Busca usuarios mediante filtros</h1>
      <div className={styles.container}>
        <DatalistInput
          className={styles.dataList}
          placeholder=""
          label="Elige las siguientes opciones:"
          onSelect={(item) => setMainValue(item.value)}
          items={options}
          value={mainValue}
        />
        {showLangInput && (
          <>
            <DatalistInput
              className={styles.dataList}
              placeholder=""
              label="Elige el idioma"
              onSelect={(item) => setLang(item.value)}
              items={Languages}
              value={lang}
            />
            <DatalistInput
              className={styles.dataList}
              placeholder=""
              label="Elige el nivel"
              onSelect={(item) => setNivelLang(item.value)}
              items={[...nivels, { id: uuidv4(), value: "todos" }]}
              value={nivelLang}
            />
          </>
        )}
        {showSkillInput && (
          <DatalistInput
            className={styles.dataList}
            placeholder=""
            label="Elige la habilidad"
            onSelect={(item) => setSkillValue(item.value)}
            items={skills}
            value={skillValue}
          />
        )}
        {dniState && (
          <input
            type="text"
            className={styles.input}
            placeholder="Escribe el número de identidad"
            value={dni}
            name="dni"
            onChange={onChange}
          />
        )}
        {emailState && (
          <input
            type="email"
            className={styles.input}
            placeholder="example@example.com"
            value={email}
            name="email"
            onChange={onChange}
          />
        )}
        {stateJobState && (
          <DatalistInput
            className={styles.dataList}
            placeholder=""
            label="Busca usuarios por su estado:"
            onSelect={(item) => setStatusJob(item.value)}
            items={optionStatusJob}
            value={statusJob}
          />
        )}
      </div>
      <ButtonPrimary color="dark" content="Buscar" type="submit" />
    </form>
  );
};

export default ModalFilter;
