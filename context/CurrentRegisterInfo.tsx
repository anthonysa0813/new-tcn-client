import { createContext, useState } from "react";


export type RegisterI = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  cv: any;
  country: string;
}

export type RegisterFormProps = {
  formInfo: RegisterI;
  setFormInfo: (formInfo: RegisterI) => void;
}


export const CurrentRegisterInfo = createContext<RegisterFormProps>({} as RegisterFormProps);

export const CurrentRegisterInfoProvider = ({ children }: any) => {
  const [formInfo, setFormInfo] = useState({} as RegisterI);
  return (
    <CurrentRegisterInfo.Provider value={{setFormInfo, formInfo}}>
      {children}
    </CurrentRegisterInfo.Provider>
  );
};
