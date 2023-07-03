import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/employees/FormNewSkills.module.css";
import {
  HabilitiesInNivelsExperience,
  HabilitiesInTimeExperienceYears,
  levels,
  Years,
} from "../../utils/activitiesToBussiness";
import DatalistInput from "react-datalist-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createKnoledge } from "../../apis/knoledges/useKnoledges";
import { KnoledgeInterface } from "../../interfaces";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import { Loading } from "@nextui-org/react";
import { Button } from "@mui/material";
import { TokenContext } from "../../context/CurrentToken";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);
const ButtonPrimary = dynamic(() =>
  import("../buttons/Button").then((res) => res.default)
);

interface Prop {
  openSkill: () => void;
  idEmployee: string;
  knoledgesList: [] | KnoledgeInterface[];
  setKnoledgesList: React.Dispatch<
    React.SetStateAction<[] | KnoledgeInterface[]>
  >;
}

const FormNewSkills = ({
  openSkill,
  idEmployee,
  knoledgesList,
  setKnoledgesList,
}: Prop) => {
  const [expValue, setExpValue] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [expYears, setExpYears] = useState(false);
  const [expLevel, setExpLevel] = useState(false);
  const [yearsValue, setYearsValue] = useState("");
  const [levelValue, setLevelValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const notifyError = () => toast.error("Todos los campos son obligatorios");
  const notifySuccess = () =>
    toast.success("Se ha agregado un nueva Habilidad 👍");
  const { privateToken } = useContext(TokenContext);

  useEffect(() => {
    if (optionValue === "Por años de experiencia") {
      setExpYears(true);
      setExpLevel(false);
    }
    if (optionValue === "Por niveles") {
      setExpYears(false);
      setExpLevel(true);
    }
  }, [optionValue]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (expValue === "") {
      console.log("todos los campos son oblogatorios");
      setError(true);
      notifyError();
      return;
    }
    setIsLoading(true);
    createKnoledge(
      "knoledge",
      idEmployee,
      {
        name: expValue,
        employee: idEmployee,
        level: expYears ? yearsValue : levelValue,
      },
      privateToken.token
    ).then((res) => {
      notifySuccess();
      setIsLoading(false);
      setExpValue("");
      setOptionValue("");
      setExpYears(false);
      setExpLevel(false);
      setKnoledgesList([...knoledgesList, res]);
    });
  };

  const options = [
    {
      id: uuidv4(),
      value: "Por años de experiencia",
    },
    {
      id: uuidv4(),
      value: "Por niveles",
    },
  ];

  // formik

  return (
    <form className={styles.formNewSkill} onSubmit={onSubmit}>
      <div className={styles.boxClose}>
        <CloseIcon onClick={openSkill} className={styles.svg} />
      </div>
      <h1>Añade una nueva Habilidad</h1>
      <ToastContainer />
      <div className={styles.field}>
        <DatalistInput
          placeholder=""
          label="Elige que tipo de habilidades deseas agregar"
          onSelect={(item) => setOptionValue(item.value)}
          items={options}
          value={optionValue}
        />
        {expYears && (
          <>
            <DatalistInput
              placeholder="Call center"
              label="Elige una opción"
              onSelect={(item) => setExpValue(item.value)}
              items={HabilitiesInTimeExperienceYears}
              value={expValue}
            />
            <DatalistInput
              placeholder="1"
              label="Años en esta experiencia"
              onSelect={(item) => setYearsValue(item.value)}
              items={Years}
              value={yearsValue}
            />
          </>
        )}

        {expLevel && (
          <>
            <DatalistInput
              placeholder="Microsoft Office"
              label="Elige una habilidad"
              onSelect={(item) => setExpValue(item.value)}
              items={HabilitiesInNivelsExperience}
              value={expValue}
            />
            <DatalistInput
              placeholder="Básico"
              label="Añadir el nivel"
              onSelect={(item) => setLevelValue(item.value)}
              items={levels}
              value={levelValue}
            />
          </>
        )}

        {/* <ButtonPrimary
          color="dark"
          content="Guardar"
          onClick={() => console.log("guardando skills")}
          type="submit"
        />
        <div className="field" style={{ marginBlock: "1rem" }}>
          {isLoading && <Loading />}
        </div> */}
        <Button type="submit" variant="contained" style={{ margin: 0 }}>
          {isLoading && <Loading />}
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default FormNewSkills;
