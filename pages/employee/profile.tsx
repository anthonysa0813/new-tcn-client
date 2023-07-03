import Head from 'next/head'
import React, { useContext } from 'react'
import Navbar from '../../components/menu/Navbar'
import { EmployeeContext, EmployeeContextProps } from '../../context/EmployeeContext';
import styles from "../../styles/employees/Profile.module.css";
import LayoutEmployee from './layoutEmployee';

const ProfilePage = () => {
  const {employeeGlobal, setEmployeeGlobal} = useContext<EmployeeContextProps>(EmployeeContext);
    const { name } = employeeGlobal;

  return (
    <>
    <LayoutEmployee name={name} >
        <h1>!Bienvenido {name}, aquí podrás Editar tu información y ver tus postulaciones...!</h1>
    </LayoutEmployee>
  </>
  )
}

export default ProfilePage