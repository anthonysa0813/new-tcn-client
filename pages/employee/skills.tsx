import React from "react";
import LayoutEmployee from "./layoutEmployee";
import styles from "../../styles/employees/Edit.module.css";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
// import { ArrowLeft, InfoCircle } from "react-iconly";
import SkillOption from "../../components/forms/SkillOption";
import ButtonPrimary from "../../components/buttons/Button";
import dynamic from "next/dynamic";

const FormNewSkills = dynamic(() =>
  import("../../components/employees/FormNewSkills").then((res) => res.default)
);

dynamic;

const SkillsPage = () => {
  const router = useRouter();
  return (
    <LayoutEmployee name="Añadir habilidades">
      <div className={styles.menu}>
        <Button
          onPress={() => router.back()}
          style={{ marginTop: 20, padding: 0 }}
        >
          {/* <ArrowLeft /> */}
          atrás
        </Button>
      </div>
      <div className="skillsContainer">
        <h3>Habilidades</h3>
        <div className={styles.alert}>
          <span className={styles.alertCotent}>
            {/* <InfoCircle set="bold" primaryColor="currentColor" /> */}
            Seleccione únicamente las habilidades que usted tenga conocimientos.
          </span>
        </div>
        <form>
          <SkillOption name="Asistente Administrativo" />
          <SkillOption name="Asistente Ejecutiva" />
          <SkillOption name="Especialista en código X de Apple" />
          <SkillOption name="Desarrollador de API" />
          <SkillOption name="Escritor de artículos" />
          <SkillOption name="Contador" />
          <SkillOption name="Especialista en soporte de chat" />
          <SkillOption name="Desarrollador de extensiones de Chrome" />
          <SkillOption name="Desarrollador C++" />
          <SkillOption name="Llamador frío" />
          <SkillOption name="Ventas salientes" />
          <SkillOption name="Ventas entrantes" />
          <SkillOption name="Establecedor de citas" />
          <SkillOption name="Servicio al Cliente" />
          <SkillOption name="Entrada de datos" />
          <SkillOption name="Minero de datos" />
          <SkillOption name="Experto en Excel" />
          <SkillOption name="Controlador de correo electrónico" />
          <SkillOption name="Desarrollador front-end" />
          <SkillOption name="Desarrollador HTML" />
          <SkillOption name="Desarrollador iOS" />
          <SkillOption name="Desarrollador Linux" />
          <SkillOption name="¿Experto en PowerPoint?" />
          <SkillOption name="Desarrollador Python" />
          <SkillOption name="Desarrollador Reaccionar" />
          <SkillOption name="Desarrollador R" />
          <SkillOption name="Encuesta independiente" />
          <SkillOption name="Especialista SQL" />
          <SkillOption name="Asistente Virtual" />
          <SkillOption name="Desarrollador WordPress" />
          <SkillOption name="Diseño CAD 3D" />
          <SkillOption name="SEO" />
          <ButtonPrimary
            color="dark"
            content="Guardar"
            onClick={() => console.log("jeje")}
            type="button"
          />
        </form>
      </div>
    </LayoutEmployee>
  );
};

export default SkillsPage;
