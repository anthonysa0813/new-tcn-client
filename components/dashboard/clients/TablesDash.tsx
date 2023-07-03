import React from "react";
import { Checkbox, Table } from "@nextui-org/react";
import { ClientData, ClientResponse } from "../../../interfaces";
import { changeStatus } from "../../../helpers/useFetch";
import { useRouter } from "next/router";

// import { ClientResponse } from "../../../interfaces";

const TablesDash = ({ data }: ClientData) => {
  const valuesHead = [
    "Estado",
    "Nombre Completo",
    "Email",
    "Mensaje",
    "Teléfono",
    "Status",
  ];
  const router = useRouter();
  const changeStatusById = async (id: string) => {
    const res = await changeStatus("clients", id);
    if (res) {
      router.reload();
    }
  };

  return (
    <Table
      aria-label="Example table with static content"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
    >
      <Table.Header>
        {valuesHead.map((value, index) => {
          return <Table.Column key={index}>{value}</Table.Column>;
        })}
      </Table.Header>
      <Table.Body>
        {data.map((user: ClientResponse) => {
          return (
            <Table.Row key={user._id}>
              <Table.Cell>
                <input
                  type="checkbox"
                  onClick={() => changeStatusById(user._id || "")}
                  checked={user.status ? true : false}
                />
              </Table.Cell>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.message}</Table.Cell>
              <Table.Cell>{user.phone}</Table.Cell>
              <Table.Cell>
                {user.status ? "Atendido" : "Sin atender"}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TablesDash;
