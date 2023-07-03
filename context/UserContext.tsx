import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ContextInitial, UserResponse } from "../interfaces";

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

  return (
    <UserContext.Provider value={{ userGlobal, setUserGlobal }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
