import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import includes from "lodash/includes";
import capitalize from "lodash/capitalize";
import { createStructuredSelector } from "reselect";
import { calculeTotauxCommande } from "containers/Commande/utils";
import RaisedButton from "material-ui/RaisedButton";
import {
  selectFournisseursCommande,
  selectCommandeProduits,
  selectOffres
} from "containers/Commande/selectors";

import { selectCompteUtilisateur } from "containers/CompteUtilisateur/selectors";

import CommandeFournisseur from "./CommandeFournisseur";
import CommandeDistributeur from "./CommandeDistributeur";
import FournisseurToolbar from "./FournisseurToolbar";
import FinalisationDetails from "./FinalisationDetails";
import styles from "./styles.css";
import { addDestinataire } from "containers/AdminCommunication/actions";

// eslint-disable-next-line
class DetailsParFournisseur extends Component {
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    finalisation: PropTypes.object,
    produits: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    handleValidate: PropTypes.func.isRequired,
    addDestinataire: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { finalisation } = this.props;
    this.state = {
      // eslint-disable-next-line
      viewFinalisation: finalisation ? true : false
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.params.commandeId !== nextProps.params.commandeId) {
      // eslint-disable-next-line
      this.setState({
        viewFinalisation: !!nextProps.finalisation
      });
    }
  };

  handleContacterAcheteurs = type => {
    const { utilisateurs, commandeUtilisateurs } = this.props;
    utilisateurs
      .filter(u => commandeUtilisateurs.find(cu => cu.utilisateurId === u.id))
      .forEach(utilisateur => {
        const { telPortable, email, nom, prenom } = utilisateur;
        const identite = `${capitalize(prenom)} ${nom.toUpperCase()}`;
        if (type === "email" && email) {
          this.props.addDestinataire({ email, id: utilisateur.id, identite });
        } else if (type === "sms" && telPortable) {
          this.props.addDestinataire({
            telPortable,
            id: utilisateur.id,
            identite
          });
        }
      });
  };

  render() {
    const {
      commandeContenus,
      contenus,
      produits,
      fournisseurs,
      commandeUtilisateurs,
      offres,
      params,
      auth,
      pushState,
      finalisation
    } = this.props;

    const { viewFinalisation } = this.state;

    const { commandeId, relaiId } = params;

    const totaux = calculeTotauxCommande({
      filter: cc => cc.commandeId === commandeId,
      offres,
      commandeContenus,
      commandeId
    });

    const nbreCommandeLivrees = commandeUtilisateurs.filter(cu => cu.dateLivraison).length;
    const distribuee = nbreCommandeLivrees === commandeUtilisateurs.length;

    return (
      <div className={`row ${styles.detailsParFournisseur}`}>
        {(includes(auth.roles, "ADMIN") || includes(auth.roles, "RELAI_ADMIN")) &&
          <FournisseurToolbar
            relaiId={relaiId}
            role={auth.roles}
            pushState={pushState}
            commandeId={commandeId}
            distribuee={distribuee}
            finalisee={finalisation !== null}
            validate={this.props.handleValidate}
            contacterAcheteurs={this.handleContacterAcheteurs}
          />}
        <div className={`col-md-4 ${styles.totalDistrib}`}>
          Total Cde:{" "}
          <strong>{parseFloat(totaux.prix).toFixed(2)} €</strong>
        </div>
        <div className={`col-md-4 ${styles.totalDistrib}`}>
          Total Dist:{" "}
          <strong>{parseFloat(totaux.recolteFond).toFixed(2)} €</strong>
        </div>
        <div className={`col-md-4 ${styles.totalDistrib}`}>
          {finalisation &&
            <RaisedButton
              label={!viewFinalisation ? "finalisation" : "détails"}
              fullWidth
              onClick={() =>
                this.setState({
                  viewFinalisation: !this.state.viewFinalisation
                })}
            />}
        </div>
        {viewFinalisation &&
          <FinalisationDetails destinataires={finalisation.destinataires} params={params} />}
        {!viewFinalisation &&
          <div className={`col-md-12 ${styles.listeCommandes}`}>
            {fournisseurs.filter(f => f.visible).map((fournisseur, idx) => {
              const pdts = produits.filter(pdt => pdt.fournisseurId === fournisseur.id);
              return (
                <div className="col-md-12" style={{ marginTop: "1em" }}>
                  <CommandeFournisseur
                    key={idx}
                    fournisseur={fournisseur}
                    produits={pdts}
                    commandeContenus={commandeContenus}
                    contenus={contenus}
                    offres={offres}
                    commandeId={commandeId}
                  />
                </div>
              );
            })}
            {false &&
              <CommandeDistributeur
                key={"1x"}
                fournisseur={fournisseurs[0]}
                produits={produits}
                commandeContenus={commandeContenus}
                contenus={contenus}
                offres={offres}
                commandeId={commandeId}
                noFiltre
              />}
          </div>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
  offres: selectOffres(),
  auth: selectCompteUtilisateur()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push,
      addDestinataire
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParFournisseur);
