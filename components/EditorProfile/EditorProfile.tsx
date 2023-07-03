import dynamic from "next/dynamic";
import React, { useState } from "react";
import styles from "../../styles/editor/EditorProfile.module.css";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const EditorProfile = () => {
  const [descriptionState, setDescriptionState] = useState("");
  const handleChange = (e: string) => {
    setDescriptionState(e);
  };
  return (
    <div className="editorContainer">
      <div className={styles.editorGrid}>
        <div className="infoLeft">
          <h5>Descripción Profesional</h5>
          <span className={styles.subText}>
            Por ejemplo: {"Frontend Developer, Desarrollador android"}
          </span>
        </div>
        <div className="inputRight ">
          <input type="text" className={styles.input} />
        </div>
      </div>
      <div className={styles.editorGrid}>
        <div className="infoLeft">
          <h5>Descripción del perfil y experiencia</h5>
          <span className={styles.subText}>
            Describe brevemente tu experiencia laboral, añadir actividades del
            cargo, años de experiencia, y el cargo.
          </span>
        </div>
        <div className="miniEditorRight">
          <QuillNoSSRWrapper
            value={descriptionState}
            onChange={handleChange}
            theme="snow"
          />
        </div>
      </div>
      <div className={styles.editorGrid}>
        <div className="infoLeft">
          <h5>Formación académica</h5>
          <span className={styles.subText}>
            Describe brevemente su experiencia académica.
          </span>
        </div>
        <div className="miniEditorRight">
          <QuillNoSSRWrapper
            value={descriptionState}
            onChange={handleChange}
            theme="snow"
            style={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorProfile;
