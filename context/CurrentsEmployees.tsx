import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ContextInitial, EmployeeInterface } from "../interfaces";

export type CurrentUsersContextType = {
  currentUsersState: EmployeeInterface[] | [];
  setCurrentUsersState: Dispatch<SetStateAction<EmployeeInterface[] | []>>;
};

export const CurrentUserContext = createContext<CurrentUsersContextType>(
  {} as CurrentUsersContextType
);
type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

const CurrentUsersContextProvider = ({ children }: ChildrenType) => {
  const [currentUsersState, setCurrentUsersState] = useState([
    {} as EmployeeInterface,
  ]);

  return (
    <CurrentUserContext.Provider
      value={{ currentUsersState, setCurrentUsersState }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUsersContextProvider;
