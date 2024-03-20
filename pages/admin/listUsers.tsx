import React, { useState, useEffect, useContext } from "react";
import LayoutDashboard from "../../components/dashboard/LayoutDashboard";
import { Button, Dropdown } from "@nextui-org/react";
import styles from "../../styles/admin/ListUsers.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "@nextui-org/react";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { TokenContext } from "../../context/CurrentToken";
import { getAllUsers } from "../../apis/auth/fetchFunctions";
import { EmployeeApi } from "../../apis/employee";
import { EmployeeInterface } from "../../interfaces";
import TableListStaticData from "../../components/dashboard/clients/TableListStaticData";
import TableList from "../../components/dashboard/clients/TableList";
import { DropDownSelectGlobal } from "../../components/buttons";
import { SelectEmployeeContext } from "../../context/selectUser";
import { EmployeeJobApi } from "../../apis/employeeJob";
import Link from "next/link";
import { Modal, Button as ButtonNextUi, Text } from "@nextui-org/react";
import { EmployeeTotalResponse } from "../../interfaces/employee";
import { useRouter} from "next/router"


const Head = dynamic(() => import("next/head").then((res) => res.default));

interface PropValue {
  _id: string;
  total: number;
}

const ListUsersPage = () => {
  const { privateToken } = useContext(TokenContext);
  const [getAllUsers, setGetAllUsers] = useState<EmployeeInterface[] | []>([]);
  const [visible, setVisible] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const [showModalChart, setShowModalChart] = useState(false);
  const [monthsNumbers, setMonthsNumbers] = useState(0);
  const [arrMonths, setArrMonths] = useState([] as Number[]);
  const router = useRouter();
  const [numbersEmployeesTotal, setNumbersEmployeesTotal] = useState<
    Number[] | []
    >([]);
  const [monthsNames, setMonthsNames] = useState([
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
  ])
  const [showTable, setShowTable] = useState(false);
  const [showPaginate, setShowPaginate] = useState(true);
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(true);
  const [valueEmailInput, setValueEmailInput] = useState("");
  const [valuePaisInput, setValuePaisInput] = useState("");
  const [valueDistritoInput, setValueDistritoInput] = useState("");
  const [currentDataMonths, setCurrentDataMonths] = useState<PropValue[] | []>([])

  const [getUserNotApply, setGetUserNotApply] = useState<
    EmployeeInterface[] | []
  >([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [offsetNumber, setOffsetNumber] = useState(0);
  const [titleState, setTitleState] = useState("Lista de Todos los usuarios");
  const [firstData, setFirstData] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const { selectEmployees, setSelectEmployees } = useContext(
    SelectEmployeeContext
  );

  useEffect(() => {
    EmployeeApi.get("/employees", {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      setTotalEmployees(res.data.users.length);
    });
    EmployeeApi.get(
      "https://work.contactamericas.com/api/employees/total-employee",
      {
        headers: {
          Authorization: `${privateToken.token}`,
        },
      }
    ).then((res) => {
      const getMonths = res.data.map(
        (res: EmployeeTotalResponse) => res._id - 1
      );
      // invertir el array
      // getMonths.reverse();

      const getTotal = res.data.map((res: EmployeeTotalResponse) => res.total);
      setNumbersEmployeesTotal(getTotal);
      // const orderListByNumber = getMonths.sort((a: any, b: any) => a - b);
      setArrMonths(getMonths);
      console.log({
        getMonths,
        getTotal
      })
      setMonthsNumbers(getMonths.length);
      setShowTable(true);
    });


    // get Data by months
    EmployeeApi.get("/employees/filters/total-employees").then((res) => {
      setCurrentDataMonths(res.data.data);
    })


  }, []);

  useEffect(() => {
    EmployeeApi.get(`/employees?offset=${10 * pageNumber}&limit=10`, {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      setGetAllUsers(res.data.users);
      setGetUserNotApply(res.data.usersNotApply);
    });
  }, [pageNumber]);

  //  close modal
  const closeHandler = () => {
    setVisible(false);
  };

  const closeHandlerChart = () => {
    setShowModalChart(false);
  };

  // data
  const data = numbersEmployeesTotal;
  const getTheLast5monthsArray = (rand: number) => {
    //should return the last 5 months in the format "month/year" (e.g. "January/2021") in the middle of the array and the current month at the end of the array
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    console.log({
      arrMonths,
    });
    const convertMoths = arrMonths.map((month: any) => {
      return months[month];
    });

    return convertMoths;
  };

  const xData = getTheLast5monthsArray(monthsNumbers || 1);

  const getEmployeesByLastWeek = async () => {
    const res = await EmployeeJobApi.get("/employees/filters/last-week");
    setGetAllUsers(res.data.data);
    setShowPaginate(false);
    setTotalEmployees(res.data.count);
    setActive1(true);
    setActive2(false);
    setActive3(false);
  };

  const getEmployeesByLastMonth = async () => {
    const res = await EmployeeJobApi.get("/employees/filters/last-month");
    setGetAllUsers(res.data.data);
    setTotalEmployees(res.data.count);
    setShowPaginate(false);
    setShowPaginate(false);
    setActive2(true);
    setActive1(false);
    setActive3(false);
  };

  const getAllEmployees = async () => {
    EmployeeApi.get(`/employees?offset=${10 * pageNumber}&limit=10`, {
      headers: {
        Authorization: `${privateToken.token}`,
      },
    }).then((res) => {
      console.log({ res });
      setGetAllUsers(res.data.users);
      setGetUserNotApply(res.data.usersNotApply);
      setTotalEmployees(res.data.total);
      setShowPaginate(true);  
    });

    setActive3(true);
    setActive1(false);
    setActive2(false);
  };

  const handleSubmitByEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const employee = await EmployeeApi.get(
        `/employees/filters/email/${valueEmailInput}`
      );
      if (employee.data.length === 0) {
        toast.error("No se encontraron resultados");
      } else {
        setGetAllUsers(employee.data);
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isReload = () => {
    router.reload();
  }

  const handleSubmitByDistrito = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const valueCapitalize =
      valueDistritoInput.charAt(0).toUpperCase() + valueDistritoInput.slice(1);
    try {
      const employee = await EmployeeApi.get(
        `/employees/filters/district/${valueCapitalize}`
      );
      if (employee.data.count !== 0) {
        setGetAllUsers(employee.data.data);
        setVisible(false);
      } else {
        toast.error("No se encontraron resultados");
        
      }
    } catch (error) {
      toast.error("No se encontraron resultados");
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        width="500px"
      >
        <Modal.Header>
          <Text id="modal-title" size={32}>
            Escriba el valor a buscar por:
          </Text>
        </Modal.Header>
        <Modal.Body>
          {typeSelect === "email" && (
            <form
              onSubmit={handleSubmitByEmail}
              className={`${styles.subfield} ${styles["custom-file-upload"]}`}
            >
              <label>
                <input
                  type="text"
                  name="search"
                  className="w-full mt-5 p-3 mb-3 border-2 rounded-lg"
                  placeholder="Buscar por email "
                  value={valueEmailInput}
                  onChange={(e) => setValueEmailInput(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className={
                  "px-3 py-2 rounded-lg bg-blue-700 text-white cursos-pointer"
                }
              >
                Buscar
              </button>
            </form>
          )}
          {/* {
            typeSelect === "pais" && (
              <form
                onSubmit={handleSubmitByPais}
                className={`${styles.subfield} ${styles["custom-file-upload"]}`}
              >
                <label>
                  <input
                    type="text"
                    name="search"
                    className="w-full mt-5 mb-3 border-2 p-3 rounded-lg"
                    placeholder="Buscar por país"
                    value={valuePaisInput}
                    onChange={(e) => setValuePaisInput(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className={
                    "px-3 py-2 rounded-lg bg-blue-700 text-white cursos-pointer"
                  }
                >
                  Buscar
                </button>
              </form>
            )
          } */}

          {typeSelect === "distrito" && (
            <form
              onSubmit={handleSubmitByDistrito}
              className={`${styles.subfield} ${styles["custom-file-upload"]}`}
            >
              <label>
                <span className="text-sm text-blue-500">
                  El valor debe de capitalizado, Ejemplo: "Los Olivos",
                  "Miraflores", "San Juan de ..."
                </span>
                <input
                  type="text"
                  name="search"
                  className="w-full mt-5 border-2 mb-3 p-3 rounded-lg"
                  placeholder="Buscar por distrito: Miraflores, San Juan de Miraflores, etc."
                  value={valueDistritoInput}
                  onChange={(e) => setValueDistritoInput(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className={
                  "px-3 py-2 rounded-lg bg-blue-700 text-white cursos-pointer"
                }
              >
                Buscar
              </button>
            </form>
          )}

          {/* <form
            onSubmit={() => console.log("hadf")}
            className={`${styles.subfield} ${styles["custom-file-upload"]}`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="option1"
                  checked={typeSelect === "email" ? true : false}
                  value="email"
                />
                <Text
                  id="modal-title"
                  className="font-semibold"
                  size={14}
                  color="primary"
                >
                  Por Email
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="option1"
                  checked={typeSelect === "pais" ? true : false}
                  value="pais"
                />
                <Text
                  id="modal-title"
                  className="font-semibold"
                  size={14}
                  color="primary"
                >
                  Por País
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="option1"
                  checked={typeSelect === "distrito" ? true : false}
                  value="distrito"
                />
                <Text
                  id="modal-title"
                  className="font-semibold"
                  size={14}
                  color="primary"
                >
                  Por Distrito
                </Text>
              </div>
            </div>
            <form>
              <label>
                {typeSelect === "email" && (
                  <input
                    type="text"
                    name="search"
                    className="w-full mt-5 p-3 mb-3 border-2 rounded-lg"
                    placeholder="Buscar por email "
                  />
                )}
                {typeSelect === "pais" && (
                  <input
                    type="text"
                    name="search"
                    className="w-full mt-5 mb-3 border-2 p-3 rounded-lg"
                    placeholder="Buscar por país"
                  />
                )}
                {typeSelect === "distrito" && (
                  <input
                    type="text"
                    name="search"
                    className="w-full mt-5 border-2 mb-3 p-3 rounded-lg"
                    placeholder="Buscar por distrito"
                  />
                )}
              </label>
              <button
                type="submit"
                className={
                  "px-3 py-2 rounded-lg bg-blue-700 text-white cursos-pointer"
                }
              >
                Buscar
              </button>
            </form>
          </form> */}
        </Modal.Body>
        <Modal.Footer>
          <ButtonNextUi auto flat color="error" onPress={closeHandler}>
            Cerrar
          </ButtonNextUi>
        </Modal.Footer>
      </Modal>
      <Head>
        <title>Contact Americas Admin | Lista de usuarios</title>
      </Head>
      <LayoutDashboard>
        <div className={`${styles.navbar} flex items-center gap-2`}>
          <h1 className="md:text-4xl font-bold text-sm">{titleState}</h1>
          <p className="md:text-2xl font-semibold text-sm  p-3 rounded-lg bg-white shadow-lg">
            Número total de usuarios encontrados:{" "}
            <span className="text-blue-500">{totalEmployees}</span>{" "}
          </p>
        </div>

        <div className="flex items-center  justify-between flex-wrap">
          <div className="md:my-5">
            <div className="">
              <h1 className="text-sm">Aplicar Filtros por:</h1>
            </div>
            <div className="flex items-center flex-wrap md:gap-10  gap-4 ">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => getEmployeesByLastWeek()}
                  className={`${
                    active1 ? "bg-blue-500 text-white" : "bg-slate-100"
                  }  px-3 py-1 rounded-full text-sm md:text-md  hover:text-slate-100 font-semibold hover:bg-slate-900 transition ease`}
                >
                  Desde la última semana
                </button>
                <button
                  onClick={() => getEmployeesByLastMonth()}
                  className={`${
                    active2 ? "bg-blue-500 text-white" : "bg-slate-100"
                  } px-3 py-1 rounded-full text-sm md:text-md hover:text-slate-100 font-semibold hover:bg-slate-900 transition ease`}
                >
                  Desde el último mes
                </button>
                <button
                  onClick={() => getAllEmployees()}
                  className={`${
                    active3 ? "bg-blue-500 text-white" : "bg-slate-100"
                  } px-3 py-1 rounded-full text-sm hover:text-slate-100 font-semibold hover:bg-slate-900 transition ease`}
                >
                  Todos
                </button>
              </div>
              <div className="">
                <DropDownSelectGlobal
                  setVisible={setVisible}
                  setTypeSelect={setTypeSelect}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 gb-white  p-3 rounded-lg">
            <span className="flex items-center gap-2 text-sm md:text-md">
              <strong className="text-blue-500 text-2xl">
                {selectEmployees.length}
              </strong>
              Usuarios Seleccionados
            </span>
            <Link
              href="/admin/infolist"
              className="px-3 py-1 text-sm md:text-md bg-green-600 text-center text-white font-semibold rounded-full hover:bg-green-800 transition ease"
            >
              Ver info en otra pestaña
            </Link>
          </div>
        </div>
        <div className="">
          <div className="wrapper">
            <div className="grid grid-cols-12 gap-3">
              {/* <div className="col-span-4 py-10">
                {showTable && (
                  <>
                    <h1 className="text-2xl font-semibold mt-4 text-blue-950">
                      Tabla de nuevos usuarios con relación por mes
                    </h1>
                  </>
                )}
                monthsNames
                currentDataMonths
              </div> */}
              <div className="col-span-full mt-2">
                <div className="md:flex  md:justify-end items-center md:gap-4 ">
                  <span className="font-semibold text-sm">
                    Números de usuarios que se han registrado en:
                  </span>
                  <div className="flex items-center  gap-5 gb-white shadow-lg md:p-3 mt-2 rounded-lg">
                    {currentDataMonths.map((data: PropValue, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 shadow-inner"
                      >
                        <span className="text-sm md:text-md font-semibold">
                          {monthsNames[+data._id - 1]}:
                        </span>
                        <span className="text-sm md:text-md font-semibold text-blue-500">
                          {data.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <TableList
                  data={getAllUsers}
                  isReload={isReload}
                  offsetSliceValue={0}
                  total={5}
                  getAllEmployees={getAllEmployees}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  showPaginate={showPaginate}
                />
              </div>
            </div>
          </div>
        </div>
      </LayoutDashboard>
    </>
  );
};

export default ListUsersPage;

