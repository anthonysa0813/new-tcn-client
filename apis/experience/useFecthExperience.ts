import { Experience } from "../../interfaces";
import { API_URL } from "../../utils/constanstApi";

// http://localhost:5050/api/experiences/633a64c57aea5ece75d1a02e
export const createExperienceApi = async (
  endpoint: string,
  dataExp: Experience,
  idEmployee: string
) => {
  console.log(`${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataExp),
    }
  );
  const data = await response.json();
  return data;
};

export const getExperienceByEmployee = async (
  endpoint: string,
  idEmployee: string,
  token: string
) => {
  console.log(`${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}`);
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

export const deleteExperience = async (
  endpoint: string,
  idEmployee: string,
  idExperience: string,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}/${idExperience}`,
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

// http://localhost:5050/api/experiences/unique/633a64c57aea5ece75d1a02e/635319f60caba5ed2ff43c4c
export const updateExperience = async (
  endpoint: string,
  idEmployee: string,
  idExperience: string,
  dataExp: Experience,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/${endpoint}/${idEmployee}/${idExperience}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(dataExp),
    }
  );
  const data = await response.json();
  return data;
};

export const getUniqueExperience = async (
  endpoint: string,
  idEmployee: string,
  idExperience: string
) => {
  const response = await fetch(
    `${API_URL}/experiences/${endpoint}/${idEmployee}/${idExperience}`
  );
  console.log(
    `${API_URL}/experiences/${endpoint}/${idEmployee}/${idExperience}`
  );
  const data = await response.json();
  return data;
};
