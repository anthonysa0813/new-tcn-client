import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { ContextInitial, EmployeeInterface } from "../interfaces";

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
  // useEffect(() => {
  //   if (typeof window.localStorage !== "undefined") {
  //     const employee = JSON.parse(localStorage.getItem("employee") || "");
  //     setEmployeeGlobal(employee);
  //   }
  // }, []);

  return (
    <EmployeeContext.Provider value={{ employeeGlobal, setEmployeeGlobal }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContextProvider;
