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
  selectEmployees: EmployeeInterface[] | [];
  setSelectEmployees: Dispatch<SetStateAction<EmployeeInterface[]>>;
};

export const SelectEmployeeContext = createContext<EmployeeContextProps>(
  {} as EmployeeContextProps
);

type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

const SelectEmployeeContextProvider = ({ children }: ChildrenType) => {
  const [selectEmployees, setSelectEmployees] = useState(
    [] as EmployeeInterface[]
  );
  useEffect(() => {
    console.log({
      selectEmployees,
    });
  }, [selectEmployees]);

  return (
    <SelectEmployeeContext.Provider
      value={{ selectEmployees, setSelectEmployees }}
    >
      {children}
    </SelectEmployeeContext.Provider>
  );
};

export default SelectEmployeeContextProvider;

