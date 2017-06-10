import React from 'react';
import PropTypes from 'prop-types';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import shader from 'shader';
import styles from './styles.css';

const FondsOkMessage = ({ color, montant, balance }) => {
  const iconStyle = {
    height: 40,
    width: 40,
    color: shader(color, -0.4),
    paddingLeft: '1em',
  };

  const lineStyle = { lineHeight: '1.5em' };
  const borderColor = { border: `solid 5px ${color}` };
  return (
    <div className={styles.message} style={borderColor}>
      <div className="row">
        <div className="col-md-2">
          <ActionDoneIcon style={iconStyle} />
        </div>
        <div className="col-md-10">
          <span style={lineStyle}>
            {'Votre porte-monnaie présente un solde de '}
            <strong>{balance.toFixed(2)} €</strong><br />
            {'Il sera débité de '}<strong>{montant} €</strong> quand cette
            commande sera distribuée.
          </span>
        </div>
      </div>
    </div>
  );
};

FondsOkMessage.propTypes = {
  montant: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default FondsOkMessage;
