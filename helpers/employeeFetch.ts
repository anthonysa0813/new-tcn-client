import { FormProp, Service, ServiceI } from "../interfaces";

// export const loginFetchApi = async (endpoint: string, dataUser: FormProp) => {
//     const response = await fetch(`http://localhost:5050/api/${endpoint}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(dataUser),
//     });
//     const data = await response.json();
//     return data;
//   };

export const createNewServicefetch = async (body: ServiceI, token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
  return data;
};
export const updateNewServicefetch = async (
  body: ServiceI,
  token: string,
  id: any
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/services/update/${id || ""}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  console.log(data);
  return data;
};
