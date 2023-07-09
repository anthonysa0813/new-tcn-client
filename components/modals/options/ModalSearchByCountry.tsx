import React, { useState } from "react";
import { Button, Dropdown, Input, Modal, Text } from "@nextui-org/react";
import DatalistInput from "react-datalist-input";
import { countriesDataResponse } from "../../../utils/activitiesToBussiness";
import { EmployeeApi } from "../../../apis/employee";
import { EmployeeInterface } from "../../../interfaces";

interface Prop {
  countryVisible: boolean;
  setCountryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  idService?: string;
  setCurrentDataByFilter: React.Dispatch<
    React.SetStateAction<[] | EmployeeInterface[]>
  >;
}

export const ModalSearchByCountry = ({
  countryVisible,
  setCountryVisible,
  idService,
  setCurrentDataByFilter,
}: Prop) => {
  const [countryCurrent, setCountryCurrent] = useState("");
  const handler = () => setCountryVisible(true);
  const closeHandler = () => {
    setCountryVisible(false);
    console.log("closed");
  };

  const applySearch = async () => {
    // {{url}}/employees/search?idService=648e70953fa7afe6ab08fcd8&search=peru&type=country
    EmployeeApi.get(
      `/employees/search?idService=${idService}&search=${countryCurrent}&type=country`
    ).then(({ data }) => {
      setCurrentDataByFilter(data);
    });
  };

  return (
    <Modal
      closeButton
      animated={false}
      aria-labelledby="modal-title"
      open={countryVisible}
      onClose={closeHandler}
      css={{
        height: "40vh",
      }}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Buscar por el País
        </Text>
      </Modal.Header>
      <Modal.Body>
        <DatalistInput
          className="dataList"
          placeholder=""
          label="Elige el País"
          onSelect={(item) => setCountryCurrent(item.value)}
          items={countriesDataResponse}
          value={countryCurrent}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" auto flat color="primary" onPress={applySearch}>
          Buscar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
