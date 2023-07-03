import React from "react";
import { UserResponse } from "../../../interfaces";
import styles from "../../../styles/admin/ChangeRole.module.css";

interface Prop {
  userUniqueInfo: UserResponse;
  changeStatusFunction: (user: UserResponse) => void;
}

const UniqueUser = ({ userUniqueInfo, changeStatusFunction }: Prop) => {
  return (
    <div className={styles.fieldUser}>
      <div className={styles.field}>
        <span>{userUniqueInfo.email}</span>
      </div>
      <div className={styles.field}>
        <span>{userUniqueInfo.role}</span>
      </div>
      <div className={styles.field}>
        <button
          className={`${styles.button} ${
            userUniqueInfo.role === "ADMIN_ROLE" ? "red" : "primary"
          }`}
          onClick={() => changeStatusFunction(userUniqueInfo)}
        >
          {userUniqueInfo.role === "ADMIN_ROLE" ? "desactivar" : "activar"}
        </button>
      </div>
    </div>
  );
};

export default UniqueUser;
