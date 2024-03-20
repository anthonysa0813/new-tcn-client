import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { EmployeeInterface } from "../interfaces";

type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

type TokenContextProps = {
  privateToken: ContextType;
  setPrivateToken: Dispatch<SetStateAction<ContextType>>;
};

type ContextType = {
  token: string;
};

export const TokenContext = createContext<TokenContextProps>(
  {} as TokenContextProps
);

export const TokenContextProvider = ({ children }: ChildrenType) => {
  const [privateToken, setPrivateToken] = useState({} as ContextType);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    const cokkieTokenFromLocalStorage = localStorage.getItem("token");
    if (cokkieTokenFromLocalStorage) {
      // const tokenSecret = sessionStorage.getItem("token");
      setPrivateToken({ token: cokkieTokenFromLocalStorage || "" });
    }
  }, []);

  return (
    <TokenContext.Provider value={{ privateToken, setPrivateToken }}>
      {children}
    </TokenContext.Provider>
  );
};

