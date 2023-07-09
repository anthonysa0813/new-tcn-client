import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { ContextInitial, EmployeeInterface } from "../interfaces";
import Cookies from "js-cookie";

export type EmployeeContextProps = {
  employeeGlobal: EmployeeInterface;
  setEmployeeGlobal: Dispatch<SetStateAction<EmployeeInterface>>;
};

export const EmployeeContext = createContext<EmployeeContextProps>(
  {} as EmployeeContextProps
);

type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

const EmployeeContextProvider = ({ children }: ChildrenType) => {
  const [employeeGlobal, setEmployeeGlobal] = useState({} as EmployeeInterface);
  useEffect(() => {
    const employeeValue = Cookies.get("employee");
    if (employeeValue) {
      const employee: EmployeeInterface = JSON.parse(employeeValue);
      setEmployeeGlobal(employee);
    }
  }, []);

  return (
    <EmployeeContext.Provider value={{ employeeGlobal, setEmployeeGlobal }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContextProvider;
