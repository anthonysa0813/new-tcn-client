import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/employees/Layout.module.css";
import { useRouter } from "next/router";

const Link = dynamic(() => import("next/link").then((res) => res.default));

const MenuIcon = dynamic(() =>
  import("@mui/icons-material/MenuOpen").then((res) => res.default)
);
const WorkIcon = dynamic(() =>
  import("@mui/icons-material/BusinessCenter").then((res) => res.default)
);
const EditIcon = dynamic(() =>
  import("@mui/icons-material/Edit").then((res) => res.default)
);

// import NorthEastIcon from '@mui/icons-material/NorthEast';
const ArrowIcon = dynamic(() =>
  import("@mui/icons-material/NorthEast").then((res) => res.default)
);

const VpnKeyIcon = dynamic(() =>
  import("@mui/icons-material/VpnKey").then((res) => res.default)
);

const AsideMenuEmployee = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const arrAsPath = router.asPath;
  const pathActive = (path: string) => {
    if (arrAsPath === path) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={`${styles.asideMenu} ${showMenu ? styles.active : ""}`}>
      <div className={styles.boxMenu} onClick={() => setShowMenu(!showMenu)}>
        <MenuIcon />
      </div>
      {showMenu && (
        <nav className={`${styles.navigation} `}>
          <Link
            href="/employee/campaign"
            className={
              pathActive("/employee/campaign") ? styles.activeLink : ""
            }
          >
            <WorkIcon style={{ width: "20px", height: "20px" }} />
            Ver Puestos Disponibles
          </Link>
          <Link
            href="/employee/applications"
            className={
              pathActive("/employee/applications") ? styles.activeLink : ""
            }
          >
            <ArrowIcon />
            Ver mis postulaciones
          </Link>

          <Link
            href="/employee/edit"
            className={pathActive("/employee/edit") ? styles.activeLink : ""}
          >
            <EditIcon />
            Completar mi perfil
          </Link>
        </nav>
      )}
    </div>
  );
};

export default AsideMenuEmployee;
