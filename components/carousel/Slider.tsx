import React from "react";
import styles from "../../styles/components/carousel/SlidesInfinite.module.css";
import Image from "next/image";
// import dynamic from "next/dynamic";

// const Image = dynamic(() => import("next/image").then((res) => res.default));

const Slider = () => {
  return (
    <div className={styles.slider}>
      <div className={`${styles["slide-track"]}`}>
        <div className={styles.slide}>
          <Image
            src="/images/logos/guru.png"
            alt="Logo de Guru soluciones"
            width={250}
            height={100}
          />
        </div>
        <div className={styles.slide}>
          <Image
            src="/images/logos/comunal.png"
            alt="Logo de Comunal"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/autoland.png"
            alt="Logo de Autoland"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/prom_peru.png"
            alt="Logo de Prom Peru"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/visanet.png"
            alt="Logo de Visanet"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/rimac.png"
            alt="Logo de Rimac seguros"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/llamagas.png"
            alt="Logo de Llamagas"
            width={250}
            height={100}
          />
        </div>
        <div className={styles.slide}>
          <Image
            src="/images/logos/salog.png"
            alt="Logo de Salog"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/tortas.png"
            alt="Tortas de Gaby"
            width={100}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/euroLanguage.png"
            alt="Logo de EuroIdiomas"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/tena.jpg"
            alt="Logo de Tena"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/joinnus-logo.png"
            alt="Logo de Joinnus"
            width={150}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/recomedik.png"
            alt="Logo de Recomedik"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/vipa.png"
            alt="Logo de Vipa"
            width={250}
            height={100}
          />
        </div>{" "}
        <div className={styles.slide}>
          <Image
            src="/images/logos/comunal.png"
            alt="Logo de Comunal"
            width={250}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
