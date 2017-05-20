import React, { Component } from 'react'; import PropTypes from 'prop-types';
import StellarSdk from 'stellar-sdk';

export default class PaymentForm extends Component {
  static propTypes = {
    pay: PropTypes.func.isRequired,
    stellarKeys: PropTypes.object.isRequired,
    balances: PropTypes.array.isRequired,
    contacts: PropTypes.array.isRequired,
    fedLookup: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getContact = this.getContact.bind(this);
    this.state = {
      errors: null,
      accountId: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contacts.length < nextProps.contacts.length) {
      const newContact = this.getContact(nextProps.contacts);
      if (newContact) {
        this.dest.value = newContact.accountId;
      }
    }
  }

  getContact(contactList = null) {
    const id = this.dest.value;
    const contacts = contactList || this.props.contacts;
    return contacts.find((contact) => contact.acountId === id || contact.fedId === id);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { accountId, secret } = this.props.stellarKeys;
    const currencyBal = this.props.balances.find((bal) => bal.asset_code === this.currency.value || (this.currency.value === 'XLM' && bal.asset_type === 'native'));
    const issuer = this.currency.value === 'XLM' ? undefined : currencyBal.asset_issuer;
    if (parseFloat(currencyBal.balance) > parseFloat(this.amount.value)) {
      this.props.pay(this.dest.value, this.currency.value, issuer, this.amount.value, { accountId, secret });
    }
  }


  handleBlur() {
    const contact = this.getContact();
    if (!contact) {
      if (this.dest.value.indexOf('*') !== -1) {
        this.props.fedLookup(this.dest.value);
      } else if (!StellarSdk.Keypair.isValidPublicKey(this.dest.value)) {
        this.setState({ error: 'Cette adresse n\'est pas valide' });
      }
    } else {
      this.dest.value = contact.accountId;
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" onBlur={this.handleBlur} className="form-control" placeholder="destination address" ref={(node) => { this.dest = node; }} defaultValue={this.state.accountId || 'regisg*lobstr.co'} /> {/** GCSKO7QZZW6HNQ45J624XLRFUIB6HQYD4ZIFVFWSJUR5VAFBZP7FC7JI**/}
          {this.state.error && <div className="text-danger">{this.state.error}</div>}
        </div>
        <div className="form-group">
          <select ref={(node) => { this.currency = node; }} className="form-control" defaultValue="XLM">
            {this.props.balances.map(bal => { // eslint-disable-line
              return bal.asset_type === 'native' ?
                <option key="XLM" value="XLM">XLM</option> :
                <option key={bal.asset_code} value={bal.asset_code}>{bal.asset_code}</option>;
            })}
          </select>
        </div>
        <div className="form-group">
          <input type="number" className="form-control" placeholder="montant" ref={(node) => { this.amount = node; }} />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="memo" ref={(node) => { this.memo = node; }} />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="destinationTag" ref={(node) => { this.destinationTag = node; }} />
        </div>
        <button className="btn btn-primary btn-block" type="submit">PAYER</button>
      </form>
  ); }
}
