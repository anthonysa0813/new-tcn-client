import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  Pagination,
  Table,
  Text,
  useModal,
  Loading,
} from "@nextui-org/react";
import { EmployeeInterface } from "../../../interfaces";
import { getFetchApi } from "../../../helpers/useFetch";
import Link from "next/link";
import styles from "../../../styles/admin/TableEmployee.module.css";
import { calculatePagination } from "../../../helpers/calculatePagination";
import { UserContext } from "../../../context/UserContext";
import DropDownSelect from "../../buttons/DrownDownSelect";
import { getLinkToCv } from "../../../helpers/getLinkCv";
import { TokenContext } from "../../../context/CurrentToken";

type Props = {
  total: string | number;
  employeesData: EmployeeInterface[] | [];
  endpoint?: string;
  dataList: EmployeeInterface[] | [];
  setDataList: React.Dispatch<React.SetStateAction<EmployeeInterface[] | []>>;
};

const TableToEmployee = ({
  total,
  endpoint = "",
  employeesData,
  dataList,
  setDataList,
}: Props) => {
  const { setVisible, bindings } = useModal();
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeInterface>(
    {} as EmployeeInterface
  );
  const { privateToken } = useContext(TokenContext);

  const { userGlobal } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (pageNumber === 1) {
      getFetchApi(
        `${endpoint}?offset=${0}&limit=${5}`,
        privateToken.token
      ).then((res) => {
        setDataList(res.users);
      });
    } else {
      getFetchApi(
        `${endpoint}?offset=${pageNumber * 5}&limit=${5}`,
        privateToken.token
      ).then((res) => {
        setDataList(res.users);
      });
    }
  }, [endpoint]);

  useEffect(() => {
    setLoading(true);
    getFetchApi(
      `${endpoint}?offset=${pageNumber * 5}&limit=${5}`,
      privateToken.token
    ).then((res) => {
      console.log(res);
      setDataList(res.users);
      if (res.users.length > 0) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [pageNumber, endpoint]);

  useEffect(() => {
    // if (employeesData.length > 0) {
    //   setDataList(employeesData);
    // }
  }, [employeesData]);

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <Table
          aria-label="Example table with static content"
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header>
            <Table.Column>Nombre Completo</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Telefóno</Table.Column>
            <Table.Column>Información general</Table.Column>
            <Table.Column>Estado</Table.Column>
          </Table.Header>
          <Table.Body>
            {dataList.length === 0 ? (
              <Table.Row>
                <Table.Cell>{"No existen más datos"}</Table.Cell>
                <Table.Cell>{""}</Table.Cell>
                <Table.Cell>{""}</Table.Cell>
                <Table.Cell>{""}</Table.Cell>
                <Table.Cell>{""}</Table.Cell>
              </Table.Row>
            ) : (
              dataList.map((user: EmployeeInterface) => {
                return (
                  <Table.Row key={user?.id}>
                    <Table.Cell>{user?.name}</Table.Cell>
                    <Table.Cell>{user?.email}</Table.Cell>
                    <Table.Cell>{user?.phone}</Table.Cell>
                    <Table.Cell>
                      <Button
                        color="primary"
                        auto
                        onClick={() => {
                          setVisible(true);
                          setCurrentEmployee(user);
                        }}
                      >
                        <span>Ver información</span>
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      {userGlobal.role === "ADMIN_ROLE" ? (
                        <DropDownSelect
                          statusUser={user?.statusJob ? user?.statusJob : ""}
                          idUser={user?.id}
                        />
                      ) : (
                        <span>{user?.statusJob}</span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      )}
      <div className={styles.actions}>
        <Pagination
          total={calculatePagination(Number(total), 5)}
          initialPage={pageNumber}
          onChange={(page: number) => setPageNumber(page - 1)}
        />
      </div>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={24} className={styles.title}>
            {currentEmployee.name} {currentEmployee.surnames}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.field}>
            <strong>País:</strong>
            <p>{currentEmployee.country}</p>
          </div>
          <div className={styles.field}>
            <strong>Código de País:</strong>
            <p>+{currentEmployee.callingCode}</p>
          </div>
          <div className={styles.field}>
            <strong>Email:</strong>
            <p>{currentEmployee.email}</p>
          </div>
          <div className={styles.field}>
            <strong>Número telefónico:</strong>
            <p>{currentEmployee.phone}</p>
          </div>
          <div className={styles.field}>
            <strong>LinkedIn:</strong>
            <p>{currentEmployee.linkedin}</p>
          </div>
          <div className={styles.field}>
            <strong>GitHub:</strong>
            <p>{currentEmployee.github}</p>
          </div>
          <div className={styles.field}>
            <strong>Cv:</strong>
            <Button
              color="primary"
              auto
              size="sm"
              style={{ marginBlock: "1rem" }}
            >
              <Link
                href={getLinkToCv(currentEmployee.cv, true) || ""}
                target="_blank"
              >
                abrir CV
              </Link>
            </Button>
          </div>
          <div className={styles.field}>
            <strong>Tipo de Trabajo:</strong>
            <p>{currentEmployee.typeJob}</p>
          </div>
          <div className={styles.field}>
            <strong>Mensaje: </strong>
            <p>{currentEmployee.message}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableToEmployee;
