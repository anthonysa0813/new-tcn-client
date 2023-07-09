"use client";
import React, { useState, useContext, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Input, Text } from "@nextui-org/react";
import useForm from "../../../hooks/useForm";
import {
  createNewServicefetch,
  updateNewServicefetch,
} from "../../../helpers/employeeFetch";
import styles from "../../../styles/admin/form/NewServiceForm.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../context/UserContext";
import { TokenContext } from "../../../context/CurrentToken";
import { InputLabel, NativeSelect } from "@material-ui/core";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ServiceApi } from "../../../apis/services";
import { ServiceI } from "../../../interfaces";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../../context/EmployeeContext";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const Head = dynamic(() => import("next/head").then((res) => res.default));

const LayoutDashboard = dynamic(
  import("../../../components/dashboard/LayoutDashboard").then(
    (res) => res.default
  )
);
interface Prop {
  id: string;
}

interface FormProp {
  title: string;
  schedule: string;
  salary: string;
  requirements: string;
  description?: string;
  type?: string;
  typeJob?: string;
  slug?: string;
  whatsapp?: string;
  supervisor?: string;
  localCurrency?: string;
}

const notify = () => toast.success("Se actualizó el puesto!");
const notifyWarning = (message: string) => toast.warning(message);

const UpdateService = () => {
  const [descriptionState, setDescriptionState] = useState("");
  const [requirementsState, setRequirementsState] = useState("");
  const router = useRouter();
  console.log(router);

  const [initialValues, setInitialValues] = useState<FormProp>({
    title: "",
    schedule: "",
    salary: "",
    requirements: "",
    type: "",
    typeJob: "",
    slug: "",
    whatsapp: "",
    supervisor: "",
    localCurrency: "",
  });
  const {
    title,
    salary,
    schedule,
    type,
    typeJob,
    slug,
    form,
    onChange,
    setForm,
    whatsapp,
    supervisor,
    localCurrency,
  } = useForm<FormProp>(initialValues);
  const [error, setError] = useState(false);
  const { userGlobal } = useContext(UserContext);
  const { privateToken } = useContext(TokenContext);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [currentData, setCurrentData] = useState<ServiceI>({} as ServiceI);

  const [isDisabled, setIsDisabled] = useState(false);
  const { role } = userGlobal;

  useEffect(() => {
    if (router.query.id) {
      ServiceApi.get(`/${router.query.id}`).then((res) => {
        setForm({
          title: res.data.title,
          schedule: res.data.schedule,
          salary: res.data.salary,
          requirements: res.data.requirements,
          description: res.data.description,
          type: res.data.type,
          typeJob: res.data.typeJob,
          slug: res.data.slug,
          whatsapp: res.data.whatsapp,
          supervisor: res.data.supervisor,
          localCurrency: res.data.localCurrency,
        });
        setCurrentData(res.data);
        setDescriptionState(res.data.description);
        setRequirementsState(res.data.requirements);
      });
    }
  }, [router.query.id]);

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
    // console.log({
    //   title,
    //   salary,
    //   schedule,
    //   requirements: requirementsState,
    //   description: descriptionState,
    //   type,
    //   typeJob,
    //   slug,
    // });
    updateNewServicefetch(
      {
        title,
        salary,
        schedule,
        requirements: requirementsState,
        description: descriptionState,
        type,
        typeJob,
        slug,
        supervisor,
        whatsapp,
        localCurrency,
      },
      privateToken.token,
      currentData._id
    ).then((res) => {
      notify();
    });
  };

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Actualiza un Puesto</title>
      </Head>
      <LayoutDashboard>
        <ToastContainer />
        <div className="wrapper ">
          <form onSubmit={handleSubmit} className={`${styles.form} `}>
            <h1 className={styles.title}>Editar Puesto</h1>
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
                  underlined
                  name="slug"
                  onChange={onChange}
                  value={slug}
                />
              </div>
              <div className={styles.fieldSecondary}>
                <div className={styles.subField}>
                  <label>Horario:</label>
                  <Input
                    type="text"
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
                    value={type}
                    name="type"
                    onChange={(e) =>
                      setForm((state) => ({
                        ...state,
                        type: e.target.value,
                      }))
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
                    value={typeJob}
                    onChange={(e) =>
                      setForm((state) => ({
                        ...state,
                        typeJob: e.target.value,
                      }))
                    }
                  >
                    <option value={""}>Seleccione</option>
                    <option value={"J.Completa"}>Jornada Completa</option>
                    <option value={"J.Part time"}>Jornada Part time</option>
                  </NativeSelect>
                </div>
              </div>
              <div className={styles.fieldSecondary}>
                <div className={styles.subField}>
                  <label>Correo del Supervisor encargado:</label>
                  <Input
                    type="text"
                    // clearable
                    underlined
                    name="supervisor"
                    value={supervisor}
                    onChange={onChange}
                    placeholder="example@example.com"
                  />
                </div>
                <div className={styles.subField}>
                  <label>N° whatsapp:</label>
                  <div className="">
                    <Input
                      type="text"
                      // clearable
                      underlined
                      name="whatsapp"
                      value={whatsapp}
                      onChange={onChange}
                      placeholder="link de whatsapp"
                      css={{
                        display: "block",
                      }}
                    />
                    {whatsapp && (
                      <Text size={14} color="primary">
                        https://wa.me/51{whatsapp}?text=Hola
                      </Text>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.field} style={{ marginBlock: "3rem" }}>
                <label style={{ marginBlockEnd: "1rem" }}>
                  Descripción del puesto:
                </label>
                <QuillNoSSRWrapper
                  value={descriptionState}
                  onChange={handleChangeDescription}
                  theme="snow"
                />
              </div>
              <div className={styles.field} style={{ marginBlock: "3rem" }}>
                <label style={{ marginBlockEnd: "1rem" }}>
                  Requerimientos:
                </label>
                <QuillNoSSRWrapper
                  value={requirementsState}
                  onChange={handleChangeRequirements}
                  theme="snow"
                />
              </div>
              <button
                type={role !== "ADMIN_ROLE" ? "button" : "submit"}
                className={`${styles.button} ${
                  role !== "ADMIN_ROLE" ? styles.inactive : ""
                }`}
                // disabled={true}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </LayoutDashboard>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { id } = ctx.params as { id: string };
//   console.log({ id });

//   return {
//     props: {
//       id,
//     },
//   };
// };

export default UpdateService;
