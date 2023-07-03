import React from "react";
import styles from "../../styles/components/cards/ServiceIconCard.module.css";
import dynamic from "next/dynamic";
import { Button } from "@mui/material";

interface Prop {
  imageUrl: string;
  title: string;
  description: string;
  borderActive?: boolean;
  titleButton: string;
}

const Image = dynamic(() => import("next/image").then((res) => res.default));

const ServiceIconCard = ({
  description,
  imageUrl,
  title,
  borderActive,
  titleButton,
}: Prop) => {
  return (
    <div
      className={`${styles.cardContainer} ${
        borderActive ? styles.borderLeft : ""
      }`}
    >
      <div className={styles.boxImage}>
        <Image src={imageUrl} alt="" width={100} height={100} />
      </div>
      <div className={styles.bodyCard}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.actions}>
        <Button variant="outlined" style={{ background: "white" }}>
          {titleButton}
        </Button>
      </div>
    </div>
  );
};

export default ServiceIconCard;
