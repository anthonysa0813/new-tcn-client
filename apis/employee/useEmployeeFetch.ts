import {
  ChangeStatusRequest,
  RequestResetPassword,
  RequestSendNewPassword,
  RequestSendNewPasswordByDni,
} from "../../interfaces";

// http://localhost:5050/api/knoledge/?hability=Desarrollador front-end
export const getEmployeeByFilterHability = async (
  endpoint: string,
  habilityValue: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/?hability=${habilityValue}`
  );
  const dataResponse = await response.json();
  return dataResponse;
};

// http://localhost:5050/api/language/filter?language=Inglés&nivel=Básico
export const getEmployeeFilterByLanguage = async (
  endpoint: string,
  lang: string,
  level: string,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/filter?language=${lang}&nivel=${level}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

// http://localhost:5050/api/employees/6337ce27a2424699beb7cac2
export const saveInformationGeneral = async <T>(
  endpoint: string,
  idEmployee: string,
  data: T,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`,
    {
      method: "PUT",
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

export const getEmployeeById = async (
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
  const data = await response.json();
  return data;
};

export const sendEmailToNewPassword = async (
  endpoint: string,
  data: RequestSendNewPassword
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const sendEmailToNewPasswordByDni = async (
  endpoint: string,
  data: RequestSendNewPasswordByDni
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};


export const resetPassword = async (
  endpoint: string,
  data: RequestResetPassword
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const chenageStatusJobFetch = async (
  endpoint: string,
  data: ChangeStatusRequest
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const searchEmployeeByFilter = async (
  endpoint: string,
  query: string,
  valueQuery: string
) => {
  // http://localhost:5050/api/employees/search?statusJob=DESCARTADO
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}?${query}=${valueQuery}`
  );
  const dataResponse = await response.json();
  return dataResponse;
};

export const activateUser = async (
  endpoint: string,
  userId: any,
  token: any
) => {
  // console.log(`${process.env.NEXT_PUBLIC_DB_URL}${endpoint}/${userId}`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}${endpoint}/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );
  const dataResponse = await response.json();
  return dataResponse;
};
