import React, { useState, useContext } from "react";
import ButtonPrimary from "../../buttons/Button";
import styles from "../../../styles/admin/ChangeRole.module.css";
import useForm from "../../../hooks/useForm";
import { UserResponse } from "../../../interfaces";
import { ToastContainer, toast } from "react-toastify";
import { searchUserAuth } from "../../../apis/auth/fetchFunctions";
import { TokenContext } from "../../../context/CurrentToken";

interface Prop {
  setUserUniqueInfo: React.Dispatch<React.SetStateAction<UserResponse>>;
  setShowUniqueUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchUserForm = ({
  setUserUniqueInfo,
  setShowUniqueUser,
  setShowAllUsers,
}: Prop) => {
  const { email, onChange } = useForm({
    email: "",
  });
  const toastWarning = (message: string) => toast.warning(message);
  const [loading, setLoading] = useState(false);

  const toastError = (message: string) => toast.error(message);
  const { privateToken } = useContext(TokenContext);
  const [user, setUser] = useState<UserResponse>({} as UserResponse);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit");
    if ([email].includes("")) {
      toastWarning("El campo está vacío...");
      return;
    }
    setLoading(true);
    setShowUniqueUser(true);

    setShowAllUsers(false);
    searchUserAuth(`auth/search/${email}`, privateToken.token).then((res) => {
      console.log({ response: res });
      if (res.message) {
        toastError(res.message);
        setLoading(false);
        setShowUniqueUser(false);
        setUser(res.user);
        setUserUniqueInfo(res.user);
      } else {
        setUser(res.user);
        setLoading(false);
        setUserUniqueInfo(res.user);
        setShowUniqueUser(true);
      }
    });
  };

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
