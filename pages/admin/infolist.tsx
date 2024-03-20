import React, { useContext } from "react";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import Head from "next/head";
import { SelectEmployeeContext } from "../../context/selectUser";
import TableListStaticData from "../../components/dashboard/clients/TableListStaticData";
import Link from "next/link";

const infolist = () => {
  const { selectEmployees, setSelectEmployees } = useContext(
    SelectEmployeeContext
  );
  return (
    <>
      <Head>
        <title>Contact Americas Admin | Lista de usuarios Seleccionados</title>
      </Head>

      <LayoutDashboard>
        <Link
          href="/admin/listUsers"
          className="flex items-center gap-2 my-4 font-semibold hover:text-blue-500 transition ease"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          <span>Regresar</span>
        </Link>
        <h1>Lista de Usuarios Seleccionados</h1>
        <TableListStaticData
          data={selectEmployees || []}
          idService={""}
          offsetSliceValue={5}
        />
      </LayoutDashboard>
    </>
  );
};

export default infolist;

