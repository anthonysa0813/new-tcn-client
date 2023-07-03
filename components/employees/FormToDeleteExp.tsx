import React, {useContext} from "react";
import { deleteExperience } from "../../apis/experience/useFecthExperience";
import { Experience } from "../../interfaces";
import styles from "../../styles/employees/FormToDeleteExp.module.css";
import ButtonPrimary from "../buttons/Button";
import { TokenContext } from "../../context/CurrentToken";

interface Prop {
  setshowModalToDelete: React.Dispatch<React.SetStateAction<boolean>>;
  currentExperience: Experience;
  setDataListExperiences: React.Dispatch<
    React.SetStateAction<[] | Experience[]>
  >;
  dataListExperiences: Experience[] | [];
}

const FormToDeleteExp = ({
  setshowModalToDelete,
  currentExperience,
  setDataListExperiences,
  dataListExperiences,
}: Prop) => {
   const { privateToken: {token}, setPrivateToken } = useContext(TokenContext);
  const deleteFunc = () => {
    deleteExperience(
      "experiences",
      currentExperience.employee || "",
      currentExperience._id || "",
      token
    ).then((res) => {
      console.log(res);
      setshowModalToDelete((state) => !state);
      const filterArr = dataListExperiences.filter(
        (exp) => exp._id !== currentExperience._id
      );
      setDataListExperiences(filterArr);
    });
  };

  return (
    <div className={styles.formExpGrid}>
      <h1>
        ¿Estás seguro de eliminar tu experiencia como{" "}
        <span className={styles.title}> {currentExperience.title}</span>?
      </h1>
      <span>Una vez eliminado, no se volverá a reestaurar estos datos...</span>
      <div className={styles.buttons}>
        <ButtonPrimary
          color="primary"
          content="Sí, eliminar"
          type="button"
          onClick={deleteFunc}
        />
        <ButtonPrimary
          color="danger"
          content="candelar"
          type="button"
          onClick={() => setshowModalToDelete((state) => !state)}
        />
      </div>
    </div>
  );
};

export default FormToDeleteExp;
