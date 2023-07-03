import React, { useEffect, useState, useContext } from "react";
import { getFetchApi } from "../../helpers/useFetch";
import { EmployeeInterface } from "../../interfaces";
import styles from "../../styles/employees/ListEmployee.module.css";
import { generateExcelFile } from "../../helpers/exportFileExcel";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next/types";
import { TokenContext } from "../../context/CurrentToken";

interface PropCSV {
  nombre: string;
  apellidos: string;
  dni: string;
  celular: string;
  pais: string;
  codigo: string;
  email: string;
  estado: string;
}

const DownloadIcon = dynamic(() =>
  import("@mui/icons-material/FileDownload").then((res) => res.default)
);

const Head = dynamic(() => import("next/head").then((res) => res.default));

const LayoutDashboard = dynamic(() =>
  import("../../components/dashboard/LayoutDashboard").then(
    (res) => res.default
  )
);

const TableToEmployee = dynamic(() =>
  import("../../components/dashboard/clients/TableToEmployee").then(
    (res) => res.default
  )
);

const ButtonPrimary = dynamic(() =>
  import("../../components/buttons/Button").then((res) => res.default)
);

const ModalComponent = dynamic(() =>
  import("../../components/dashboard/ModalComponent").then((res) => res.default)
);

const ModalFilter = dynamic(() =>
  import("../../components/employees/ModalFilter").then((res) => res.default)
);

const Employees = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeInterface[]>([]);
  const [showModalFilters, setShowModalFilters] = useState(false);
  const [totalEmployee, setTotalEmployee] = useState(1);
  const [exportData, setExportData] = useState<PropCSV[] | []>([]);
  const [dataList, setDataList] = useState<EmployeeInterface[] | []>([]);
  const [totalEmployees, setTotalEmployees] = useState<
    EmployeeInterface[] | []
  >([]);
  const { privateToken } = useContext(TokenContext);

  useEffect(() => {
    getFetchApi("employees", privateToken.token).then((res) => {
      setEmployeeData(res.users);
      setTotalEmployees(res.users);
      setTotalEmployee(res.total);
    });
    const arrToExportExcel = employeeData.map((employee) => {
      return {
        nombre: employee?.name || "",
        apellidos: employee?.surnames || "",
        dni: employee?.dni || "",
        celular: employee?.phone || "",
        pais: employee?.country || "",
        codigo: employee?.callingCode || "",
        email: employee?.email || "",
        estado: employee?.statusJob || "",
      };
    });
    setExportData(arrToExportExcel);
  }, []);

  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Lista de Postulantes</title>
        <meta
          name="description"
          content="Contact BPO página administrador de Contact BPO - lista de postulantes"
        />
      </Head>
      <LayoutDashboard>
        <h1 className={styles.title}>Lista de todos los Postulantes</h1>
        <div className={styles.menu}>
          <div className={styles.actions}>
            <button
              className={styles.buttonExcel}
              onClick={() => generateExcelFile(totalEmployees)}
            >
              <DownloadIcon />
              Descargar Lista
            </button>
          </div>
          <ButtonPrimary
            color="dark"
            content="Añadir filtros"
            type="button"
            onClick={() => setShowModalFilters(true)}
            iconName="filter"
          />
        </div>
        <TableToEmployee
          total={totalEmployee}
          endpoint="employees"
          employeesData={employeeData}
          dataList={dataList}
          setDataList={setDataList}
        />
      </LayoutDashboard>
      {showModalFilters && (
        <ModalComponent>
          <ModalFilter
            setShowModalFilters={setShowModalFilters}
            setEmployeeData={setEmployeeData}
            setDataList={setDataList}
          />
        </ModalComponent>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await fetch(`${process.env.DB_URL}/services`);
  const data = await response.json();
  return {
    props: {
      services: data.services,
    },
  };
};

export default Employees;
