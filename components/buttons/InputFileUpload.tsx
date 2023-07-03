import React, { useEffect } from "react";
import styles from "../../styles/components/buttons/InputFileUpload.module.css";
import Link from "next/link";
import { LINK_BACKEND } from "../../utils/constanstApi";
import { getLinkToCv } from "../../helpers/getLinkCv";
interface Prop {
  cv: string;
}

export const InputFileUpload = ({ cv }: Prop) => {
	useEffect(() => {
	console.log(cv);
}, [])  
return (
    <button className={styles.button} type="button">
      <Link className={styles.text} target="_blank" href={cv || ""}>
        Ver mi CV
      </Link>
    </button>
  );
};
