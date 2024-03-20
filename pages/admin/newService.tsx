import React, { useState, useContext, useEffect } from "react";
//import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Input, Text } from "@nextui-org/react";
import useForm from "../../hooks/useForm";
import { createNewServicefetch } from "../../helpers/employeeFetch";
import styles from "../../styles/admin/form/NewServiceForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import { TokenContext } from "../../context/CurrentToken";
import { InputLabel, NativeSelect } from "@mui/material";
import { EmployeeContext } from "../../context/EmployeeContext";
import Tiptap from "../../components/texteditor/TextEditor";

//const QuillNoSSRWrapper = dynamic(import("react-quill"), {
//  ssr: false,
//  loading: () => <p>Loading ...</p>,
//});

const Head = dynamic(() => import("next/head").then((res) => res.default));

const LayoutDashboard = dynamic(
  import("../../components/dashboard/LayoutDashboard").then(
    (res) => res.default
  )
);
interface FormProp {
  title: string;
  schedule: string;
  salary: string;
  requirements: string;
  description?: string;
  type?: string;
  typeJob?: string;
  slug?: string;
  supervisor?: string;
  whatsapp?: string;
  localCurrency?: string;
}

const notify = () => toast.success("Se creó el servicio!");
const notifyWarning = (message: string) => toast.warning(message);

const NewServicePage = () => {
  const [descriptionState, setDescriptionState] = useState("");
  const [requirementsState, setRequirementsState] = useState("");
  const [showModalSalary, setShowModalSalary] = useState(false);
  const [showModalConfirmCondition, setShowModalConfirmCondition] =
    useState(false);

  const [initialValues, setInitialValues] = useState<FormProp>({
    title: "",
    schedule: "",
    salary: "",
    requirements: "",
    type: "",
    typeJob: "",
    slug: "",
    supervisor: "",
    whatsapp: "",
  });
  const {
    title,
    salary,
    schedule,
    requirements,
    form,
    onChange,
    slug,
    supervisor,
    whatsapp,
    localCurrency,
    setForm,
  } = useForm<FormProp>(initialValues);
  const [error, setError] = useState(false);
  const { userGlobal } = useContext(UserContext);

  const { privateToken } = useContext(TokenContext);

  const [isDisabled, setIsDisabled] = useState(false);
  const { role } = userGlobal;

  useEffect(() => {
    if (role !== "ROLE_ADMIN") {
      setIsDisabled(true);
    }
  }, [role]);

  useEffect(() => {
    const transformSlug = title.split(" ").join("-").toLowerCase();
    setInitialValues({
      ...initialValues,
      slug: transformSlug,
    });
  }, [title]);

  const handleChangeDescription = (e: string) => {
    setDescriptionState(e);
  };
  const handleChangeRequirements = (e: string) => {
    setRequirementsState(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      [title, salary, schedule, requirementsState, descriptionState].includes(
        ""
      )
    ) {
      setError(true);
      notifyWarning("Están vaciós algunos campos...");
      setTimeout(() => {
        setError(false);
      }, 2000);
      return;
    }
    setError(false);

    createNewServicefetch(
      {
        title,
        salary,
        schedule,
        requirements: requirementsState,
        description: descriptionState,
        type: initialValues.type,
        typeJob: initialValues.typeJob,
        slug: initialValues.slug,
        whatsapp,
        supervisor,
        modalSalary: showModalSalary,
        modalConfirm: showModalConfirmCondition,
      },
      privateToken.token
    ).then((res) => {
      notify();
      setDescriptionState("");
      setInitialValues({
        title: "",
        schedule: "",
        salary: "",
        requirements: "",
      });
    });
  };

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Crea un Nuevo Puesto</title>
      </Head>
      <LayoutDashboard>
        <ToastContainer />
        <div className="wrapper">
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Crear un nuevo puesto laboral</h1>
            {role !== "ADMIN_ROLE" && (
              <p className={styles.alert}>
                Únicamente los usuarios con un role <span>ADMIN_ROLE</span>,
                podrán crear.
              </p>
            )}
            <div className={styles.subwrapper}>
              <div className={styles.field}>
                <label>Título:</label>
                <Input
                  type="text"
                  clearable
                  underlined
                  name="title"
                  value={title}
                  onChange={onChange}
                />
              </div>
              <div className={styles.field}>
                <label>Slug:</label>
                <Input
                  type="text"
                  clearable={false}
                  underlined
                  name="slug"
                  value={initialValues.slug}
                />
              </div>
              <div className={styles.fieldSecondary}>
                <div className={styles.subField}>
                  <label>Horario:</label>
                  <Input
                    type="text"
                    clearable
                    underlined
                    name="schedule"
                    value={schedule}
                    onChange={onChange}
                    placeholder="L - V (8am -6pm)"
                  />
                </div>
                <div className={styles.currencyField}>
                  <div className={styles.subField}>
                    <label>Salario:</label>
                    <Input
                      type="text"
                      clearable
                      underlined
                      name="salary"
                      value={salary}
                      onChange={onChange}
                      placeholder="2000"
                    />
                  </div>
                  <div className={styles.subField}>
                    <label>Tipo de moneda:</label>
                    <NativeSelect
                      defaultValue={30}
                      inputProps={{
                        name: "type",
                        id: "uncontrolled-native",
                      }}
                      value={localCurrency}
                      name="localCurrency"
                      onChange={(e) =>
                        setForm((state) => ({
                          ...state,
                          localCurrency: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Seleccione</option>
                      <option value={"PEN"}>PEN</option>
                      <option value={"USD"}>USD</option>
                    </NativeSelect>
                  </div>
                </div>
              </div>
              <div className={styles.fieldSecondary}>
                <div className={styles.subField}>
                  <label>Tipo:</label>
                  <NativeSelect
                    defaultValue={30}
                    inputProps={{
                      name: "type",
                      id: "uncontrolled-native",
                    }}
                    value={initialValues.type}
                    name="type"
                    onChange={(e) =>
                      setInitialValues({
                        ...initialValues,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value={""}>Seleccione</option>
                    <option value={"Remoto"}>Remoto</option>
                    <option value={"Presencial"}>Presencial</option>
                    <option value={"Híbrido"}>Híbrido</option>
                  </NativeSelect>
                </div>
                <div className={styles.subField}>
                  <label>Tipo de Jornada:</label>
                  <NativeSelect
                    defaultValue={30}
                    inputProps={{
                      name: "typeJob",
                      id: "uncontrolled-native",
                    }}
                    name="typeJob"
                    value={initialValues.typeJob}
                    onChange={(e) =>
                      setInitialValues({
                        ...initialValues,
                        typeJob: e.target.value,
                      })
                    }
                  >
                    <option value={""}>Seleccione</option>
                    <option value={"Full Time"}>Full Time</option>
                    <option value={"Part time"}>Part Time</option>
                  </NativeSelect>
                </div>
              </div>
              <div className={styles.fieldSecondary}>
                <div className={styles.subField}>
                  <label>Correo del Supervisor encargado:</label>
                  <Input
                    type="text"
                    clearable
                    underlined
                    name="supervisor"
                    value={supervisor}
                    onChange={onChange}
                    placeholder="example@example.com"
                  />
                </div>
                <div className={styles.subField}>
                  <label>Enlace de whatsapp:</label>
                  <div className="">
                    <Input
                      type="text"
                      clearable
                      underlined
                      name="whatsapp"
                      value={whatsapp}
                      onChange={onChange}
                      placeholder="link de whatsapp"
                    />
                    {whatsapp && (
                      <Text size={14} color="primary">
                        https://wa.me/51{whatsapp}?text="¡Hola!, quiero postular
                        al puesto puesto {title}"
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.fieldSecondary}>
                <input
                  type="checkbox"
                  name="modalSalary"
                  checked={showModalSalary}
                  onClick={() => setShowModalSalary(!showModalSalary)}
                />
                <span>
                  Activar modal para preguntar: ¿Cuánto es su pretención
                  salarial? <span style={{ color: "red" }}>(Opcional*)</span>
                </span>
              </div>
              <div className={styles.fieldSecondary}>
                <input
                  type="checkbox"
                  name="modalConfirm"
                  checked={showModalConfirmCondition}
                  onClick={() =>
                    setShowModalConfirmCondition(!showModalConfirmCondition)
                  }
                />
                <span>
                  Activar modal para preguntar: ¿Por favor confirmar que estás
                  de acuerdo con las condiciones ofrecidas?{" "}
                  <span style={{ color: "red" }}>(Opcional*)</span>
                </span>
              </div>
              <div className={styles.field} style={{ marginBlock: "3rem" }}>
                <label style={{ marginBlockEnd: "1rem" }}>
                  Descripción del puesto:
                </label>
                <Tiptap
                  onChange={handleChangeDescription}
                  content={descriptionState}
                />
                {/* <span>{descriptionState}</span> */}
              </div>
              <div className={styles.field} style={{ marginBlock: "3rem" }}>
                <label style={{ marginBlockEnd: "1rem" }}>
                  Requerimientos:
                </label>
                <Tiptap
                  onChange={handleChangeRequirements}
                  content={requirementsState}
                />
                {/* <p> {requirementsState}</p> */}
              </div>

              <button
                type={role !== "ADMIN_ROLE" ? "button" : "submit"}
                className={`${
                  styles.button
                } bg-blue-500  dark:bg-blue-700 bg-blue-700 text-white  dark:text-white ${
                  role !== "ADMIN_ROLE" ? styles.inactive : ""
                }`}
                // disabled={true}
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </LayoutDashboard>
    </>
  );
};

export default NewServicePage;



