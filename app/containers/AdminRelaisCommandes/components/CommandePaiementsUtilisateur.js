import React, { Component, PropTypes } from 'react';
import round from 'lodash.round';

import api from 'utils/stellarApi';
export default class CommandePaiementsUtilisateur extends Component {
  static propTypes = {
    adresseStellarCommande: PropTypes.string.isRequired,
    adresseStellarUtilisateur: PropTypes.string.isRequired,
  }

  state = {
    paiements: [],
    soldeCompte: null,
  }

  componentDidMount = () => {
    this.loadPayments();
    this.loadAccount();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.adresseStellarUtilisateur !== this.props.adresseStellarUtilisateur) {
      this.loadAccount();
    }
  }

  loadPayments = () => {
    api
      .loadPayments(this.props.adresseStellarCommande, 100)
      .then((res) => {
        this.setState({
          ...this.state,
          paiements: res,
        });
      });
  }

  loadAccount = () => {
    api
      .loadAccount(this.props.adresseStellarUtilisateur, 100)
      .then((res) => {
        this.setState({
          ...this.state,
          soldeCompte: res.balances,
        });
      });
  }

  render() {
    if (this.state.paiements.length === 0) return null;
    const paiements = this.state.paiements.filter(
      (p) => p.source_account === this.props.adresseStellarUtilisateur
    );

    return (
      <h1>
        Paiements {round(paiements.reduce((memo, pay) => memo + pay.amount, 0), 2)}<br />
        Solde {this.state.soldeCompte && round(this.state.soldeCompte[0].balance, 2)}
      </h1>);
  }
}
