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
    console.log('mount');
    this.loadPayments();
  }

  componentWillReceiveProps = () => {
    console.log('load');
    this.loadPayments();
    //this.setState({ paiements: [], soldeCompte: null });
  }

  loadPayments = () => {
    const { adresseStellarUtilisateur, adresseStellarCommande } = this.props;
    api
      .loadPayments('public', adresseStellarCommande, 100)
      .then((res) => this.setState({
        paiements: res.filter((p) => p.source_account === adresseStellarUtilisateur),
      }));
  }

  render() {
    if (this.state.paiements.length === 0) return null;
    return <h1>Paiements {round(this.state.paiements.reduce((memo, pay) => memo + pay.amount, 0), 2)}</h1>;
  }
}
