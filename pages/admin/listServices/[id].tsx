import { GetServerSideProps } from "next";
import React, { useEffect, useState, useContext } from "react";
import { ServiceApi } from "../../../apis/services";
import { ServiceI } from "../../../interfaces";
import LayoutDashboard from "../../../components/dashboard/LayoutDashboard";
import TableListStaticData from "../../../components/dashboard/clients/TableListStaticData";
import { TokenContext } from "../../../context/CurrentToken";

interface Prop {
  id: string;
}

const ListUsersByPositionJobPage = ({ id }: Prop) => {
  // console.log(props);
  const [servicesEmployees, setServicesEmployees] = useState<ServiceI>(
    {} as ServiceI
  );
  const { privateToken } = useContext(TokenContext);

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
  };

  return (
    <LayoutDashboard>
      <h1>{servicesEmployees.title}</h1>
      <TableListStaticData
        data={servicesEmployees.employees || []}
        idService={servicesEmployees._id || ""}
        offsetSliceValue={servicesEmployees.employees?.length || 5}
      />
    </LayoutDashboard>
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
