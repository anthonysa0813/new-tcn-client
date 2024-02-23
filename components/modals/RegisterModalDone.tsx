import React from "react";
import ModalComponent from "../dashboard/ModalComponent";
import styles from "../../styles/employees/RegisterModalDone.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import Link from "next/link";

const CloseIcon = dynamic(() =>
  import("@mui/icons-material/Close").then((res) => res.default)
);

interface Prop {
  closeModal: () => void;
}

const RegisterModalDone = ({ closeModal }: Prop) => {
  return (
    <ModalComponent center>
      <div className={"  bg-white p-4 rounded-lg relative z-40 "}>
        <div className={styles.boxClose}>
          <CloseIcon onClick={closeModal} className={styles.svg} />
        </div>
        <div className="flex justify-center mb-2">
          <Image
            src="/images/drawRegisterDone.svg"
            alt="draw animado celebrando"
            width={400}
            height={400}
            className="object-contain h-24"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl  font-semibold mb-3 md:mb-2">
            Gracias por registrarte en{" "}
            <span className="text-blue-500">Contact Americas</span>
          </h1>
          <span className={"text-gray-500 font-semibold text-sm mt-4"}>
            <span className="text-gray-900">Te hemos enviado un email</span>{" "}
            para la activación de tu cuenta. Por favor revisa la carpeta de{" "}
            <span className="text-gray-950 mr-2">spam</span>
            en caso no lo encuentres.
          </span>
        </div>
        <div className="my-3 flex justify-center flex-col gap-3 items-center">
          <h1>También puedes contactarnos en los siguientes enlaces: </h1>
          <ul className="flex items-center gap-2">
            <li>
              <Link
                href="https://api.whatsapp.com/send/?phone=51905447754&text=%C2%A1Hola%21+Contact+Americas+me+gustar%C3%ADa+contactar+con+ustedes."
                target="_blank"
              >
                <WhatsAppIcon className={styles.icon} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com/contact.americas/"
                target="_blank"
              >
                <InstagramIcon className={styles.icon} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/company/contactamericas/mycompany/"
                target="_blank"
              >
                <LinkedInIcon className={styles.icon} />
              </Link>
            </li>
            <li>
              <Link href="https://www.facebook.com/Contactamericas?locale=es_LA" target="_blank">
                <FacebookIcon className={styles.icon} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </ModalComponent>
  );
};

export default RegisterModalDone;


