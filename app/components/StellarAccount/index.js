import React, { PropTypes, Component } from 'react';
import api from 'utils/stellarApi';
import round from 'lodash/round';

class StellarAccount extends Component {
  static propTypes = {
    stellarAdr: PropTypes.string.isRequired,
  };

  state = {
    account: null,
    loading: false,
  };

  componentDidMount() {
    const { stellarAdr } = this.props;
    this.loadAccount(stellarAdr);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stellarAdr !== nextProps.stellarAdr) {
      this.setState({ account: null, loading: true });
      this.loadAccount(nextProps.stellarAdr);
    }
  }

  loadAccount(adresse) {
    api
      .loadAccount(adresse)
      .then(res => {
        const account = res.balances.find(b => b.asset_code === 'PROXI');
        this.setState({ account, loading: false });
      })
      .catch(() => {
        this.setState({ ...this.state, error: true });
      });
  }

  render() {
    const { loading, account } = this.state;
    return (
      <h3>
        Solde porte-monnaie{' '}
        {loading && !account && '...'}
        {this.state.account &&
          round(parseFloat(this.state.account.balance), 2).toFixed(2)}
      </h3>
    );
  }
}

export default StellarAccount;