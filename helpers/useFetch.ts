import Cookies from "js-cookie";
import { ClientInterface, FormProp } from "../interfaces";

const token = Cookies.get("token");

export const loginFetchApi = async (endpoint: string, dataUser: FormProp) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUser),
    }
  );
  const data = await response.json();
  return data;
};

export const getFetchApi = async (endpoint: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const changeStatus = async (endpoint: string, id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${id}/active`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (
  endpoint: string,
  dataUser: ClientInterface
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUser),
    }
  );
  const data = await response.json();
  return data;
};
