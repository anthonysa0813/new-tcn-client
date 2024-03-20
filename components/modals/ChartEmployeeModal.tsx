import React, {useState} from 'react';
import { Modal, Button as ButtonNextUi, Text } from "@nextui-org/react";


const ChartEmployeeModal = () => {
  const [visible, setVisible] = useState(false);


   const closeHandler = () => {
     setVisible(false);
   
   };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={closeHandler}
      width="500px"
    >
      <Modal.Header>
        <Text id="modal-title" size={32}>
          Tabla Estadístiva de Registro de Empleados:
        </Text>
      </Modal.Header>
      <Modal.Body>
       <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi, alias.</p>
      </Modal.Body>
      <Modal.Footer>
        <ButtonNextUi auto flat color="error" onPress={closeHandler}>
          Cerrar
        </ButtonNextUi>
      </Modal.Footer>
    </Modal>
  );
}

export default ChartEmployeeModal;

