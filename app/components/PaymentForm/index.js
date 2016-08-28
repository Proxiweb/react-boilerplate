import React, { Component, PropTypes } from 'react';
export default class PaymentForm extends Component {
  static propTypes = {
    pay: PropTypes.func.isRequired,
    stellarKeys: PropTypes.object.isRequired,
    balances: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { accountId, secret } = this.props.stellarKeys;
    const currencyBal = this.props.balances.find(bal => bal.asset_code === this.currency.value || (this.currency.value === 'XLM' && bal.asset_type === 'native'));
    const issuer = this.currency.value === 'XLM' ? undefined : currencyBal.asset_issuer;
    if (parseFloat(currencyBal.balance) > parseFloat(this.amount.value)) {
      this.props.pay(this.dest.value, this.currency.value, issuer, this.amount.value, { accountId, secret });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="destination address" ref={(node) => { this.dest = node; }} defaultValue="GCSKO7QZZW6HNQ45J624XLRFUIB6HQYD4ZIFVFWSJUR5VAFBZP7FC7JI" />
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
        <button className="btn btn-primary btn-block" type="submit">PAYER</button>
      </form>
  ); }
}
