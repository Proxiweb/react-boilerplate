import React from "react";
import round from "lodash/round";
import AlertWarningIcon from "material-ui/svg-icons/alert/warning";
import styles from "./styles.css";

const FondsWarningMessage = ({ color, montant, balance, dateLimite }) => {
  const iconStyle = {
    height: 40,
    width: 40,
    color,
    padding: "0.4em 1em"
  };
  const dateStyle = {
    textAlign: "center",
    marginTop: "1em"
  };
  const lineStyle = { lineHeight: "1.5em" };
  const borderColor = { border: `solid 5px ${color}` };
  return (
    <div className={styles.message} style={borderColor}>
      <div className="row">
        <div className="col-md-2">
          <AlertWarningIcon style={iconStyle} />
        </div>
        <div className="col-md-10">
          <span>
            {"Votre porte-monnaie présente un solde de "}
            <strong>{balance.toFixed(2)} €</strong>,
            {"ce n'est pas suffisant."}
            {"Pour qu'elle soit validée, il faudrait approvisionner votre compte d'au moins "}
            <strong>{round(montant - balance, 2).toFixed(2)} €</strong>{" avant le :"}
          </span>
          <div style={dateStyle}>
            <strong>{dateLimite}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FondsWarningMessage;
