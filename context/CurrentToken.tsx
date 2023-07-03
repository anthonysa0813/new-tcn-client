import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

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
    if (typeof window !== "undefined") {
      const tokenSecret = sessionStorage.getItem("token");
      setPrivateToken({ token: tokenSecret || "" });
    }
  }, []);

  return (
    <TokenContext.Provider value={{ privateToken, setPrivateToken }}>
      {children}
    </TokenContext.Provider>
  );
};
