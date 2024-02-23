import React, { SetStateAction, useState, useEffect, useContext } from "react";
import { NextPage } from "next";
import { EmployeeInterface, Experience } from "../../interfaces";
import styles from "../../styles/employees/Experience.module.css";
import dynamic from "next/dynamic";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CountryType, countriesDataMaterial } from "../../interfaces/countries";
import {
  Area,
  dataListActivities,
  nivelExperience as NivelExp,
  subArea,
} from "../../utils/activitiesToBussiness";
import { ToastContainer, toast } from "react-toastify";

import { DateValidationError } from "@mui/x-date-pickers";
import { Checkbox, Box, Button, Switch } from "@mui/material";
import dayjs from "dayjs";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { BeatLoader } from "react-spinners";
import { EmployeeApi } from "../../apis/employee";

import { Notify } from "../../utils";
import { useRouter } from "next/router";
import { TokenContext } from "../../context/CurrentToken";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import Cookies from "js-cookie";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

const TextField = dynamic(() =>
  import("@mui/material/TextField").then((res) => res.default)
);

const initialCurrent = {
  nameCompany: "",
  activityCompany: "",
  positionJob: "",
  nivelExperience: "",
  areaPosition: "",
  subAreaPosition: "",
  country: "",
  startJob: "",
  finalJob: "",
  currentJob: false,
  refBoss: "",
  refCountryBoss: "",
  refEmailBoss: "",
  refNumberBoss: "",
  descriptionJob: "",
};

interface Prop {
  openExperience?: () => void;
  dataListExperiences?: Experience[] | [];
  setDataListExperiences?: React.Dispatch<SetStateAction<[] | Experience[]>>;
  editMode?: boolean;
  currentExperience?: Experience;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveModalRegisterDone: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  idEmployee: string;
}

interface EmpProp {
  employee: EmployeeInterface | null;

}

export interface activityI {
  id: string;
  value: string;
}
const startOfQ12022 = dayjs("2022-01-01T00:00:00.000");
const endOfQ12022 = dayjs("2022-03-31T23:59:59.999");

const RegisterExperience: NextPage<Prop> = ({
  dataListExperiences = [],
  openExperience,
  setDataListExperiences,
  currentExperience,
  editMode,
  setEditMode,
  setNextStep,
  setActiveModalRegisterDone,
  token, 
  idEmployee
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [idEmployee, setIdEmployee] = useState("");
  const [switchCurrentJob, setSwitchCurrentJob] = useState(
    currentExperience?.currentJob || false
  );
  const router = useRouter();
  const { privateToken } = useContext(TokenContext);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
 

  const notifySuccess = (message: string) => {
    return toast.success(message);
  };
  const [tokenValue, setTokenValue] = useState("");
  const [employeeOne, setEmployeeOne] = useState({} as EmployeeInterface)

  useEffect(() => {
   
    console.log({
      token,
      idEmployee
    })
  
    // console.log({
    //   path: `${process.env.NEXT_PUBLIC_API_URL}/experiences/${idEmployee}`,
    // });
  }, []);


  const { errors, touched, getFieldProps, values, handleChange } = useFormik({
    initialValues: {
      nameCompany: currentExperience?.nameBussiness || "",
      activityCompany: currentExperience?.activytyBussiness || "",
      positionJob: currentExperience?.title || "",
      nivelExperience: currentExperience?.level || "",
      areaPosition: currentExperience?.area || "",
      subAreaPosition: currentExperience?.subarea || "",
      country: currentExperience?.country || "",
      startJob: currentExperience?.dateStart || "",
      dateEnd: currentExperience?.dateEnd || "",
      currentJob: true,
      refBoss: currentExperience?.nameRef || "",
      refCountryBoss: currentExperience?.countryRef || "",
      refEmailBoss: currentExperience?.emailRef || "",
      refNumberBoss: currentExperience?.phoneRef || "",
      descriptionJob: currentExperience?.description || "",
    },
    onSubmit: (values) => {
      //  setIsLoading(true);
      console.log({ values });
    },
    validationSchema: Yup.object({
      nameCompany: Yup.string().required("Requerido"),
      activityCompany: Yup.string().required("Requerido"),
      positionJob: Yup.string().required("Requerido"),
      nivelExperience: Yup.string().required("Requerido"),
      areaPosition: Yup.string().required("Requerido"),
      subAreaPosition: Yup.string().required("Requerido"),
      country: Yup.string().required("Requerido"),
      countryJob: Yup.string().required("Requerido"),
      startJob: Yup.string().required("Requerido"),
      currentJob: Yup.boolean().required("Requerido"),
      refEmailBoss: Yup.string().email("Debe de ser un email"),
      descriptionJob: Yup.string().required("Requerido"),
    }),
  });
  const {
    activityCompany,
    areaPosition,
    country,
    currentJob,
    descriptionJob,
    dateEnd,
    nameCompany,
    nivelExperience,
    positionJob,
    refBoss,
    refCountryBoss,
    refEmailBoss,
    refNumberBoss,
    startJob,
    subAreaPosition,
  } = values;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      [
        activityCompany,
        areaPosition,
        country,
        descriptionJob,
        nameCompany,
        positionJob,
        nivelExperience,
        startJob,
        subAreaPosition,
      ].includes("")
    ) {
      setIsLoading(false);
      Notify.notifyWarning(
        "Existen algunos campos vacíos que son requeridos..."
      );
      return;
    }

    const dataForm = {
      title: positionJob || "",
      nameBussiness: nameCompany || "",
      activyBussiness: activityCompany || "",
      description: descriptionJob || "",
      area: areaPosition || "",
      subarea: subAreaPosition || "",
      country: country || "",
      level: nivelExperience || "",
      dateStart: startJob,
      // dateEnd: currentJob ? "--" : dateEnd || "",
      dateEnd: dateEnd,
      currentJob: switchCurrentJob,
      employee: idEmployee,
      nameRef: refBoss || "",
      emailRef: refEmailBoss || "",
      countryRef: refCountryBoss || "",
      phoneRef: refNumberBoss || "",
    };
   
    
    EmployeeApi.post(`/experiences/${idEmployee}`, dataForm, {
      headers: {
        Authorization: token,
      },
    })
      .then((res: any) => {
        notifySuccess("Se ha guardado la experiencia...");
        setIsLoading(false);
        if (setDataListExperiences) {
          setDataListExperiences([...dataListExperiences, res]);
        }
        setActiveModalRegisterDone(true);
        // setTimeout(() => {
        //   // openExperience();
        //   router.reload();
        // }, 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        Notify.notifyError("Hubo un error, pruebe más tarde...");
        console.log({ err });
      });
      };

  const [error, setError] = React.useState<DateValidationError | null>(null);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case "maxDate":
      case "minDate": {
        return "Please select a date in the first quarter of 2022";
      }
      case "invalidDate": {
        return "Your date is not valid";
      }
      default: {
        return "";
      }
    }
  }, [error]);

  const closeEditMode = () => {
    if (setEditMode) {
      setEditMode(false);
    }
  };

  return (
    <form className={styles.formGrid} onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="experienceHead">
        <span
          className="cursor-pointer flex items-center gap-2"
          onClick={() => setNextStep(false)}
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          atrás
        </span>
        <h1 className={styles.title}>
          {editMode ? "Editar" : "Añade una nueva Experiencia"}
        </h1>
        {/* <div className={styles.boxClose}>
          <CloseIcon
            onClick={editMode ? closeEditMode : openExperience}
            className={styles.svg}
          />
        </div> */}
      </div>
      <div className={styles.formBody}>
        <div className={styles.field}>
          <TextField
            id="outlined-basic"
            label="Nombre de la empresa"
            type="text"
            variant="outlined"
            sx={{ width: "100%" }}
            size="small"
            {...getFieldProps("nameCompany")}
          />
          {errors.nameCompany && touched.nameCompany && (
            <span className="text-danger ">{errors.nameCompany} </span>
          )}
        </div>
        <div className={styles.field}>
          <input
            list="activity"
            placeholder="Actividad de la empresa"
            className={styles.activeData}
            style={{
              border: "1px solid #b1afaffc",
              outline: "none",
              borderRadius: "4px",
            }}
            {...getFieldProps("activityCompany")}
          />
          <datalist id="activity">
            {dataListActivities.map((c: activityI) => {
              return (
                <option key={c.id} value={c.value}>
                  <p>{c.value}</p>
                </option>
              );
            })}
          </datalist>
          {errors.activityCompany && touched.activityCompany && (
            <span className="text-danger ">{errors.activityCompany} </span>
          )}
        </div>
        <div className={styles.field}>
          <TextField
            id="outlined-basic"
            label="Puesto"
            type="text"
            variant="outlined"
            sx={{ width: "100%" }}
            size="small"
            {...getFieldProps("positionJob")}
          />
          {errors.positionJob && touched.positionJob && (
            <span className="text-danger ">{errors.positionJob} </span>
          )}
        </div>
        <div className={styles.field}>
          <input
            list="nivelExp"
            placeholder="Nivel de experiencia"
            className={styles.activeData}
            style={{
              border: "1px solid #b1afaffc",
              outline: "none",
              borderRadius: "4px",
            }}
            {...getFieldProps("nivelExperience")}
          />
          <datalist id="nivelExp">
            {NivelExp.map((c: activityI) => {
              return (
                <option key={c.id} value={c.value}>
                  <p>{c.value}</p>
                </option>
              );
            })}
          </datalist>
          {errors.nivelExperience && touched.nivelExperience && (
            <span className="text-danger ">{errors.nivelExperience} </span>
          )}
        </div>
        <div className={styles.field}>
          <input
            list="areaJob"
            placeholder="Área del Puesto"
            className={styles.activeData}
            style={{
              border: "1px solid #b1afaffc",
              outline: "none",
              borderRadius: "4px",
            }}
            {...getFieldProps("areaPosition")}
          />
          <datalist id="areaJob">
            {Area.map((c: activityI) => {
              return (
                <option key={c.id} value={c.value}>
                  <p>{c.value}</p>
                </option>
              );
            })}
          </datalist>
          {errors.areaPosition && touched.areaPosition && (
            <span className="text-danger ">{errors.areaPosition} </span>
          )}
        </div>
        <div className={styles.field}>
          <input
            list="subareaJob"
            placeholder="Subárea"
            className={styles.activeData}
            style={{
              border: "1px solid #b1afaffc",
              outline: "none",
              borderRadius: "4px",
            }}
            {...getFieldProps("subAreaPosition")}
          />
          <datalist id="subareaJob">
            {subArea.map((c: activityI) => {
              return (
                <option key={c.id} value={c.value}>
                  <p>{c.value}</p>
                </option>
              );
            })}
          </datalist>
          {errors.subAreaPosition && touched.subAreaPosition && (
            <span className="text-danger ">{errors.subAreaPosition} </span>
          )}
        </div>
        <div className={styles.field}>
          <input
            list="countries"
            placeholder="País"
            className={styles.activeData}
            style={{
              border: "1px solid #b1afaffc",
              outline: "none",
              borderRadius: "4px",
            }}
            {...getFieldProps("country")}
          />
          <datalist id="countries">
            {countriesDataMaterial.map((c: CountryType) => {
              return (
                <option key={c.id} value={c.value}>
                  <p>({c.code})</p>
                </option>
              );
            })}
          </datalist>

          {errors.country && touched.country && (
            <span className="text-danger ">{errors.country} </span>
          )}
        </div>
        <div className={styles.fieldSecond}>
          <div className={styles.fieldSecondaryGrid}>
            <div className={styles.fieldSecond}>
              <label htmlFor="">
                Fecha de Inicio <span className="text-red-500">(Obligatorio*)</span>
              </label>
              <TextField
                id="startJob"
                type="date"
                variant="outlined"
                sx={{ width: "100%" }}
                size="small"
                {...getFieldProps("startJob")}
              />

              {errors.startJob && touched.startJob && (
                <span className="text-danger" style={{ color: "#990033" }}>
                  {errors.startJob}{" "}
                </span>
              )}
            </div>
            <div className={styles.fieldSecondary}>
              {/* <Checkbox {...getFieldProps("currentJob")} />{" "} */}
              <Switch
                value={true}
                checked={switchCurrentJob}
                onChange={(e) => {
                  console.log(e);
                  setSwitchCurrentJob(!switchCurrentJob);
                }}
              />
              <span>Actualmente trabajo aquí.</span>
            </div>
            <div className={styles.fieldSecond}>
              <label htmlFor="">Fecha de Finalización</label>
              <TextField
                id="dateEnd"
                type="date"
                variant="outlined"
                sx={{ width: "100%" }}
                size="small"
                {...getFieldProps("dateEnd")}
              />

              {errors.dateEnd || touched.dateEnd || (
                <span className="text-danger ">{errors.dateEnd} </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.referenceField}>
          <div className={styles.titleReference}>
            <h5>
              Añade una referencia <span>(INFORMACIÓN OPCIONAL)</span>
            </h5>
          </div>
          <div className={styles.field}>
            <TextField
              id="outlined-basic"
              label="Nombre de la Persona"
              type="text"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
              {...getFieldProps("refBoss")}
            />
            {errors.refBoss && touched.refBoss && (
              <span className="text-danger ">{errors.refBoss} </span>
            )}
          </div>
          <div className={styles.field}>
            <TextField
              id="outlined-basic"
              label="Email Corporativo"
              type="text"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
              {...getFieldProps("refEmailBoss")}
            />
            {errors.refEmailBoss && touched.refEmailBoss && (
              <span className="text-danger ">{errors.refEmailBoss} </span>
            )}
          </div>{" "}
          <div className={styles.field}>
            <TextField
              id="outlined-basic"
              label="Número telefónico"
              type="number"
              variant="outlined"
              sx={{ width: "100%" }}
              size="small"
              {...getFieldProps("refNumberBoss")}
            />
            {errors.refNumberBoss && touched.refNumberBoss && (
              <span className="text-danger ">{errors.refNumberBoss} </span>
            )}
          </div>{" "}
          <div className={styles.field}>
            <input
              list="countriesBoss"
              placeholder="País"
              className={styles.activeData}
              style={{
                border: "1px solid #b1afaffc",
                outline: "none",
                borderRadius: "4px",
              }}
              {...getFieldProps("refCountryBoss")}
            />
            <datalist id="countriesBoss">
              {countriesDataMaterial.map((c: CountryType) => {
                return (
                  <option key={c.id} value={c.value}>
                    <p>({c.code})</p>
                  </option>
                );
              })}
            </datalist>

            {errors.refCountryBoss && touched.refCountryBoss && (
              <span className="text-danger ">{errors.refCountryBoss} </span>
            )}
          </div>
        </div>
        <div className={styles.fieldTextArea}>
          <h5>Descripción del puesto:</h5>
          <TextareaAutosize
            maxRows={4}
            className="border border-gray-700"
            style={{ width: "100%", padding: ".54rem", minHeight: "100px" }}
            {...getFieldProps("descriptionJob")}
          />
          {errors.descriptionJob && touched.descriptionJob && (
            <span className="text-danger ">{errors.descriptionJob} </span>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-900 text-white rounded-lg flex justify-center items-center"
      >
        {isLoading ? <BeatLoader color="#fff" /> : "Terminar registro"}
      </button>
      {/*  <Button variant="contained" disableElevation type="submit">
        {isLoading ? <BeatLoader color="#fff" /> : "Guardar"}
      </Button> */}
    </form>
  );
};

export default RegisterExperience;

