import { LangObject } from "../../interfaces";
// import { process.env.NEXT_PUBLIC_DB_URL } from "../../utils/constanstApi";

export const createLang = async (
  ENDPOINT: string,
  idEmployee: string,
  data: LangObject,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${ENDPOINT}/${idEmployee}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    }
  );
  const responseData = await response.json();
  return responseData;
};

// http://localhost:5050/api/language/all/633a64c57aea5ece75d1a02e
export const getAllLanguagesByEmployee = async (
  idEmployee: string,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/language/all/${idEmployee}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const deleteLangByEmployee = async (idLang: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/language/${idLang}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  return data;
};
