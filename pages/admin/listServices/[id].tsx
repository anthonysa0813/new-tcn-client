import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import { ServiceApi } from "../../../apis/services";
import { EmployeeInterface, ServiceI } from "../../../interfaces";
import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import TableListStaticData from "../../../components/dashboard/clients/TableListStaticData";
import { TokenContext } from "../../../context/CurrentToken";
import { Button, Dropdown, Input, Modal, Text } from "@nextui-org/react";
import styles from "../../../styles/admin/TableEmployee.module.css";
import { EmployeeApi } from "../../../apis/employee";
import {
  ModalSearchByCountry,
  ModalSearchByDistrict,
  ModalSearchByEmail,
} from "../../../components/modals/options";
interface Prop {
  id: string;
}

const filterItems = [
  {
    key: "Ninguno",
    name: "Ninguno",
  },
  {
    key: "country",
    name: "country",
  },
  {
    key: "district",
    name: "district",
  },
  {
    key: "email",
    name: "email",
  },
];

const ListUsersByPositionJobPage = ({ id }: Prop) => {
  // console.log(props);
  const [servicesEmployees, setServicesEmployees] = useState<ServiceI>(
    {} as ServiceI
  );
  const { privateToken } = useContext(TokenContext);
  const [currentDataByFilter, setCurrentDataByFilter] = useState<
    EmployeeInterface[] | []
  >([]);
  const [currentOption, setCurrentOption] = useState("");
  const [countryVisible, setCountryVisible] = useState(false);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);

  useEffect(() => {
    if (currentOption === "country") {
      setDistrictVisible(false);
      setCountryVisible(true);
      setEmailVisible(false);
    } else if (currentOption === "district") {
      setEmailVisible(false);
      setDistrictVisible(true);
      setCountryVisible(false);
    } else if (currentOption === "email") {
      setEmailVisible(true);
      setDistrictVisible(false);
      setCountryVisible(false);
    }
  }, [currentOption]);

  useEffect(() => {
    console.log(id);
    if (privateToken.token) {
      getInfo();
    }
  }, [privateToken.token]);

  const getInfo = async () => {
    const { data } = await ServiceApi.get(`/${id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    });

    setServicesEmployees(data);
    console.log(data);
    setCurrentDataByFilter(data.employees);
  };

  return (
    <>
      <ModalSearchByCountry
        countryVisible={countryVisible}
        setCountryVisible={setCountryVisible}
        setCurrentDataByFilter={setCurrentDataByFilter}
        idService={id}
      />
      <ModalSearchByDistrict
        districtVisible={districtVisible}
        setDistrictVisible={setDistrictVisible}
        setCurrentDataByFilter={setCurrentDataByFilter}
        idService={id}
      />
      <ModalSearchByEmail
        emailVisible={emailVisible}
        setEmailVisible={setEmailVisible}
        setCurrentDataByFilter={setCurrentDataByFilter}
        idService={id}
      />
      <LayoutDashboard>
        <div className="">
          <h1>{servicesEmployees.title}</h1>
          <Dropdown>
            <Dropdown.Button flat>Aplicar Filtros</Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              {filterItems.map((item) => {
                return (
                  <Dropdown.Item key={item.key}>
                    <span
                      className={styles.item}
                      onClick={() => {
                        setCurrentOption(item.name);
                      }}
                    >
                      {item.name}
                    </span>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <TableListStaticData
          data={currentDataByFilter || []}
          idService={servicesEmployees._id || ""}
          offsetSliceValue={servicesEmployees.employees?.length || 5}
        />
      </LayoutDashboard>
    </>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params as { id: string };
  console.log({ id });

  return {
    props: {
      id,
    },
  };
};

export default ListUsersByPositionJobPage;
