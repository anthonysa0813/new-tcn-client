import { ServiceI } from "../../interfaces";
import styles from "../../styles/client/Campaign.module.css";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "next/link";

interface Prop {
  services: ServiceI[] | [];
}

const NotFoundJobs = () => {
  return (
    <>
      <div className={styles.modalJob}>
        <div className={styles.modalContent}>
          <h3>Por el momento No contamos con puestos disponibles,</h3>
          <span>Te invitamos a seguirnos en nuestras redes sociales</span>
          <div className={styles.socialIcons}>
            <div className={styles.boxIcon}>
              <Link
                href={"https://www.facebook.com/ContactBPO"}
                target="_blank"
              >
                <FacebookIcon />
              </Link>
            </div>
            <div className={styles.boxIcon}>
              <Link
                href={"https://www.instagram.com/contactbpo/"}
                target="_blank"
              >
                <InstagramIcon />
              </Link>
            </div>
            <div className={styles.boxIcon}>
              <Link
                href={"https://www.linkedin.com/company/contact-bpo/mycompany/"}
                target="_blank"
              >
                <LinkedInIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundJobs;
