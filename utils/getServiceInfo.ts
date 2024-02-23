import { ServiceApi } from "../apis/services";
import { ServiceI } from "../interfaces/index";

export const getServiceInfo = async (id: string) => {
  try {
    const serv = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/services/${id}`
    );
    const dataResponse = await serv.json();
    return dataResponse;
    //  const { data } = await ServiceApi.get(id);

    //  console.log(data);

    //  return data;
  } catch (error) {
    console.log(error);
  }
};
