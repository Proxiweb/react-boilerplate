import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ListItem } from "material-ui/List";
import round from "lodash/round";
import PastilleIcon from "material-ui/svg-icons/image/brightness-1";
import DoneIcon from "material-ui/svg-icons/action/done";
import DoneAllIcon from "material-ui/svg-icons/action/done-all";
import WalletIcon from "material-ui/svg-icons/action/account-balance-wallet";
import capitalize from "lodash/capitalize";
import api from "utils/stellarApi";

class ListeAcheteursItem extends Component {
  static propTypes = {
    utilisateur: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    commandeUtilisateur: PropTypes.object.isRequired,
    depots: PropTypes.array.isRequired,
    key: PropTypes.number.isRequired,
    totaux: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  };

  state = {
    color: "silver",
    paiements: null,
    error: false
  };

  componentDidMount() {
    if (this.props.utilisateur.stellarKeys && !this.props.commandeUtilisateur.dateLivraison) {
      api
        .loadAccount(this.props.utilisateur.stellarKeys.adresse)
        .then(res => {
          const bal = res.balances.find(b => b.asset_code === "PROXI");
          this.setState({
            ...this.state,
            paiements: bal
          });
        })
        .catch(() => {
          this.setState({ ...this.state, error: true });
        });
    }
  }

  computeDatas = () => {
    const { utilisateur: { id }, depots, totaux, commandeUtilisateur } = this.props;
    const { paiements } = this.state;
    const dep = depots.find(d => d.utilisateurId === id && !d.transfertEffectue && d.type === "depot_relais");
    // si un dépot a été fait, en tenir compte
    const depot = dep && dep.montant ? parseFloat(dep.montant) : 0;

    let iconColor = "silver";
    if (this.state.paiements) {
      const total = round(parseFloat(totaux.prix + totaux.recolteFond), 2);
      const totalAvecDepot = round(depot + parseFloat(paiements.balance), 2);

      iconColor = total <= totalAvecDepot ? "green" : "orange";
    }

    return {
      dep,
      iconColor
    };
  };

  handleClick = dep => {
    const { utilisateur, totaux } = this.props;
    const totalCommande = round(totaux.prix + totaux.recolteFond, 2);

    this.props.onClick(utilisateur.id, dep, totalCommande, this.state.paiements);
  };

  render() {
    const { key, utilisateur, commandeUtilisateur, onClick } = this.props;

    const datas = this.computeDatas();
    const { dep, iconColor } = datas;
    return (
      <ListItem
        key={key}
        primaryText={`${utilisateur.nom.toUpperCase()} ${capitalize(utilisateur.prenom)}`}
        value={this.props.value}
        onClick={() => this.handleClick(dep)}
        leftIcon={
          commandeUtilisateur.dateLivraison
            ? commandeUtilisateur.datePaiement ? <DoneAllIcon color="green" /> : <DoneIcon color="green" />
            : <PastilleIcon color={iconColor} />
        }
        rightIcon={dep && <WalletIcon />}
      />
    );
  }
}

export default connect()(ListeAcheteursItem);
