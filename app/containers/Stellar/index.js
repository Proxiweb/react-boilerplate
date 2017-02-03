import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { loadAccount, trust as trustAction, pay, fedLookup } from './actions';
import TrustForm from '../../components/TrustForm';
import PaymentForm from '../../components/PaymentForm';

import {
  selectContacts,
  default as selectStellarDomain,
} from './selectors';

class StellarMain extends Component { // eslint-disable-line
  static propTypes = {
    account: PropTypes.object.isRequired,
    loadAccount: PropTypes.func.isRequired,
    trust: PropTypes.func.isRequired,
    // pay: PropTypes.func.isRequired,
    lookup: PropTypes.func.isRequired,
    // contacts: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
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
    const { account, lookup, trust } = this.props;
    const { stellarKeys, balances, contacts } = account;
    return (<div>
      <form className="form form-inline text-right">
        <div className="form-group">
          <select ref={(node) => { this.action = node; }} onChange={this.handleChangeAction} defaultValue="show_balance">
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
            {account.balances.map((bal) =>
              <li key={bal.asset_type === 'native' ? 'XLM' : bal.asset_code}>
                {parseFloat(bal.balance)} {bal.asset_type === 'native' ? 'XLM' : bal.asset_code}
              </li>
            )}
          </ul>
        </div>
        )}
      { this.state.action === 'show_trust' && <TrustForm stellarKeys={stellarKeys} trust={trust} />}
      { this.state.action === 'show_payment' && (
        <PaymentForm
          stellarKeys={this.props.account.stellarKeys}
          pay={pay}
          fedLookup={lookup}
          balances={balances}
          contacts={contacts}
        />)}
    </div>);
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadAccount,
  trust: trustAction,
  pay,
  lookup: fedLookup,
}, dispatch);

const mapStateToProps = createStructuredSelector({
  account: selectStellarDomain(),
  contacts: selectContacts(),
});

export default connect(mapStateToProps, mapDispatchToProps)(StellarMain);
