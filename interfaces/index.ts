import { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";

export interface FormProp {
  email: string;
  password: string;
}

export interface UserResponse {
  email: string;
  role: string;
  name: string;
  id?: string;
  superAdmin?: boolean;
  password?: string;
}

export interface ContextInitial {
  user?: UserResponse;
  setUser?: Dispatch<SetStateAction<UserResponse | null>>;
}

export interface ChildProp {
  children: JSX.Element | JSX.Element[] | boolean;
  center?: boolean;
}

export interface ClientResponse {
  name: string;
  usernames: string;
  email: string;
  _id?: string;
  phone: string;
  message: string;
  __v?: string;
  status?: string;
}

export interface ClientInterface {
  name: string;
  surnames: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ClientData {
  data: ClientResponse[];
}

export interface EmployeeInterface {
  id?: string;
  name: string;
  surnames: string;
  email: string;
  phone?: string;
  status?: true;
  country?: string;
  cv?: any;
  callingCode?: string;
  typeJob?: string;
  service?: ServiceInterface[] | [];
  servicesId?: string[] | [];
  password: string;
  message?: string;
  linkedin?: string;
  github?: string;
  confirmPassword?: string;
  address?: string;
  birthday?: string;
  district?: string;
  statusJob?: string;
  findSocial?: string;
  findUssocial?: string;
  dni?: string;
  languages?: LangObject[] | [];
  experiences?: Experience[] | [];
  skills?: any;
  createdAt?: string;
}

export interface ServiceInterface {
  _id: string,
  title: string,
  schedule: string,
  salary: string,
  description: string,
  requirements: string,
  status: boolean,
  localCurrency: string,
  type: string,
  typeJob: string,
  slug: string,
  supervisor: string,
  whatsapp: string,
  modalSalary: boolean,
  employees: EmployeeInterface[] | [],
  createdAt: string,
  updatedAt: string,
  __v: number,
  modalConfirm: boolean
}


export interface ChangeStatusRequest {
  idEmployee: string;
  statusOption: string;
}

export interface CountriesDataI {
  value?: string;
  label?: string;
}

export interface Service {
  _id?: any;
  title: string;
  company?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  employees?: EmployeeInterface[] | [];
  __v?: number;
}
export interface ServiceI {
  _id?: string;
  createdAt?: string;
  employees?: EmployeeInterface[] | [];
  requirements: string;
  salary: string;
  schedule: string;
  status?: boolean;
  title: string;
  description: string;
  type?: string;
  order?: number;
  typeJob?: string;
  slug?: string;
  whatsapp?: string;
  supervisor?: string;
  localCurrency?: string;
  modalSalary?: boolean;
  modalConfirm?: boolean;
  __v?: number;
}

export interface CourntriesDataResponse {
  countriesNames: any;
  callingCode: string;
}

export interface LangObject {
  lang: string;
  levelWriter: string;
  levelOral: string;
  levelRead?: string;
  levelListen?: string;
  idEmployee: string;
}

export interface LangResponse {
  _id: string;
  lang: string;
  levelWriter: string;
  levelOral: string;
  employee: string;
  __v?: number;
}

export interface IApplicationJobResponse {
  _id: string;
  employee: string;
  service: string;
  status: string;
  __v?: number;
}

export interface Experience {
  activytyBussiness?: string;
  area?: string;
  country?: string;
  currentJob?: boolean;
  dateEnd?: string;
  dateStart?: string;
  description?: string;
  employee?: string;
  level?: string;
  nameBussiness?: string;
  subarea?: string;
  title?: string;
  __v?: number;
  _id?: string;
  nameRef?: string;
  emailRef?: string;
  countryRef?: string;
  phoneRef?: string;
}

export interface KnoledgeInterface {
  name: string;
  employee?: string;
  level: string;
  _id?: string;
  __v?: string;
}

export interface RequestSendNewPassword {
  email: string;
}

export interface RequestSendNewPasswordByDni {
  dni: string;
}

export interface RequestResetPassword {
  email: string;
  password: string;
  token: string | string[];
}

export interface PropMessageNavbarLangs {
  en: {
    simple: string;
    greeting: string;
    plural: string;
  };
  es: {
    simple: string;
    greeting: string;
    plural: string;
  };
}

export interface Application {
  confirm: string;
  createdAt: string;
  employee: string;
  service: string;
  updatedAt: string;
  __v?: number | string;
  _id: string;
}

