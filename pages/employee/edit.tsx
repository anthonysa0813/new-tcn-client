import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import styles from "../../styles/users/Register.module.css";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import { GetServerSideProps } from "next";
import DatalistInput from "react-datalist-input";
import {
  countriesDataResponse,
  districtsDataResponse,
} from "../../utils/activitiesToBussiness";
import dynamic from "next/dynamic";
import { EmployeeInterface } from "../../interfaces";
import OutlinedInput from "@mui/material/OutlinedInput";
import { InputFileUpload } from "../../components/buttons";
import { TokenContext } from "../../context/CurrentToken";
import { Modal, Button as ButtonNextUi, Text } from "@nextui-org/react";
import Cookies from "js-cookie";

// new icons material ui
const MailIcon = dynamic(() =>
  import("@mui/icons-material/Mail").then((res) => res.default)
);
const PublicIcon = dynamic(() =>
  import("@mui/icons-material/Public").then((res) => res.default)
);

const FileIcon = dynamic(() =>
  import("@mui/icons-material/InsertDriveFile").then((res) => res.default)
);

const LayoutEmployee = dynamic(() =>
  import("./layoutEmployee").then((res) => res.default)
);

const ArrowForwardIcon = dynamic(() =>
  import("@mui/icons-material/ArrowForward").then((res) => res.default)
);

const Button = dynamic(() =>
  import("@mui/material/Button").then((res) => res.default)
);
const Head = dynamic(() => import("next/head").then((res) => res.default));

const Tooltip = dynamic(() =>
  import("@mui/material/Tooltip").then((res) => res.default)
);

const EditPage = ({ data }: any) => {
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const [formValues, setFormValues] = useState<EmployeeInterface>({
    name: "",
    surnames: "",
    email: "",
    callingCode: "",
    country: "",
    phone: "",
    message: "",
    cv: "",
    typeJob: "",
    password: "",
    confirmPassword: "",
    district: "",
  });
  const {
    name,
    surnames,
    email,
    callingCode,
    country,
    message,
    cv,
    typeJob,
    phone,
    password,
    district,
  } = formValues;
  const [countryCurrent, setCountryCurrent] = useState("");
  const [districtCurrent, setDistrictCurrent] = useState("");
  const router = useRouter();
  const notify = () => toast.success("Se actualizó satisfactoriamente!");
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [idLocalStorage, setIdLocalStorage] = useState({} as any);
  const [localEmployee, setlocalEmployee] = useState({} as EmployeeInterface);
  const { privateToken, setPrivateToken } = useContext(TokenContext);
  const [cvValue, setCvValue] = useState("" as any);
  const [cvId, setCvId] = useState("");
  const [activeButton, setActiveButton] = useState(true);
  const [saveNameCv, setSaveNameCv] = useState("");
  const [currentToken, setCurrentToken] = useState("");

  const { id } = employeeGlobal;

  useEffect(() => {
    if (cvValue.target?.value.includes(".pdf")) {
      // const fileName =
      setActiveButton(false);
      // const nameCv = cvValue.target?.value.split(".");
      // console.log(nameCv);
    } else {
      setActiveButton(true);
    }
  }, [cvValue]);

  useEffect(() => {
    if (Boolean(Object.keys(employeeGlobal).length)) {
      console.log({
        employeeGlobal,
        privateToken,
      });

      setCurrentToken(privateToken.token || "");
      setlocalEmployee(employeeGlobal);
      setIdLocalStorage(employeeGlobal.id || "");

      setCountryCurrent(employeeGlobal.country || "");
      fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/employees/${employeeGlobal.id}`,
        {
          headers: {
            Authorization: privateToken.token || "",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setFormValues(data);

          // setCountryCurrent(data.country || "");
          localStorage.setItem("employee", JSON.stringify(data));
        });
    }
  }, [employeeGlobal]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DB_URL}/employees/${employeeGlobal.id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    })
      .then((res) => res.json())
      .then((data: EmployeeInterface) => {
        // setCountryCurrent(data.country);
        if (data.cv) {
          const cvLink = data.cv?.split("curriculums/");
          setCvId(cvLink[1]);
        }
        console.log(data);
        setDistrictCurrent(data.district || "");
        setFormValues(data);
      });
    localStorage.setItem(
      "countries",
      JSON.stringify(data.countriesNames || "")
    );
  }, [idLocalStorage]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCvValue(e);
  };

  const readInputTypeFile = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let dataform = new FormData();
    dataform.append("name", name);
    dataform.append("surnames", surnames);
    dataform.append("email", email);
    dataform.append("password", password);
    dataform.append("callingCode", callingCode || "");
    dataform.append("country", countryCurrent || "");
    dataform.append("district", districtCurrent || "");
    dataform.append("message", message || "");
    dataform.append("cv", cv);
    dataform.append("typeJob", typeJob || "");
    dataform.append("phone", phone || "");
    sendData(dataform);
  };

  const handleSubmitFile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let dataform = new FormData();
    // console.log(cvValue);
    dataform.append("cv", cvValue.target.files[0]);
    sendUpdateCv(dataform);
  };

  const sendData = async (dataObject: FormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/employees/${id}`,
        {
          method: "PUT",
          body: dataObject,
          headers: {
            Authorization: privateToken.token,
          },
        }
      );
      const data = await res.json();
      notify();
      console.log(data);
      fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/employees/${employeeGlobal.id}`,
        {
          headers: {
            Authorization: privateToken.token,
          },
        }
      )
        .then((res) => res.json())
        .then((data: EmployeeInterface) => {
          window.localStorage.setItem("employee", JSON.stringify(data));
        });
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const sendUpdateCv = async (dataObject: FormData) => {
    try {
      // localhost:5050/api/upload?iduser=64a6e9ba89a66d2dcabfbc36&idcv=18bc03ca-9e7c-400e-854b-9d87548a4425.pdf
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/upload?iduser=${idLocalStorage}&idcv=${cvId}`,
        {
          method: "PUT",
          body: dataObject,
          // headers: {
          //   Authorization: privateToken.token,
          // },
        }
      );
      const data = await res.json();
      setCvValue("");
      setFormValues({
        ...formValues,
        cv: data.cv,
      });
      notify();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const saveFile = async () => {
    // console.log({
    //   idLocalStorage,
    //   cvId,
    //   cvValue,
    // });
  };

  return (
    <>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        width="500px"
      >
        <Modal.Header>
          <Text id="modal-title" size={32}>
            Editar CV
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmitFile}
            className={`${styles.subfield} ${styles["custom-file-upload"]}`}
          >
            <Text id="modal-title" size={14} color="error">
              Nota: Subir CV en formato pdf
            </Text>
            <div className={styles.fileContainer}>
              <label>
                <Tooltip title="Actualizar CV - tipo (pdf)" arrow>
                  <input
                    type="file"
                    name="cv"
                    aria-label="cv"
                    onChange={handleFile}
                  />
                </Tooltip>
              </label>
	      <button type="submit" disabled={activeButton} onClick={saveFile} className={activeButton ? "px-3 py-2 rounded-lg bg-gray-500 text-white cursos-pointer" : "px-3 py-2 rounded-lg bg-blue-700 text-white cursos-pointer"} >Actualizar</button>
            
            </div>
            {cvValue?.target?.value && (
              <p className={styles.titlePdf}>{cvValue.target.value}</p>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonNextUi auto flat color="error" onPress={closeHandler}>
            Cerrar
          </ButtonNextUi>
        </Modal.Footer>
      </Modal>
      <Head>
        <title>Contact Bpo | Dashboard Contact</title>
        <meta
          name="description"
          content="Dashboard de Contact BPO para futuros empleadores."
        />
      </Head>
      <LayoutEmployee name="editar información">
        <h1>Edita tu información</h1>
        <div className={styles.nextAction}>
          <Button
            color="primary"
            onClick={() => router.push("/employee/moreDetails")}
          >
            <Tooltip
              color="primary"
              title="Sí ha realizado un cambio, asegúrese en guardarlo antes de salir de ésta pestaña"
              arrow
            >
              <span className={styles.buttonText}>
                agrega más información <ArrowForwardIcon />
              </span>
            </Tooltip>
          </Button>
        </div>
        <ToastContainer />
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label className={`${styles.label} text-gray-800`}>Nombres:</label>
              <span className={styles.subText}>
                Porfavor, escribir tus nombres completos.
              </span>
            </div>
            <div className={styles.buttonContent}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="text"
                name="name"
                size="small"
                value={name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label htmlFor=""  className={`${styles.label} text-gray-800`}>Apellidos:</label>
              <span className={styles.subText}>
                Porfavor, escribir tus Apellidos completos
              </span>
            </div>
            <div className={styles.buttonContent}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="text"
                name="surnames"
                size="small"
                value={surnames}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label htmlFor="" className={`${styles.label} text-gray-800`}>
                <MailIcon style={{ height: "30px", width: 30 }} />
                Email:
              </label>
              <span className={styles.subText}>
                Mantén un correo actualizado
              </span>
            </div>
            <div className={styles.buttonContent}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="email"
                name="email"
                size="small"
                value={email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label
                htmlFor="
              "
              	className={`${styles.label} text-gray-800`}
              >
                <PublicIcon style={{ height: "30px", width: 30 }} />
                Dónde vives:
              </label>
              <span className={styles.subText}>
                Conocer tu país nos dará mejor cobertura para informarnos con
                usted.
              </span>
            </div>
            <div className={styles.buttonContent}>
              <DatalistInput
                className="dataList"
                placeholder=""
                label="País"
                onSelect={(item) => setCountryCurrent(item.value)}
                items={countriesDataResponse}
                value={countryCurrent}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label
                htmlFor="
              "
                className={`${styles.label} text-gray-800`}
              >
                <PublicIcon style={{ height: "30px", width: 30 }} />
                Distrito:
              </label>
            </div>
            <div className={styles.buttonContent}>
              <DatalistInput
                className="dataList"
                placeholder=""
                label="Distrito"
                onSelect={(item) => setDistrictCurrent(item.value)}
                items={districtsDataResponse}
                value={districtCurrent}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.textInfo}>
              <label htmlFor="" className={`${styles.label} text-gray-800`}>
                <FileIcon style={{ height: "30px", width: 30 }} />
                CV:
              </label>
              <span className={styles.subText}>
                Comparte tu cv para conocer un poco más sobre ti
              </span>
            </div>
            <div className={styles.buttonContent}>
              <InputFileUpload cv={cv || ""} />
		<button className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-900 transition ease w-full md:w-auto " type="button" onClick={handler}>actualizar CV</button>
            </div>
          </div>
          <div className={styles.buttonField}>
		<button  className="p-2 md:px-4 rounded-lg bg-zinc-900 text-white hover:bg-zinc-950 transition ease w-full md:w-auto" type="submit">Guardar</button>
          </div>
        </form>
      </LayoutEmployee>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // data de nombres de paises
  const res = await fetch("http://country.io/names.json");
  const data = await res.json();

  // data de código telefónico
  const resCode = await fetch("http://country.io/phone.json");
  const dataCode = await resCode.json();

  // current User
  return {
    props: {
      data: {
        countriesNames: data,
        callingCode: dataCode,
      },
    },
  };
};

export default EditPage;
