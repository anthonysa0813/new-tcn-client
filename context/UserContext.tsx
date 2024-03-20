"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ContextInitial, UserResponse } from "../interfaces";
import Cookies from "js-cookie";

type UserContextProps = {
  userGlobal: UserResponse;
  setUserGlobal: Dispatch<
    SetStateAction<{ email: string; role: string; name: string }>
  >;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

type ChildrenType = {
  children: JSX.Element | JSX.Element[];
};

const UserContextProvider = ({ children }: ChildrenType) => {
  const [userGlobal, setUserGlobal] = useState({
    email: "",
    role: "",
    name: "",
  });

  useEffect(() => {
    const authValue = Cookies.get("auth");
    
    const authValueFromLocalStorage = localStorage.getItem("user");
  
    if (authValueFromLocalStorage) {
      const auth: UserResponse = JSON.parse(authValueFromLocalStorage);
      setUserGlobal(auth);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userGlobal, setUserGlobal }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

