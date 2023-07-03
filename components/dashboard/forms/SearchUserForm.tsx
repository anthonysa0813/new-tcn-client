import React from "react";
import ButtonPrimary from "../../buttons/Button";
import styles from "../../../styles/admin/ChangeRole.module.css";

interface Prop {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  onChange: (value: any) => void;
}

const SearchUserForm = ({ onSubmit, email, onChange }: Prop) => {
  return (
    <form className={styles.searchField} onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="example@gmail.com"
        name="email"
        value={email}
        onChange={onChange}
      />
      <ButtonPrimary color="dark" content="Buscar" type="submit" />
    </form>
  );
};

export default SearchUserForm;
