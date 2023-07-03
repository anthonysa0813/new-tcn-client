import React from "react";
import styles from "../../../styles/client/Footer.module.css";
import dynamic from "next/dist/shared/lib/dynamic";

const CopyrightIcon = dynamic(() =>
  import("@mui/icons-material/Copyright").then((res) => res.default)
);

const Footer = () => {
  return (
    <div className={styles.footer}>
      <span>
        Contact BPO | Copyright {new Date().getFullYear()} <CopyrightIcon />
      </span>
    </div>
  );
};

export default Footer;
