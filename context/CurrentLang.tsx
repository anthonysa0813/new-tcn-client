import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ContextInitial, EmployeeInterface } from "../interfaces";

export type CurrentLangContextType = {
  currentLangState: string;
  setCurrenLangState: Dispatch<SetStateAction<string>>;
};

export const CurrentLangContext = createContext<CurrentLangContextType>(
  {} as CurrentLangContextType
);
type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

const CurrentLangContextProvider = ({ children }: ChildrenType) => {
  const [currentLangState, setCurrenLangState] = useState("");

  return (
    <CurrentLangContext.Provider
      value={{ currentLangState, setCurrenLangState }}
    >
      {children}
    </CurrentLangContext.Provider>
  );
};

export default CurrentLangContextProvider;
