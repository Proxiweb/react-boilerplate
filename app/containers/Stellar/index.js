import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadAccount } from './actions';

class StellarMain extends Component { // eslint-disable-line
  static propTypes = {
    account: PropTypes.object.isRequired,
    loadAccount: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (!this.props.account.balances) {
      this.props.loadAccount(this.props.account.stellarKeys.address);
    }
  }

  render() {
    const { account } = this.props;
    return (<div>
        {account.pending && <h1>chargement...</h1>}
        {account.balances && (
          <div>
            <h1>Chargé !</h1>
            <ul>
              {account.balances.map(bal => <li key={bal.asset_type === 'native' ? 'XLM' : 'TOI'}>{parseFloat(bal.balance)} {bal.asset_type === 'native' ? 'XLM' : 'TOI'}</li>)}
            </ul>
          </div>
        )}
    </div>);
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadAccount: (accountId) => dispatch(loadAccount(accountId)),
});

const mapStateToProps = (state) => ({ account: state.stellar });

export default connect(mapStateToProps, mapDispatchToProps)(StellarMain);
