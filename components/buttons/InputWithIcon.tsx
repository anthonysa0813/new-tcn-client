import React from "react";
import styles from "../../styles/components/InputWithIcon.module.css";

interface Prop {
  children: JSX.Element | JSX.Element[];
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

const InputWithIcon = ({ children, name, value, onChange, type }: Prop) => {
  return (
    <div className={styles.inputGroup}>
      <input type={type} name={name} value={value} onChange={onChange} />
      {children}
    </div>
  );
};

export default InputWithIcon;
