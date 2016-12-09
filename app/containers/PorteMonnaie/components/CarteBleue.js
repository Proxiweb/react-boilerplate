import React, { Component, PropTypes } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import round from 'lodash.round';
import styles from './styles.css';

export default class CarteBleue extends Component {
  static propTypes = {
    max: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    deposerCB: PropTypes.func.isRequired,
  }

  state = {
    montant: null,
  }

  onToken = (token) => {
    const { deposerCB } = this.props;
    deposerCB({
      token: token.id,
      montant: parseFloat(this.state.montant) * 100,
    });
  }

  render() {
    const { max, email } = this.props;
    const { montant } = this.state;
    const frais = round((montant * 0.014) + 0.25, 2);
    const restant = round(montant - frais, 2);
    return (
      <div className="col-md-8">
        <p style={{ minHeight: '18px' }}>
          {montant !== null && montant > 0 && <span>Montant du depot CB : <strong>{montant} €</strong></span>}
        </p>
        <Slider
          min={0}
          max={max}
          step={1}
          value={this.state.montant}
          onChange={(event, val) => this.setState({ montant: val })}
        />
        <div className={styles.virButton}>
          <StripeCheckout
            token={this.onToken}
            panelLabel="Verser"
            componentClass="with-margin-top"
            allowRememberMe={false}
            email={email}
            amount={parseFloat(montant) * 100}
            currency="EUR"
            stripeKey="pk_test_xuuHOnVKh0iHLw3fmV7CPja5"
          >
            <RaisedButton
              primary
              label="Paiement CB sécurisé"
              type="number"
              icon={<CreditCardIcon />}
              disabled={!this.state.montant}
            />
          </StripeCheckout>
          {montant > 0 && <p>Frais : {frais} € (<strong>{restant} €</strong> crédités)</p>}
        </div>
      </div>
    );
  }
}
