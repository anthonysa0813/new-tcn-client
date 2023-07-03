import React, { useState } from "react";
import styles from "../../../styles/admin/form/NewClientForm.module.css";
import { Button, Input, Textarea } from "@nextui-org/react";
import useForm from "../../../hooks/useForm";
import { ClientInterface, ClientResponse } from "../../../interfaces";
import { createUser } from "../../../helpers/useFetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewClientForm = ({ setModal }: Prop) => {
  let { onChange, form, email, name, surnames, phone, message } =
    useForm<ClientInterface>({
      name: "",
      surnames: "",
      email: "",
      phone: "",
      message: "",
    });

  const [error, setErrror] = useState(false);
  const notify = () => toast("El cliente fue creado");

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ([email, surnames, phone, message, name].includes("")) {
      setErrror(true);
      setTimeout(() => {
        setErrror(false);
      }, 2000);
      return;
    }
    createUser("clients", form).then((res) => {
      const { user } = res;
      // setFormState({
      //     name: "",
      //     surnames: "",
      //     email: "",
      //     phone: "",
      //     message: ""
      // })
      if (user) {
        notify();
      }
    });
  };

  return (
    <form className={`${styles.formContainer}`} onSubmit={handleSubmit}>
      <CloseIcon className={styles.closeIcon} onClick={closeModal} />
      <h3>Agregar un Nuevo Cliente</h3>
      <ToastContainer />
      {error && (
        <div className={styles["alert-danger"]}>
          Todos los campos son obligatorios
        </div>
      )}
      <Input
        labelPlaceholder="Nombre"
        name="name"
        value={name}
        onChange={onChange}
      />
      <Input
        labelPlaceholder="Apellidos"
        name="surnames"
        value={surnames}
        onChange={onChange}
      />
      <Input
        labelPlaceholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <Input
        labelPlaceholder="Telefono"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <Textarea
        placeholder="Mensaje"
        rows={4}
        name="message"
        value={message}
        onChange={onChange}
      />
      <Button type="submit">Agregar</Button>
    </form>
  );
};

export default NewClientForm;
