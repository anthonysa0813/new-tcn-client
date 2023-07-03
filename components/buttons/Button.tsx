import React from "react";
import dynamic from "next/dynamic";

interface PropTypes {
  content: string;
  type: "submit" | "button" | "reset" | undefined;
  color: string;
  onClick?: () => void;
  iconName?: string;
}

const FilterIcon = dynamic(() =>
  import("@mui/icons-material/FilterAlt").then((res) => res.default)
);

const ButtonPrimary = ({
  content,
  type,
  color,
  onClick,
  iconName,
}: PropTypes) => {
  return (
    <button type={type} className={`bg-${color} btn`} onClick={onClick}>
      {iconName === "filter" && <FilterIcon />}
      {content}
    </button>
  );
};

export default ButtonPrimary;
