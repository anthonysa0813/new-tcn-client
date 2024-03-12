
import React, { useEffect, useState, useContext } from "react";
import styles from "../../../styles/users/RegisterUser.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/dist/client/router";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../../context/EmployeeContext";
import dynamic from "next/dist/shared/lib/dynamic";
import { loginFetchApi } from "../../../helpers/useFetch";
import Cookies from "js-cookie";

import {
  CountryType,
  countriesDataMaterial,
} from "../../../interfaces/countries";
import DatalistInput from "react-datalist-input";
import FormExperienceSecondary from "../../../pages/employee/FormExperienceSecondary";
import RegisterExperience from "../../forms/RegisterExperience";
import { CurrentRegisterInfo } from "../../../context/CurrentRegisterInfo";

const FormControl = dynamic(() =>
  import("@mui/material/FormControl").then((res) => res.default)
);
const IconButton = dynamic(() =>
  import("@mui/material/IconButton").then((res) => res.default)
);
const InputAdornment = dynamic(() =>
  import("@mui/material/InputAdornment").then((res) => res.default)
);
const InputLabel = dynamic(() =>
  import("@mui/material/InputLabel").then((res) => res.default)
);
const OutlinedInput = dynamic(() =>
  import("@mui/material/OutlinedInput").then((res) => res.default)
);
const TextField = dynamic(() =>
  import("@mui/material/TextField").then((res) => res.default)
);
const Select = dynamic(() =>
  import("@mui/material/Select").then((res) => res.default)
);

const MenuItem = dynamic(() =>
  import("@mui/material/MenuItem").then((res) => res.default)
);

const Button = dynamic(() =>
  import("@mui/material/Button").then((res) => res.default)
);

const Tooltip = dynamic(() =>
  import("@mui/material/Tooltip").then((res) => res.default)
);

const BeatLoader = dynamic(() =>
  import("react-spinners/BeatLoader").then((res) => res.default)
);

const Visibility = dynamic(() =>
  import("@mui/icons-material/Visibility").then((res) => res.default)
);
const VisibilityOff = dynamic(() =>
  import("@mui/icons-material/VisibilityOff").then((res) => res.default)
);

const Link = dynamic(() => import("next/link").then((res) => res.default));

interface Prop {
  setActiveModalRegisterDone: React.Dispatch<React.SetStateAction<boolean>>;
}

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];


const RegisterForm = ({ setActiveModalRegisterDone }: Prop) => {
  const router = useRouter();
  const [isDesabled, setIsDesabled] = useState(false);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [cvValue, setCvValue] = useState("" as any);
  const [isLoading, setIsLoading] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [nextStep, setNextStep] = useState(false)
  const { formInfo, setFormInfo } = useContext(CurrentRegisterInfo);
  const [district, setDistrict] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [currentToken, setCurrentToken] = useState("");
  const [idEmployee, setIdEmployee] = useState("");
  const [currentSocial, setCurrentSocial] = useState("");

  const notifySuccess = (message: string) =>
    toast.success("Hemos enviado un correo para la activación de la cuenta");
  const notifyError = (message: string) => toast.error(message);

  const { errors, touched, getFieldProps, values, handleChange } = useFormik({
    initialValues: {
      name: "",
      surnames: "",
      email: "",
      password: "",
      country: "",
      phone: "",
      repeatPassword: "",
      social: "",
      dni: "",
    },
    onSubmit: (values) => {
      //  setIsLoading(true);
      let dataform = new FormData();
      dataform.append("name", values.name);
      dataform.append("surnames", values.surnames);
      dataform.append("email", values.email);
      dataform.append("password", values.password || "");
      // dataform.append("callingCode", callingCode || "");
      dataform.append("country", values.country || "");
      //  dataform.append("cv", cvValue);
      dataform.append("phone", values.phone || "");
      console.log("dataform", dataform);
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Requerido"),
      dni: Yup.string().required("Requerido"),
      surnames: Yup.string().required("Requerido"),
      email: Yup.string().email("Debe de ser un email").required("Requerido"),
      password: Yup.string().required("Requerido"),
      repeatPassword: Yup.string()
        .required("Requerido")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no son iguales"),
      country: Yup.string().required("Requerido"),
      phone: Yup.string().required("Requerido"),

      social: Yup.string().required("Requerido"),
    }),
  });

  const { country, email, name, password, phone, surnames, social, dni } = values;
  useEffect(() => {
    console.log({
      social: currentSocial
    })
  }, [currentSocial])
  


  useEffect(() => {
    if (
      [country, email, name, password, phone, surnames].includes("")
    ) {
      setFormInfo({
        name: name,
        lastName: surnames,
        email: email,
        password: password,
        phone: phone,
        cv: cvValue,
        country: country,
      });
      if (password.length > 0 && password.length > 0) {
        if (password === values.repeatPassword) {
          setIsDesabled(true);
        } else {
          console.log("no son iguales");
          setIsDesabled(false);
        }
      }
      setIsDesabled(true);
    } else {
      setIsDesabled(false);
    }
  }, [country, email, name, password, phone, surnames, cvValue, values.password, values.repeatPassword, currentSocial]);
  const sendData = async (dataObject: FormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/employees`, {
        method: "POST",
        body: dataObject,
      });
      const data = await res.json();
   
      if (data.message === "El email ya está registrado" || data.message === "El DNI ya está registrado") {
        notifyError(data.message);
        setIsLoading(false);
      } else {
        // setActiveModalRegisterDone(true);
        setIsLoading(false);
        loginFetchApi("auth/employee/login", {
          email: email,
          password: password,
        }).then((res) => {
          if (res.employee) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000); //
            setCurrentToken(res.token);
            console.log("res.employee", res.employee.id);
            setIdEmployee(res.employee.id);
            Cookies.set("token", res.token, { expires: expirationDate });
            Cookies.set("employee", JSON.stringify(res.employee), {
              expires: expirationDate,
            });
            Cookies.set("status", JSON.stringify(res.employee.status), {
              expires: expirationDate,
            });
          }
        });
        setActiveModalRegisterDone(true);
        setIsLoading(false);
        notifySuccess("Hemos enviado un correo para la activación de la cuenta");
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let dataform = new FormData();
    dataform.append("name", name);
    dataform.append("surnames", surnames);
    dataform.append("email", email);
    dataform.append("password", password || "");
    //  dataform.append("callingCode", callingCode || "");
    dataform.append("country", country || "");
    //  dataform.append("message", message || "");
    dataform.append("cv", cvValue);
    //  dataform.append("typeJob", typeJob || "");
    dataform.append("phone", phone || "");
    dataform.append("dni", dni || "");
    dataform.append("address", address || "");
    dataform.append("district", district || "");
    dataform.append("findUssocial", currentSocial || "");
    dataform.append("birthday", birthday || "");
    dataform.append("social", social || "");

    // setIsLoading(true);
    await sendData(dataform);
    // setNextStep(true);

  };

  const [valuesSupport, setValuesSupport] = useState({
    password: "",
    showPassword: false,
    showRepeatPassword: false,
  });

  const handleClickShowPassword = () => {
    setValuesSupport({
      ...valuesSupport,
      showPassword: !valuesSupport.showPassword,
    });
  };

  const handleClickShowRepeatPassword = () => {
    setValuesSupport({
      ...valuesSupport,
      showRepeatPassword: !valuesSupport.showRepeatPassword,
    });
  };

  const readInputTypeFile = (e: any) => {
    setCvValue(e.target.files[0]);
  };

   useEffect(() => {
     // apply function if the lenght dni value is greater than 7
     if (dni.length > 7) {
       // Reemplaza con el número de DNI que desees consultar

       // Construir la URL de la solicitud con el número de DNI
       const apiUrl = `${process.env.NEXT_PUBLIC_DB_URL}/employees/peruapis/${dni}`;
       // Configurar la solicitud GET
       const requestOptions = {
         method: "GET",
       };

       // Realizar la solicitud utilizando fetch
       fetch(apiUrl, requestOptions)
         .then((response) => {
           if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           return response.json();
         })
         .then(({ data }) => {
          // console.log("Respuesta de la API:", data);
           const separateName = data.fullname.split(",");
           if (separateName.length === 1) {
             const separateOnlyName = separateName[0].split(" ");
             const lastNamesConstruct = separateOnlyName[0] + " " + separateOnlyName[1];
             const nameConstruct = separateOnlyName[2];
            setDistrict(data.district);
            setBirthday(data.birth_date);
            setAddress(data.address);
             // set fullnames and fulllastname with the handlechange method
            handleChange("name")(nameConstruct);
            handleChange("surnames")(lastNamesConstruct);
           } else {   
             const fullNames = separateName[1];
            //  console.log({separateName})
            const fullLastName = separateName[0];
            setDistrict(data.district);
            setBirthday(data.birth_date);
            setAddress(data.address);
             // set fullnames and fulllastname with the handlechange method
            handleChange("name")(fullNames);
            handleChange("surnames")(fullLastName);
           }
         })
         .catch((error) => {
           console.error("Error al realizar la solicitud:", error.message);
         });
     }
   }, [dni]);

  return (
    <>
      {nextStep ? (
        <RegisterExperience
          editMode={false}
          setNextStep={setNextStep}
          setActiveModalRegisterDone={setActiveModalRegisterDone}
          idEmployee={idEmployee}
          token={currentToken}
        />
      ) : (
        <form
          className={`${styles.formContainer} dark:bg-white rounded-lg py-3 shadow-lg`}
          onSubmit={handleSubmit}
        >
          <div className={styles.wrapper}>
            <p className="text-gray-700">
              llena el formulario, postula y mantén el seguimiento a tus
              postulaciones.
            </p>
            <div className={styles.formContent}>
              <div className="w-full">
                <TextField
                  id="outlined-basic"
                  label="DNI / N° de Extranjería"
                  type="text"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  size="small"
                  {...getFieldProps("dni")}
                />
                {errors.dni && touched.dni && (
                  <span className="text-red-500">{errors.dni} </span>
                )}
              </div>
              <div className={styles.field}>
                <TextField
                  id="outlined-basic"
                  label="Nombres"
                  type="text"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  size="small"
                  {...getFieldProps("name")}
                />
                {errors.name && touched.name && (
                  <span className="text-red-500">{errors.name} </span>
                )}
              </div>
              <div className={styles.field}>
                <TextField
                  id="outlined-basic"
                  label="Apellidos"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  size="small"
                  {...getFieldProps("surnames")}
                />
                {errors.surnames && touched.surnames && (
                  <span className="text-red-500">{errors.surnames} </span>
                )}
              </div>
              <div className={styles.field}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  type="email"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  size="small"
                  {...getFieldProps("email")}
                />
                {errors.email && touched.email && (
                  <span className="text-red-500">{errors.email} </span>
                )}
              </div>
              <div className={styles.field}>
                <TextField
                  id="outlined-basic"
                  label="Número Telefónico"
                  variant="outlined"
                  type="number"
                  sx={{ width: "100%" }}
                  size="small"
                  {...getFieldProps("phone")}
                />
                {errors.phone && touched.phone && (
                  <span className="text-red-500">{errors.phone} </span>
                )}
              </div>

              <div className={styles.field}>
                <FormControl
                  sx={{ width: "100%" }}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={valuesSupport.showPassword ? "text" : "password"}
                    {...getFieldProps("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          // onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {valuesSupport.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500">{errors.password} </span>
                  )}
                </FormControl>
              </div>

              <div className={styles.field}>
                <FormControl
                  sx={{ width: "100%" }}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Repetir Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={
                      valuesSupport.showRepeatPassword ? "text" : "password"
                    }
                    {...getFieldProps("repeatPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowRepeatPassword}
                          // onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {valuesSupport.showRepeatPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {errors.repeatPassword && touched.repeatPassword && (
                    <span className="text-red-500">
                      {errors.repeatPassword}{" "}
                    </span>
                  )}
                </FormControl>
              </div>

              <div className={`${styles.field} ${styles.country}`}>
                <input
                  list="countries"
                  placeholder="País"
                  className={styles.activeData}
                  style={{
                    padding: "5px",

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
                        <p>
                          {c.value} ({c.code}) +{c.phone}
                        </p>
                      </option>
                    );
                  })}
                </datalist>

                {errors.country && touched.country && (
                  <span className="text-red-500">{errors.country} </span>
                )}
              </div>
              <div
                className={`${styles.field} ${styles["custom-file-upload"]} text-stone-200`}
              >
                <label>
                  <Tooltip title="cv en pdf" arrow>
                    <input
                      type="file"
                      name="cv"
                      aria-label="cv"
                      accept=".pdf"
                      onChange={readInputTypeFile}
                      className="text-white bg-blue-700 rounded-sm dark:text-white"
                    />
                  </Tooltip>
                  <span className="text-sm font-semibold text-gray-800">
                    subir cv archivo con extensión .pdf
                  </span>
                </label>
                {cvValue && <p className={"text-blue-500"}>{cvValue.name}</p>}
              </div>

              <div className={styles.buttonField}>
                <div className="w-full col-span-2">
                  <InputLabel id="demo-multiple-name-label">
                    ¿De dónde viene?
                  </InputLabel>
                  <select
                    id="social"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => setCurrentSocial(e.target.value)}
		    value={currentSocial}
                    >
	            <option value="" disabled>
                        Seleccionar
                    </option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">Linkedin</option>
                    <option value="instagram">Instagram</option>
                    <option value="google">Google</option>
                    <option value="convenio">Convenio</option>+
                    <option value="otros">Otros</option>
                  </select>

                  {errors.social && touched.social && (
                    <span className="text-red-500">{errors.social}</span>
                  )}
                </div>
              </div>

              <div className={styles.buttonField}>
                <div className={styles.field}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isDesabled}
                    className={`bg-blue-500 text-white hover:bg-blue-700 transition ease`}
                  >
                    Registrarme
                  </Button>
                </div>
                <div className={styles.field}>
                  <Button color="primary" type="button">
                    <Link href="/login">Ya tengo cuenta</Link>
                  </Button>
                </div>
                {isLoading && <BeatLoader color="#0072f5" />}
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default RegisterForm;


