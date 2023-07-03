import { KnoledgeInterface } from "../../interfaces";

export const createKnoledge = async (
  endpoint: string,
  idEmployee: string,
  data: KnoledgeInterface,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const getKnoledges = async (
  endpoint: string,
  idEmployee: string,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const deleteKnoledgesFetch = async (
  endpoint: string,
  idKnowledge: string,
  token: string
) => {
  console.log({ token });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idKnowledge}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};
