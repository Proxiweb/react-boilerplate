import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadAccount, trust, pay } from './actions';
import TrustForm from 'components/TrustForm';
import PaymentForm from 'components/PaymentForm';

class StellarMain extends Component { // eslint-disable-line
  static propTypes = {
    account: PropTypes.object.isRequired,
    loadAccount: PropTypes.func.isRequired,
    trust: PropTypes.func.isRequired,
    pay: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.handleChangeAction = this.handleChangeAction.bind(this);
    this.state = {
      action: 'show_balance',
    };
  }

  componentDidMount() {
    if (!this.props.account.balances) {
      this.props.loadAccount(this.props.account.stellarKeys.accountId);
    }
  }

  handleChangeAction() {
    this.setState({ action: this.action.value });
  }

  render() {
    const { account } = this.props;
    return (<div>
      <form className="form form-inline text-right">
        <div className="form-group">
          <select ref={node => { this.action = node; }} onChange={this.handleChangeAction} defaultValue="show_balance">
            <option value="show_balance">Seulement les comptes</option>
            <option value="show_trust">Trust</option>
            <option value="show_contacts">Contacts</option>
            <option value="show_payment">Effectuer un paiement</option>
            <option value="show_payments">Liste des transactions</option>
          </select>
        </div>
      </form>
        {account.pending && <h1>Patientez...</h1>}
        {account.balances && !account.pending && (
          <div className="alert alert-info text-center">
            <ul className="list-unstyled">
              {account.balances.map(bal => <li key={bal.asset_type === 'native' ? 'XLM' : bal.asset_code}>{parseFloat(bal.balance)} {bal.asset_type === 'native' ? 'XLM' : bal.asset_code}</li>)}
            </ul>
          </div>
        )}
      { this.state.action === 'show_trust' && <TrustForm stellarKeys={this.props.account.stellarKeys} trust={this.props.trust} />}
      { this.state.action === 'show_payment' && <PaymentForm stellarKeys={this.props.account.stellarKeys} pay={this.props.pay} balances={this.props.account.balances} />}
    </div>);
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadAccount: (accountId) => dispatch(loadAccount(accountId)),
  trust: (currencyCode, maxTrust, issuer, stellarKeys) => dispatch(trust(currencyCode, maxTrust, issuer, stellarKeys)),
  pay: (dest, currency, currencyIssuer, amount, stellarKeys) => dispatch(pay(dest, currency, currencyIssuer, amount, stellarKeys)),
});

const mapStateToProps = (state) => ({ account: state.stellar });

export default connect(mapStateToProps, mapDispatchToProps)(StellarMain);
