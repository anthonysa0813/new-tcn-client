import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import { ServiceApi } from "../../../apis/services";
import { EmployeeInterface, ServiceI } from "../../../interfaces";
import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import TableListStaticData from "../../../components/dashboard/clients/TableListStaticData";
import { TokenContext } from "../../../context/CurrentToken";
import { Button, Dropdown, Input, Modal, Text, useModal } from "@nextui-org/react";
import styles from "../../../styles/admin/TableEmployee.module.css";
import { EmployeeApi } from "../../../apis/employee";
import {
  ModalSearchByCountry,
  ModalSearchByDistrict,
  ModalSearchByEmail,
} from "../../../components/modals/options";
import { SelectEmployeeContext } from "../../../context/selectUser";
import { generateExcelFile } from "../../../helpers/exportFileExcel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Link from "next/link";
import { Switch } from "@nextui-org/react";

import { useRouter } from "next/router";
import TableListStaticData2 from "../../../components/dashboard/clients/TableListStaticData2";
import { SpamJobInterface } from "../../../interfaces/spamJob";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";


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
  const { selectEmployees, setSelectEmployees } = useContext(
    SelectEmployeeContext
  );
  const { setVisible, bindings } = useModal();
  const [currentPuesto, setCurrentPuesto] = useState("");
  const router = useRouter();
  const [isSpamTable, setIsSpamTable] = useState(false);
  const [allUserSpamJob, setAllUserSpamJob] = useState<SpamJobInterface[] | []>([]);


  useEffect(() => {
    getDataService().then((res: any) => {
      // setServicesEmployees(res);
      console.log({
        currentDataByFilter: res.employees
      })
    });
  }, [])

  useEffect(() => {
    if (isSpamTable) {
      // console.log({allUserSpamJob})
      // const selectIsSpamFalse = allUserSpamJob.filter((item: any) => item.isSpam === true);
      // console.log({selectIsSpamFalse})
      // const selectOnlyEmployees = selectIsSpamFalse.map((item: any) => item.employee);
      // setCurrentDataByFilter(selectOnlyEmployees);
      getDataService().then((res: any) => {
        const selectIsSpamFalse = res.filter(
          (item: any) => item.isSpam === true
        );
        console.log({
          response: res,
        });
        const selectOnlyEmployees = selectIsSpamFalse.map(
          (item: any) => item.employee
        );
        setCurrentDataByFilter(selectOnlyEmployees);
      });
    } else {
      getDataService().then((res: any) => {
        const selectIsSpamFalse = res.filter((item: any) => item.isSpam === false);
        console.log({
          response: res
        })
        const selectOnlyEmployees = selectIsSpamFalse.map((item: any) => item.employee);
        setCurrentDataByFilter(selectOnlyEmployees);
      })
    }
  }, [isSpamTable])

  const getDataService = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/spamJob/get-spam-job-by-id-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({idService: id})
      }
    );
    const res = await data.json();
    return res.spamJob;
  }


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
      // getDataService().then((res: any) => {
      //   const selectIsSpamFalse = res.filter((item: any) => item.isSpam === false);
      //   console.log({selectIsSpamFalse})
      //   setCurrentDataByFilter(selectIsSpamFalse);
      // })
    }
  }, [id]);

  const getInfo = async () => {
    const { data } = await ServiceApi.get(`/${id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    });
    getDataService().then((res: any) => {
      const selectIsSpamFalse = res.filter((item: any) => item.isSpam === false);
      const selectOnlyEmployees = selectIsSpamFalse.map((item: any) => item.employee);
      // console.log({ user: res });
      setAllUserSpamJob(res);
      setCurrentDataByFilter(selectOnlyEmployees);
    })

    setServicesEmployees(data);
    // console.log(data);
    // setCurrentDataByFilter(data.employees);
  };

  const changeStatusService = async (currentService: ServiceI) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/services/${currentService._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: privateToken.token,
        },
      }
    ).then((resServ) => {
      if (resServ.status === 200) {
        fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services`)
          .then((res) => res.json())
          .then((data) => {
            // console.log({ servciesActives });
            router.reload();
          });
      }
    });
  };

   const setInfoJob = async (name: string) => {
    setCurrentPuesto(name);
    setVisible(true);
  };

   const deleteJob = async (id: string) => {
    const { data } = await ServiceApi.delete(`/${id}`, {
      headers: {
        Authorization: privateToken.token,
      },
    });
    router.push("/admin/listServices");
  };

  return (
    <>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Body>
          <div className={styles.field}>
            <strong>
              ¿Seguro que desea Eliminar el Puesto <span>{currentPuesto}</span>?
            </strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            onClick={() => deleteJob(servicesEmployees._id || "")}
          >
            Sí, eliminar
          </Button>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
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
        <div className="flex items-center justify-between  flex-wrap gap-5">
          <div className="md:mb-10">
            <div className="flex gap-8 items-center justify-between  md:mb-10 ">
              <div className="">
                <Link
                  href="/admin/listServices"
                  className="flex items-center gap-2 mb-3 hover:text-blue-600 transition ease-out cursor-pointer"
                >
                  <KeyboardBackspaceIcon className="cursor-pointer" />
                  <span>Atrás</span>
                </Link>
                <h1 className="md:text-2xl text-sm font-semibold">
                  {servicesEmployees.title}
                </h1>
                <span>ID: {servicesEmployees._id}</span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <Button
                  size={"xs"}
                  style={{ padding: ".5rem" }}
                  color={servicesEmployees.status ? "success" : "error"}
                  onClick={() => changeStatusService(servicesEmployees)}
                  className={`${
                    servicesEmployees.status
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {" "}
                  {servicesEmployees.status ? "Activo" : "Finalizado"}
                </Button>
                <Link href={`/admin/${servicesEmployees._id}/updateService`}>
                  <Button
                    size={"xs"}
                    style={{ padding: ".5rem" }}
                    color={"warning"}
                    className="bg-yellow-500 text-white"
                    onClick={() => console.log("editando")}
                  >
                    {" "}
                    Editar Puesto
                  </Button>
                </Link>
                <Button
                  size={"xs"}
                  style={{ padding: ".5rem" }}
                  color={"error"}
                  className="bg-red-500 text-white"
                  onClick={() => setInfoJob(servicesEmployees.title)}
                >
                  {" "}
                  Eliminar Puesto
                </Button>
              </div>
            </div>
            {/* <Dropdown>
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
            </Dropdown> */}
          </div>
          <div className="flex items-center flex-wrap md:gap-5 gap-2 mb-4 ">
            <button
              className="py-2 text-sm px-3 rounded-md text-white font-semibold bg-slate-800 hover:bg-slate-950 transition ease hover:cursor-pointer"
              onClick={() => generateExcelFile(currentDataByFilter)}
            >
              <FileDownloadIcon /> todos los postulantes
            </button>

            <button
              className="py-2 text-sm px-3 rounded-md text-white font-semibold bg-green-500 hover:bg-green-800 transition ease hover:cursor-pointer"
              onClick={() => generateExcelFile(selectEmployees)}
            >
              <FileDownloadIcon /> únicamente los Seleccionados (
              {selectEmployees.length})
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold">
            Seleccionar los usuarios en SPAM:
          </span>
          <Switch
            checked={isSpamTable}
            onChange={() => setIsSpamTable(!isSpamTable)}
            aria-label="Automatic updates"
          />
        </div>
        {
          currentDataByFilter.length > 0 ? (
            <TableListStaticData2
              isSpamTable={isSpamTable}
          data={currentDataByFilter || []}
          idService={servicesEmployees._id || ""}
          offsetSliceValue={servicesEmployees.employees?.length || 5}
            />
          ) : (
            <span>Aún no hay usuarios registrados aquí...</span>
          )
        }
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


