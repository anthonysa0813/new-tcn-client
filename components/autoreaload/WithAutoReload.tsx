import React, { useEffect } from "react";
interface Prop {
  children: JSX.Element | JSX.Element[];
}

const WithAutoReload = ({ children }: Prop) => {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 1800000); // 1800000 milisegundos = 30 minutos

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};

export default WithAutoReload;
