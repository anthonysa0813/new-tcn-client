"use client";
import React, { useEffect, useState, useContext, useMemo } from "react";
import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import { ServiceI } from "../../../interfaces";
import styles from "../../../styles/admin/ListServices.module.css";
import ServiceItem from "../../../components/servcies/ServiceItem";
import dynamic from "next/dynamic";
import { TokenContext } from "../../../context/CurrentToken";
import { API_URL } from "../../../utils/constanstApi";
import { useRouter } from "next/router";
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableContainer,
} from "material-react-table";
import Link from "next/link";
import { format } from 'date-fns';


const Head = dynamic(() => import("next/head").then((res) => res.default));

interface Prop {
  services: ServiceI[] | [];
}

export type TableI = {
  title: string;
  numberPost: string;
  action: string;
};

interface Propcell {
  rowData: ServiceI;
  cellData: string;
}



const ListServicesPage = () => {
  const [servicesArr, setServicesArr] = useState<ServiceI[] | []>([]);
  const { privateToken } = useContext(TokenContext);
  const router = useRouter();

   const columns = useMemo<MRT_ColumnDef<ServiceI>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        // Custom renderer for the title as a Link
        Cell: ({renderedCellValue, row}: any) => (
          <Link href={`/admin/listServices/${row.original._id}`} className="font-semibold text-gray-800 hover:text-blue-700 transition ease">
            {renderedCellValue} 
            {/* {JSON.stringify(row.original)} */}
          </Link>
        )
      },
      {
        accessorKey: 'employees',
        header: 'Postulantes',
        Cell: ({renderedCellValue, row}: any) => (
          <span>{renderedCellValue.length} Postulantes</span>
         )
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
       },
       {
        accessorKey: 'createdAt',
         header: 'Fecha de creación',
         Cell: ({renderedCellValue, row}: any) => (
           <span>{format(new Date(renderedCellValue), 'dd/MM/yyyy')}</span>
          )
       },
       {
         accessorKey: "order",
          header: "Orden",
       }
      // Add more columns as needed
    ],
    [],
  );


   
  useEffect(() => {
    fetch(`https://work.contactamericas.com/api/services`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const servciesActives = res.services.filter(
          (service: ServiceI) => service.status
        );

         servciesActives.sort((a: ServiceI, b: ServiceI) => {
          if ((a.order ?? 0) > (b.order ?? 0)) {
            return 1;
          }
          if ((a.order ?? 0) < (b.order ?? 0)) {
            return -1;
          }
          return 0;
        });

        console.log({ servciesActives });

        setServicesArr(servciesActives);
        // setServicesArr(res.services);
      });
  }, []);

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
          
          });
      }
    });
  };

  const handleChangeOrder = (serviceId: string, order: number) => {
    fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services/update-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: privateToken.token,
      },
      body: JSON.stringify({ order: order, idService: serviceId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setServicesArr(data.servciesActives);

      });
  }


   const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data: servicesArr,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps:  ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
           const draggedRowIndex = draggingRow.index;
          const hoveredRowIndex = (hoveredRow as MRT_Row<ServiceI>).index;
          const serviceValue = hoveredRow.original as ServiceI;

          console.log('Índice de fila arrastrada:', draggedRowIndex);
          console.log('Índice de fila sobre la que se soltó:', hoveredRowIndex);
          console.log({draggingRow: draggingRow.original, hoveredRow: hoveredRow.original})

          // apply handleChangeOrder
          // handleChangeOrder(serviceValue._id || "", hoveredRowIndex);
          fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services/update-order`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: privateToken.token,
            },
            body: JSON.stringify({ order: hoveredRowIndex, idService: draggingRow.original._id || "" }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log({ data });
              // router.reload();
            });
          
          fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services/update-order`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: privateToken.token,
            },
            body: JSON.stringify({ order: draggedRowIndex , idService: hoveredRow.original?._id || "" }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log({ data });
              // router.reload();
            });

          // Customize how rows are reordered or update data accordingly
          servicesArr.splice(
            (hoveredRow as MRT_Row<ServiceI>).index,
            0,
            servicesArr.splice(draggingRow.index, 1)[0],
          );
          setServicesArr([...servicesArr]);
        }
      },
    }),
  });
  


  return (
    <>
      <Head>
        <title>Contact Bpo Admin | Lista de Puestos de Trabajos</title>
        <meta
          name="description"
          content="Contact BPO página administrador de Contact BPO - lista de trabajos"
        />
      </Head>
      <LayoutDashboard>
        <>
          <h1 className={styles.title}>Puestos de trabajo</h1>
          <hr />
          <MRT_TableContainer table={table} />
        </>
      </LayoutDashboard>
    </>
  );
};

export default ListServicesPage;

