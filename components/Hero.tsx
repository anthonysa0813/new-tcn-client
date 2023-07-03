import React from "react";
import styles from "../styles/client/Hero.module.css";

interface Prop {
  title?: string;
  bg?: string;
  id?: string;
  children?: JSX.Element | JSX.Element[];
  nameHero?: string;
}

const Hero = ({ title, bg, id, children, nameHero }: Prop) => {
  return (
    <div
      className={`${
        nameHero ? styles[nameHero] : styles.heroContainer
      } bg-${bg}`}
      id={id}
    >
      {children}
    </div>
  );
};

export default Hero;
