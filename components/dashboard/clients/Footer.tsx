import React from "react";
import styles from "../../../styles/client/Footer.module.css";
import dynamic from "next/dist/shared/lib/dynamic";

const CopyrightIcon = dynamic(() =>
  import("@mui/icons-material/Copyright").then((res) => res.default)
);

const Footer = () => {
  return (
    <div className={`${styles.footer} bg-sky-50 dark:bg-sky-100`}>
      <span className="dark:text-gray-700">
        Desarrollado por Contact Americas {new Date().getFullYear()} <CopyrightIcon />
      </span>
    </div>
  );
};

export default Footer;
