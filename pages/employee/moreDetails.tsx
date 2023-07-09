import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/employees/Edit.module.css";
import { useRouter } from "next/router";
import {
  deleteLangByEmployee,
  getAllLanguagesByEmployee,
} from "../../apis/languages/useFetchLang";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import {
  EmployeeInterface,
  Experience,
  KnoledgeInterface,
  LangResponse,
} from "../../interfaces";
import { getExperienceByEmployee } from "../../apis/experience/useFecthExperience";
import {
  getKnoledges,
  deleteKnoledgesFetch,
} from "../../apis/knoledges/useKnoledges";
import {
  getEmployeeById,
  saveInformationGeneral,
} from "../../apis/employee/useEmployeeFetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import FormExperienceSecondary from "./FormExperienceSecondary";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TokenContext } from "../../context/CurrentToken";
import { Modal, Button as ButtonNextUi, Text } from "@nextui-org/react";

const LayoutEmployee = dynamic(() =>
  import("./layoutEmployee").then((res) => res.default)
);

const Head = dynamic(() => import("next/head").then((res) => res.default));

const ArrowLeft = dynamic(() =>
  import("@mui/icons-material/KeyboardBackspace").then((res) => res.default)
);

const Calling = dynamic(() =>
  import("@mui/icons-material/PhoneCallback").then((res) => res.default)
);

const FaLinkedin = dynamic(() =>
  import("@mui/icons-material/LinkedIn").then((res) => res.default)
);

const FaGithub = dynamic(() =>
  import("@mui/icons-material/GitHub").then((res) => res.default)
);

const EditIcon = dynamic(() =>
  import("@mui/icons-material/Edit").then((res) => res.default)
);

const DeleteIcon = dynamic(() =>
  import("@mui/icons-material/Delete").then((res) => res.default)
);

const GiPublicSpeaker = dynamic(() =>
  import("@mui/icons-material/Group").then((res) => res.default)
);

const BsFillFileEarmarkTextFill = dynamic(() =>
  import("@mui/icons-material/Article").then((res) => res.default)
);

const BsFillPlusCircleFill = dynamic(() =>
  import("@mui/icons-material/AddCircle").then((res) => res.default)
);

const IoMdClose = dynamic(() =>
  import("@mui/icons-material/HighlightOff").then((res) => res.default)
);

const Button = dynamic(() =>
  import("@mui/material/Button").then((res) => res.default)
);

const Loading = dynamic(() =>
  import("react-spinners/BeatLoader").then((res) => res.default)
);

const ButtonPrimary = dynamic(() =>
  import("../../components/buttons/Button").then((res) => res.default)
);

const ModalComponent = dynamic(() =>
  import("../../components/dashboard/ModalComponent").then((res) => res.default)
);

const FormNewLang = dynamic(() =>
  import("../../components/employees/FormNewLang").then((res) => res.default)
);

const FormNewSkills = dynamic(() =>
  import("../../components/employees/FormNewSkills").then((res) => res.default)
);

const FormToDeleteExp = dynamic(() =>
  import("../../components/employees/FormToDeleteExp").then(
    (res) => res.default
  )
);

const ShowServiceById = dynamic(() =>
  import("../../components/employees/ShowServiceById").then(
    (res) => res.default
  )
);

const AlertIcon = dynamic(() =>
  import("@mui/icons-material/Error").then((res) => res.default)
);
interface PropSaveInfo {
  phone: string;
  linkedin: string;
  github: string;
}

const MoreDetails = () => {
  const router = useRouter();
  const [showModalToLang, setShowModalToLang] = useState(false);
  const [showModalExperience, setshowModalExperience] = useState(false);
  const [showModalSkills, setShowModalSkills] = useState(false);
  const [showService, setShowService] = useState(false);
  const [knoledgesList, setKnoledgesList] = useState<KnoledgeInterface[] | []>(
    []
  );
  const [dataListExperiences, setDataListExperiences] = useState<
    Experience[] | []
  >([]);
  const [showModalToDelete, setshowModalToDelete] = useState(false);
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { id: idEmployee } = employeeGlobal;
  const openExperience = () => {
    setshowModalExperience((state) => !state);
  };
  const [initialForm, setInitialForm] = useState({} as PropSaveInfo);
  const [currentExpToMoDal, setCurrentExpToMoDal] = useState({} as Experience);

  const [formValue, setFormValue] = useState({
    phone: "",
    github: "",
    linkedin: "",
  });
  const { github, linkedin, phone } = formValue;
  const [stateListLang, setStateListLang] = useState<LangResponse[] | []>([]);
  const [currentExperience, setcurrentExperience] = useState<Experience>(
    {} as Experience
  );
  const [currentIdExperience, setCurrentIdExperience] = useState("");
  const [editMode, setEditMode] = useState(false);
  const notifyError = () => toast.error("Todos los campos son obligatorios");
  const notifySuccessEdit = () => toast.success("Se ha editado 👌");
  const { privateToken, setPrivateToken } = useContext(TokenContext);

  // close and open modals
  const [openLangModal, setOpenLangModal] = useState(false);

  // END close and opens modals

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const openLang = () => {
    setShowModalToLang((state) => !state);
  };

  const openSkill = () => {
    setShowModalSkills((state) => !state);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    saveInformationGeneral<PropSaveInfo>(
      "employees",
      idEmployee || "",
      {
        phone,
        github,
        linkedin,
      },
      privateToken.token
    )
      .then((res) => {
        setIsLoading(false);
        notifySuccessEdit();
      })
      .catch((err) => {
        console.log(err);
        notifyError;
      });
  };

  // useEffect(() => {
  //   // if (typeof window.sessionStorage !== undefined) {
  //   //   const tok = sessionStorage.getItem("token");
  //   //   setPrivateToken({ token: tok || "" });
  //   // }
  //   if (window.localStorage) {
  //     // const getId: EmployeeInterface = JSON.parse(
  //     //   localStorage.getItem("employee") || ""
  //     // );
  //     const getId: EmployeeInterface = JSON.parse(
  //       localStorage.getItem("employee") || ""
  //     );
  //     setEmployeeGlobal(getId);
  //   }
  // }, []);

  useEffect(() => {
    if (privateToken.token && employeeGlobal.id) {
      getAllLanguagesByEmployee(employeeGlobal.id, privateToken.token).then(
        (res) => {
          setStateListLang(res);
        }
      );
      getExperienceByEmployee(
        "experiences",
        employeeGlobal.id,
        privateToken.token
      ).then((res) => {
        setDataListExperiences(res);
      });
      getKnoledges("knoledge", employeeGlobal.id, privateToken.token).then(
        (res) => {
          console.log(res);
          setKnoledgesList(res);
        }
      );
      getEmployeeById("employees", employeeGlobal.id, privateToken.token).then(
        (res) => {
          setInitialForm({
            phone: res.phone || "",
            linkedin: res.linkedin || "",
            github: res.github,
          });
          setFormValue({
            phone: res.phone || "",
            linkedin: res.linkedin || "",
            github: res.github,
          });
        }
      );
    }
  }, [privateToken.token, employeeGlobal.id]);

  const deleteLangCall = (idLang: string) => {
    deleteLangByEmployee(idLang, privateToken.token).then((res) => {
      const filterLang = stateListLang.filter((l) => l._id !== idLang);
      setStateListLang(filterLang);
    });
  };

  const deleteKnoledges = (idKnowledge: string) => {
    deleteKnoledgesFetch("knoledge", idKnowledge, privateToken.token).then(
      (res) => {
        const filterKnowledges = knoledgesList.filter(
          (l) => l._id !== idKnowledge
        );
        setKnoledgesList(filterKnowledges);
      }
    );
  };

  return (
    <>
      <Head>
        <title>Contact Bpo | Dashboard Contact</title>
        <meta
          name="description"
          content="Dashboard de Contact BPO para futuros empleadores."
        />
      </Head>
      <ToastContainer />
      <LayoutEmployee name="Seguir editando">
        <div className={styles.alert}>
          <span className={styles.alertCotent}>
            <AlertIcon />
            Tu información es importante para nosotros, por favor tómate el
            tiempo de completar todos los espacios.
          </span>
        </div>
        <div className={styles.menu}>
          <Button onClick={() => router.back()} className={styles.buttonBack}>
            <ArrowLeft />
            <span>atrás</span>
          </Button>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.field}>
            <div className="info">
              <div className={styles.titleHead}>
                <Calling />
                <p>Número Telefónico: </p>
              </div>
              <span className={styles.subText}>
                Guarda tu número telefónico, para no perder futuros proyectos
                juntos.
              </span>
            </div>
            <div className={styles.inputSection}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="number"
                name="phone"
                size="small"
                value={phone}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className="info">
              <div className={styles.titleHead}>
                <FaLinkedin
                  style={{
                    marginInline: ".5rem",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <p>URL LinkedIn: </p>
              </div>
              <span className={styles.subText}>
                Comparte tu LinkedIn para saber más sobre ti.
              </span>
            </div>
            <div className={styles.inputSection}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="text"
                name="linkedin"
                size="small"
                value={linkedin}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className="info">
              <div className={styles.titleHead}>
                <FaGithub
                  style={{
                    marginInline: ".5rem",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <p>URL GitHub: </p>
              </div>
              <span className={styles.subText}>
                Sí eres programador, compartenos tu repositorio.
              </span>
            </div>
            <div className={styles.inputSection}>
              <OutlinedInput
                style={{ width: "100%" }}
                type="text"
                name="github"
                size="small"
                value={github}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className="info">
              <div className={styles.titleHead}>
                <GiPublicSpeaker />
                <p>Añade tus Habilidades y Conocimientos: </p>
              </div>
              <span className={styles.subText}>
                Escribe una palabra simple o compuesta.Ej: desarrollador
                Frontend
              </span>
              <div className={styles.listGridLang}>
                {knoledgesList &&
                  knoledgesList.map((knoledge) => {
                    return (
                      <span key={knoledge._id}>
                        {knoledge.name}
                        <IoMdClose
                          onClick={() => deleteKnoledges(knoledge._id || "")}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
            <div className={styles.inputSection}>
              <ButtonNextUi
                auto
                shadow
                onPress={() => setShowModalSkills(!showModalSkills)}
                css={{
                  marginBlockStart: "1rem",
                }}
              >
                <BsFillPlusCircleFill />
                <p>Agregar una habilidad </p>
              </ButtonNextUi>
            </div>
          </div>
          <div className={`${styles.field}`}>
            <div className="info">
              <div className={styles.titleHead}>
                <GiPublicSpeaker
                  style={{
                    marginInline: ".5rem",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <p>Idioma(s): </p>
              </div>
              <span className={styles.subText}>
                Agrega los idiomas que consideres que dominas
              </span>
              <div className={styles.listGridLang}>
                {stateListLang &&
                  stateListLang.map((language) => {
                    return (
                      <span key={language._id}>
                        {language.lang}
                        <IoMdClose
                          onClick={() => deleteLangCall(language._id)}
                        />
                      </span>
                    );
                  })}
              </div>
            </div>
            <div className={styles.inputSection}>
              {/* <Button
                onClick={() => setShowModalToLang(!showModalToLang)}
                style={{
                  marginTop: 20,
                  padding: 0,
                  marginInlineStart: 0,
                }}
                className={styles.button}
              >
                <BsFillPlusCircleFill />
                <p>Agregar idioma</p>
              </Button> */}
              <ButtonNextUi
                auto
                shadow
                onPress={() => setShowModalToLang(!showModalToLang)}
                css={{
                  marginBlockStart: "1rem",
                }}
              >
                <BsFillPlusCircleFill />
                <p>Agregar idioma</p>
              </ButtonNextUi>
            </div>
          </div>

          <div className={styles.profileProfesional}>
            <div className="info">
              <div className={`${styles.titleHead} ${styles.experienceHead}`}>
                <div className={styles.infoLeft}>
                  <div className={styles.titleProfile}>
                    <BsFillFileEarmarkTextFill style={{ fontSize: 32 }} />
                    <h3>Perfil Profesional y Experiencia: </h3>
                  </div>
                  <span className={styles.subText}>
                    Los datos que ingreses será utilizados para futuras
                    postulaciones.
                  </span>
                </div>
                {/* <Button
                  onClick={openExperience}
                  style={{
                    padding: 0,
                    marginInlineStart: 0,
                  }}
                  className={styles.button}
                >
                  <BsFillPlusCircleFill />
                  <p>Agregar experiencia</p>
                </Button> */}
                <ButtonNextUi auto shadow onPress={openExperience}>
                  <BsFillPlusCircleFill />
                  <p>Agregar experiencia</p>
                </ButtonNextUi>
              </div>
            </div>
            <div className={styles.experiencesList}>
              {dataListExperiences.length > 0 &&
                dataListExperiences.map((exp) => {
                  return (
                    <div key={exp._id} className={styles.experienceGrid}>
                      <div className={styles.infoExperience}>
                        <h5>{exp.title}</h5>
                        <span className={styles.titleBussiness}>
                          {exp.nameBussiness}
                        </span>
                        <div className="placeAndDate">
                          <span>
                            {exp.dateStart} - {exp.dateEnd}, {exp.country}
                          </span>
                        </div>
                        <div className={styles.readMore}>
                          <span
                            onClick={() => {
                              setShowService(true);
                              setCurrentIdExperience(exp._id || "");
                              setCurrentExpToMoDal(exp);
                            }}
                          >
                            Leer completo
                          </span>
                        </div>
                      </div>
                      <div className={styles.actionsExperiences}>
                        <EditIcon
                          onClick={() => {
                            setEditMode((state) => !state);
                            setcurrentExperience(exp);
                          }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setcurrentExperience(exp);
                            setshowModalToDelete((state) => !state);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* <ButtonPrimary
              color="dark"
              content="Guardar"
              onClick={() => console.log("click")}
              type="submit"
            /> */}
            <ButtonNextUi auto flat type="submit" color="primary">
              {isLoading && <Loading style={{ marginTop: "1rem" }} />}
              <p>Guardar</p>
            </ButtonNextUi>
          </div>
        </form>
      </LayoutEmployee>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModalToDelete}
        onClose={() => setshowModalToDelete(false)}
        width="500px"
      >
        <Modal.Body>
          <FormToDeleteExp
            setshowModalToDelete={setshowModalToDelete}
            currentExperience={currentExperience}
            setDataListExperiences={setDataListExperiences}
            dataListExperiences={dataListExperiences}
          />
        </Modal.Body>
      </Modal>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModalExperience}
        onClose={() => setshowModalExperience(false)}
        width="1000px"
      >
        <Modal.Body>
          <FormExperienceSecondary
            // openExperience={showModalExperience}
            dataListExperiences={dataListExperiences}
            setDataListExperiences={setDataListExperiences}
          />
        </Modal.Body>
      </Modal>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showService}
        onClose={() => setShowService(false)}
        width="500px"
      >
        <Modal.Body>
          <ShowServiceById
            idService={currentIdExperience}
            idEmployee={employeeGlobal.id}
            setShowService={setShowService}
            exp={currentExpToMoDal}
          />
        </Modal.Body>
      </Modal>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={editMode}
        onClose={() => setEditMode(false)}
        width="1000px"
      >
        <Modal.Body>
          <FormExperienceSecondary
            openExperience={openExperience}
            dataListExperiences={dataListExperiences}
            setDataListExperiences={setDataListExperiences}
            editMode={editMode}
            currentExperience={currentExperience}
            setEditMode={setEditMode}
          />
        </Modal.Body>
      </Modal>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModalToLang}
        onClose={() => setShowModalToLang(false)}
        width="500px"
      >
        <Modal.Body>
          <FormNewLang
            openLang={openLang}
            setStateListLang={setStateListLang}
            stateListLang={stateListLang}
          />
        </Modal.Body>
      </Modal>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={showModalSkills}
        onClose={() => setShowModalSkills(false)}
        width="500px"
      >
        <Modal.Body>
          <FormNewSkills
            openSkill={openSkill}
            idEmployee={idEmployee || ""}
            knoledgesList={knoledgesList}
            setKnoledgesList={setKnoledgesList}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MoreDetails;
