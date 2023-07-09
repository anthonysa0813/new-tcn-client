import React, { useState } from "react";
import { Button, Dropdown, Input, Modal, Text } from "@nextui-org/react";
import DatalistInput from "react-datalist-input";
import { districtsDataResponse } from "../../../utils/activitiesToBussiness";
import { EmployeeInterface } from "../../../interfaces";
import { EmployeeApi } from "../../../apis/employee";

interface Prop {
  districtVisible: boolean;
  setDistrictVisible: React.Dispatch<React.SetStateAction<boolean>>;
  idService?: string;
  setCurrentDataByFilter: React.Dispatch<
    React.SetStateAction<[] | EmployeeInterface[]>
  >;
}

export const ModalSearchByDistrict = ({
  districtVisible,
  setDistrictVisible,
  setCurrentDataByFilter,
  idService,
}: Prop) => {
  const [districtCurrent, setDistrictCurrent] = useState("");
  const handler = () => setDistrictVisible(true);
  const closeHandler = () => {
    setDistrictVisible(false);
    console.log("closed");
  };

  const applySearch = async () => {
    // {{url}}/employees/search?idService=648e70953fa7afe6ab08fcd8&search=peru&type=country
    EmployeeApi.get(
      `/employees/search?idService=${idService}&search=${districtCurrent}&type=district`
    ).then(({ data }) => {
      setCurrentDataByFilter(data);
    });
  };

  return (
    <Modal
      closeButton
      animated={false}
      aria-labelledby="modal-title"
      open={districtVisible}
      onClose={closeHandler}
      css={{
        height: "40vh",
      }}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Buscar por el Distrito
        </Text>
      </Modal.Header>
      <Modal.Body>
        <DatalistInput
          className="dataList"
          placeholder=""
          label="Elige el Distrito"
          onSelect={(item) => setDistrictCurrent(item.value)}
          items={districtsDataResponse}
          value={districtCurrent}
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
