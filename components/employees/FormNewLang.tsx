import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/employees/FormNewLang.module.css";
import { Languages, nivels } from "../../utils/activitiesToBussiness";
import { EmployeeInterface, LangResponse } from "../../interfaces";
import { createLang } from "../../apis/languages/useFetchLang";
import { Loading } from "@nextui-org/react";
import DatalistInput from "react-datalist-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import { TokenContext } from "../../context/CurrentToken";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  openLang: () => void;
  setStateListLang: (state: any) => void;
  stateListLang: LangResponse[] | [];
}

const FormNewLang = ({ openLang, setStateListLang, stateListLang }: Prop) => {
  const [idEmployee, setIdEmployee] = useState("");
  const [error, setError] = useState(false);
  const [formLang, setFormLang] = useState("");
  const [formOral, setFormOral] = useState("");
  const [formWriter, setFormWriter] = useState("");
  const [formListen, setFormListen] = useState("");
  const [formRead, setFormRead] = useState("");
  const notifyError = () => toast.error("Todos los campos son obligatorios");
  const notifySuccess = () =>
    toast.success("Se ha agregado un nuevo idioma 👍");
  const [isLoading, setIsLoading] = useState(false);
  const { privateToken } = useContext(TokenContext);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);

  useEffect(() => {
    let id: EmployeeInterface | null = null;
    id = JSON.parse(localStorage.getItem("employee") || "");
    setIdEmployee(employeeGlobal?.id || "");
  }, [idEmployee, formLang, formOral, formWriter]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ([formLang, formOral, formWriter, formListen, formRead].includes("")) {
      setError(true);
      notifyError();
      return;
    }
    setIsLoading(true);

    createLang(
      "language",
      idEmployee,
      {
        lang: formLang,
        levelOral: formOral,
        levelWriter: formWriter,
        levelRead: formRead,
        levelListen: formListen,
        idEmployee,
      },
      privateToken.token
    ).then((res) => {
      const existLang = stateListLang.find((l) => l._id === res._id);
      if (!existLang) {
        setStateListLang([...stateListLang, res]);
      }
      notifySuccess();
      setIsLoading(false);
      setTimeout(() => {
        openLang();
      }, 2000);
    });
  };

  return (
    <form className={styles.formLang} onSubmit={handleSubmit}>
      <h2>Agrea un nuevo idioma</h2>
      <ToastContainer />
      {/* <div className={styles.boxClose}>
        <CloseIcon onClick={openLang} className={styles.svg} />
      </div> */}
      <div className={styles.field}>
        <DatalistInput
          placeholder="Nombre del idioma"
          label="Selecciona porfavor el idioma"
          onSelect={(item) => setFormLang(item.value)}
          items={Languages}
        />
      </div>
      <div className={styles.field}>
        <DatalistInput
          placeholder="Seleccione el nivel"
          label=" Escritura"
          onSelect={(item) => setFormWriter(item.value)}
          items={nivels}
        />
      </div>
      <div className={styles.field}>
        <DatalistInput
          placeholder="Seleccione el nivel"
          label="Oral"
          onSelect={(item) => setFormOral(item.value)}
          items={nivels}
        />
      </div>
      <div className={styles.field}>
        <DatalistInput
          placeholder="Seleccione el nivel"
          label=" Escucha"
          onSelect={(item) => setFormListen(item.value)}
          items={nivels}
        />
      </div>
      <div className={styles.field}>
        <DatalistInput
          placeholder="Seleccione el nivel"
          label=" Lectura"
          onSelect={(item) => setFormRead(item.value)}
          items={nivels}
        />
      </div>
      <Button type="submit" variant="contained" style={{ margin: 0 }}>
        {isLoading && <Loading />}
        Guardar
      </Button>
    </form>
  );
};

export default FormNewLang;
