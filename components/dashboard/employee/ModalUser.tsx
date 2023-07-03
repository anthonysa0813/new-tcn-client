import { Button, Modal, Text, useModal } from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";

const ModalUser = () => {
  const { setVisible, bindings } = useModal();
  return (
    <Modal
      scroll
      width="600px"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...bindings}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {/* {currentEmployee.name} {currentEmployee.surnames} */}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <div className="field">
          <strong>Mensaje: </strong>
          {/* <p>{currentEmployee.message}</p> */}
        </div>
        <div className="field">
          <strong>País:</strong>
          {/* <p>{currentEmployee.country}</p> */}
        </div>
        <div className="field">
          <strong>Código de País:</strong>
          {/* <p>{currentEmployee.callingCode}</p> */}
        </div>
        <div className="field">
          <strong>Email:</strong>
          {/* <p>{currentEmployee.email}</p> */}
        </div>
        <div className="field">
          <strong># telefónico:</strong>
          {/* <p>{currentEmployee.phone}</p> */}
        </div>
        <div className="field">
          <strong>Cv:</strong>
          <Button
            color="primary"
            auto
            size="sm"
            style={{ marginBlock: "1rem" }}
          >
            {/* <Link href={currentEmployee.cv || ""}>
              <a target="_blank">abrir el enlace del cv</a>
            </Link> */}
          </Button>
        </div>
        <div className="field">
          <strong>Tipo de Trabajo:</strong>
          {/* <p>{currentEmployee.typeJob}</p> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUser;
