import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { format } from "utils/dates";
import truncate from "lodash/truncate";
import round from "lodash/round";
import capitalize from "lodash/capitalize";
import includes from "lodash/includes";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import SwapHorizIcon from "material-ui/svg-icons/action/swap-horiz";
import { createStructuredSelector } from "reselect";
import { calculeTotauxCommande } from "containers/Commande/utils";
import api from "utils/stellarApi";

import {
  selectFournisseursCommande,
  selectCommandeProduits,
  selectCommande,
  selectUtilisateurs,
  selectOffres
} from "containers/Commande/selectors";

import { createCommande } from "containers/Commande/actions";

// eslint-disable-next-line
class FinalisationCommande extends Component {
  static propTypes = {
    commande: PropTypes.object.isRequired,
    utilisateurs: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    createCommande: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { offres, commandeContenus, produits, contenus, params: { commandeId } } = this.props;

    this.state = {
      paiements: null,
      error: false,
      revenus: this.props.fournisseurs.reduce((memo, f) => {
        const fournisseurContenus = Object.keys(contenus)
          .filter(
            id =>
              contenus[id].commandeId === commandeId &&
              produits.find(pdt => pdt.id === offres[contenus[id].offreId].produitId).fournisseurId === f.id
          )
          .map(id => contenus[id]);

        let prix = 0;
        let recolteFond = 0;

        if (fournisseurContenus.length) {
          const totaux = calculeTotauxCommande({
            // contenus: fournisseurContenus,
            offres,
            commandeContenus: fournisseurContenus,
            commandeId
          });
          prix = round(totaux.prix, 2);
          recolteFond = totaux.recolteFond;
        }

        return {
          ...memo,
          [f.id]: {
            nom: f.nom,
            prix,
            recolteFond,
            sync: true
          }
        };
      }, {})
    };
    this.loadAccount();
  }

  handleChange = event => {
    const [field, id] = event.target.name.split("_");
    const { prix, recolteFond, nom, sync } = this.state.revenus[id];

    const fournVentil = {
      ...this.state.revenus[id],
      [field]: parseFloat(event.target.value)
    };

    if (sync) {
      const total = round(prix + recolteFond, 2);
      const newVal = round(total - parseFloat(event.target.value), 2);
      const otherField = field === "prix" ? "recolteFond" : "prix";
      fournVentil[otherField] = newVal;
    }
    const newState = {
      ...this.state,
      revenus: { ...this.state.revenus, [id]: fournVentil }
    };

    this.setState(newState);
  };

  loadAccount = () => {
    const { commande } = this.props;
    api
      .loadAccount(commande.stellarKeys.adresse)
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
  };

  toggleSync = id =>
    this.setState({
      ...this.state,
      revenus: {
        ...this.state.revenus,
        [id]: { ...this.state.revenus[id], sync: !this.state.revenus[id].sync }
      }
    });

  saveCommande = () => {
    const { utilisateurs, params: { relaiId }, commande } = this.props;
    const destinataires = Object.keys(this.state.revenus).map(id => {
      const { prix, nom } = this.state.revenus[id];
      return { id, montant: prix, nom, paiementOk: false, type: "fournisseur" };
    });

    const distributeurId = Object.keys(utilisateurs).find(
      id => utilisateurs[id].relaiId === relaiId && includes(utilisateurs[id].roles, "RELAI_ADMIN")
    );

    destinataires.push({
      id: distributeurId,
      montant: Object.keys(this.state.revenus).reduce((m, id) => m + this.state.revenus[id].recolteFond, 0),
      nom: `${capitalize(utilisateurs[distributeurId].prenom)} ${utilisateurs[
        distributeurId
      ].nom.toUpperCase()}`,
      type: "distributeur",
      paiementOk: false
    });

    this.props.createCommande(
      {
        ...commande,
        finalisation: {
          dateFinalisation: format(new Date()),
          destinataires
        }
      },
      "Commande finalisée"
    );
  };

  render() {
    const totalRecolteFond = Object.keys(this.state.revenus).reduce(
      (m, id) => m + this.state.revenus[id].recolteFond,
      0
    );
    const totalCommande = Object.keys(this.state.revenus).reduce(
      (m, id) => m + this.state.revenus[id].recolteFond + this.state.revenus[id].prix,
      0
    );
    return (
      <div className="row center-md" style={{ padding: "1em" }}>
        {Object.keys(this.state.revenus).filter(id => this.state.revenus[id].prix).map((id, idx) => {
          return (
            <div key={idx} className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <FlatButton
                    label={truncate(this.state.revenus[id].nom, {
                      length: 25
                    })}
                    icon={<SwapHorizIcon color={this.state.revenus[id].sync ? "green" : "silver"} />}
                    onClick={() => this.toggleSync(id)}
                  />
                </div>
                <div className="col-md-12">
                  <input
                    value={this.state.revenus[id].prix}
                    step="0.01"
                    type="number"
                    name={`prix_${id}`}
                    onChange={this.handleChange} // eslint-disable-line
                  />
                  <input
                    value={this.state.revenus[id].recolteFond}
                    step="0.01"
                    type="number"
                    name={`recolteFond_${id}`}
                    onChange={this.handleChange} // eslint-disable-line
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-md-12">
          <div className="row center-md">
            <div className="col-md-6">
              <h3>
                Total distributeur{" "}
                {totalRecolteFond}
                {" "}€
              </h3>
              <h3>
                Total commande{" "}
                {totalCommande}
                {" "}€
              </h3>
              {this.state.paiements &&
                <h3>
                  Total reçu{" "}
                  {parseFloat(this.state.paiements.balance).toFixed(2)}{" "}€
                </h3>}
            </div>
            {this.state.paiements &&
              Math.abs(totalCommande - parseFloat(this.state.paiements.balance)) < 0.0099 &&
              <div className="col-md-10">
                <RaisedButton label="Valider la ventilation" primary fullWidth onClick={this.saveCommande} />
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseursCommande(),
  commande: selectCommande(),
  produits: selectCommandeProduits(),
  offres: selectOffres(),
  utilisateurs: selectUtilisateurs()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCommande
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FinalisationCommande);
