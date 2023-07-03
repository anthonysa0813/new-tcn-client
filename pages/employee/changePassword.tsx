import React from "react";
import dynamic from "next/dynamic";

const ChangePasswordPage = () => {
  const ChangePassForm = dynamic(() =>
    import("../../components/forms/ChangePassForm").then((res) => res.default)
  );
  const LayoutEmployee = dynamic(() =>
    import("./layoutEmployee").then((res) => res.default)
  );

  return (
    <LayoutEmployee name="Cambiar la contraseña">
      <h3>Cambia tu contraseña</h3>
      <ChangePassForm />
    </LayoutEmployee>
  );
};

export default ChangePasswordPage;
