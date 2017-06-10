import React from "react";
import AlertWarningIcon from "material-ui/svg-icons/alert/warning";

const LigneFondsWarningIcon = ({ color }) => {
  const colorStyle = { color };
  const iconStyle = {
    verticalAlign: "middle",
    color
  };
  return (
    <small style={colorStyle}>
      {"\u00A0\u00A0\u00A0\u00A0\u00A0"}
      <AlertWarningIcon style={iconStyle} />
      {"\u00A0"}Fonds porte-monnaie insuffisant
    </small>
  );
};

export default LigneFondsWarningIcon;
