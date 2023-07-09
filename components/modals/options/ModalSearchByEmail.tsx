import React, { useState } from "react";
import { Button, Dropdown, Input, Modal, Text } from "@nextui-org/react";
import DatalistInput from "react-datalist-input";
import { countriesDataResponse } from "../../../utils/activitiesToBussiness";
import { EmployeeInterface } from "../../../interfaces";
import { EmployeeApi } from "../../../apis/employee";

interface Prop {
  emailVisible: boolean;
  setEmailVisible: React.Dispatch<React.SetStateAction<boolean>>;
  idService?: string;
  setCurrentDataByFilter: React.Dispatch<
    React.SetStateAction<[] | EmployeeInterface[]>
  >;
}

export const ModalSearchByEmail = ({
  emailVisible,
  setEmailVisible,
  setCurrentDataByFilter,
  idService,
}: Prop) => {
  const [emailCurrent, setEmailCurrent] = useState("");
  const handler = () => setEmailVisible(true);
  const closeHandler = () => {
    setEmailVisible(false);
    console.log("closed");
  };

  const applySearch = async () => {
    // {{url}}/employees/search?idService=648e70953fa7afe6ab08fcd8&search=peru&type=country
    EmployeeApi.get(
      `/employees/search?idService=${idService}&search=${emailCurrent}&type=email`
    ).then(({ data }) => {
      setCurrentDataByFilter(data);
    });
  };

  return (
    <Modal
      closeButton
      animated={false}
      aria-labelledby="modal-title"
      open={emailVisible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Buscar por Email
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Email"
          onChange={(e) => setEmailCurrent(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="primary" onPress={applySearch}>
          Buscar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
