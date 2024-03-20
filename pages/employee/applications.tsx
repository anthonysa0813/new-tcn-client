import { GetServerSideProps } from "next";
import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  EmployeeContext,
  EmployeeContextProps,
} from "../../context/EmployeeContext";
import {
  EmployeeInterface,
  IApplicationJobResponse,
  Service,
} from "../../interfaces";
import styles from "../../styles/employees/Applications.module.css";
import { EmployeeApi } from "../../apis/employee";
import { TokenContext } from "../../context/CurrentToken";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Head = dynamic(() => import("next/head").then((res) => res.default));

const CardCollapse = dynamic(
  () => import("../../components/dashboard/employee/CardCollapse"),
  {
    ssr: false,
  }
);

const LayoutEmployee = dynamic(() => import("./layoutEmployee"), {
  ssr: false,
});

const ApplicationsPage = () => {
  const { employeeGlobal, setEmployeeGlobal } =
    useContext<EmployeeContextProps>(EmployeeContext);
  const [applicationsState, setApplicationsState] = useState<Service[] | []>(
    []
  );
  const [currentApplicationByUser, setCurrentApplicationByUser] = useState<
    IApplicationJobResponse[] | []
  >([]);
  const { privateToken } = useContext(TokenContext);
  const router = useRouter();

  useEffect(() => {
    if (Boolean(Object.keys(employeeGlobal).length)) {
      getInfo(employeeGlobal.id || "");
    }
  }, [employeeGlobal]);

  const getInfo = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/employees/${id}`,
      {
        headers: {
          Authorization: privateToken.token,
        },
      }
    );
    const data = await res.json();

    console.log({ employeeGlobal: employeeGlobal, privateToken });
    const { data: getInfoApplication } = await EmployeeApi.get(
      `/employees/get-applications-jobs/${employeeGlobal.id}`,
      {
        headers: {
          Authorization: privateToken.token,
        },
      }
    );
    setCurrentApplicationByUser(getInfoApplication);
    setApplicationsState(data.service);
  };
  return (
    <>
      <Head>
        <title>Contact Bpo | Mis Postulaciones</title>
        <meta
          name="description"
          content="Página de mis postulaciones en Contact BPO"
        />
      </Head>
      <LayoutEmployee name="aplicaciones de trabajo">
        <div className={styles.wrapper}>
          {applicationsState.length > 0 && (
            <h4 className="text-3xl my-3">Mis Postulaciones</h4>
          )}

          <div className={styles.applicationsGrid}>
            {applicationsState.length === 0 && (
              <div className="md:h-[50vh] w-full bg-sky-50 p-3 rounded-lg grid grid-cols-4 gap-2">
                <div className="md:col-span-2 col-span-full flex items-center justify-center">
                  <Image
                    src="https://res.cloudinary.com/da0d2neas/image/upload/v1710483912/users.png"
                    height={200}
                    width={200}
                    alt="empty"
                    className="md:w-56 w-32 h-32 md:h-56 rounded-full object-contain"
                  />
                </div>
                <div className="md:col-span-2 col-span-full flex items-center flex-col text-center md:text-left justify-center">
                  <span className="md:text-4xl text-2xl  font-bold text-blue-500">
                    No haz aplicado a ningún puesto
                  </span>
                  <Link
                    href="/employee/campaign"
                    className="px-3 py-2 rounded-lg text-center bg-slate-950 text-white font-semibold mt-4 md:self-start hover:bg-yellow-500 hover:text-slate-950 transition ease "
                  >
                    Ver Puestos Disponibles
                  </Link>
                </div>
              </div>
            )}
            {applicationsState.map((service: Service, index) => {
              return (
                <CardCollapse
                  key={service._id}
                  service={service}
                  applications={currentApplicationByUser}
                />
              );
            })}
          </div>
        </div>
      </LayoutEmployee>
    </>
  );
};

export default ApplicationsPage;

