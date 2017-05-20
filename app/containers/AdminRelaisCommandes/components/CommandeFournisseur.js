import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import groupBy from 'lodash/groupBy';
import FlatButton from 'material-ui/FlatButton';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import DetailCommande from './DetailCommande';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import {
  supprimerCommandeContenusFournisseur,
} from 'containers/Commande/actions';
import {
  setMessage,
  addDestinataire,
} from 'containers/AdminCommunication/actions';

import DetailCommandeTotal from './DetailCommandeTotal';

class CommandeFournisseur extends Component {
  // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    produits: PropTypes.array.isRequired,
    commandeId: PropTypes.string.isRequired,
    supprimeCommandeContenusFournisseur: PropTypes.func.isRequired,
    addDestinataire: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    key: PropTypes.string.isRequired,
  };

  handleSupprCommandeContenusFourn = event => {
    const {
      fournisseur,
      commandeId,
      supprimeCommandeContenusFournisseur,
    } = this.props;
    event.preventDefault();
    supprimeCommandeContenusFournisseur({
      fournisseurId: fournisseur.id,
      commandeId,
    });
  };

  handleSendMessageFournisseur = () => {
    const {
      commandeContenus,
      fournisseur,
      commandeId,
      produits,
      offres,
    } = this.props;
    const contenusFiltered = Object.keys(commandeContenus)
      .map(id => commandeContenus[id])
      .filter(
        c =>
          c.commandeId === commandeId &&
          produits.find(
            pdt =>
              pdt.id === offres[c.offreId].produitId &&
              pdt.fournisseurId === fournisseur.id
          )
      );
    const grouped = groupBy(contenusFiltered, 'offreId');
    const sms = Object.keys(grouped)
      .map(offreId =>
        grouped[offreId].reduce(
          (m, c) => ({
            offreId,
            quantite: m.quantite + c.quantite,
            qteRegul: m.qteRegul + c.qteRegul,
          }),
          { offreId, quantite: 0, qteRegul: 0 }
        )
      )
      .reduce((m, cagg) => {
        const pdt = produits.find(
          pdt => pdt.id === offres[cagg.offreId].produitId
        );
        return `${m}${pdt.ref || pdt.nom} x ${cagg.quantite} + `;
      }, '');

    this.props.setMessage({
      sms: `Bonjour, commande Proxiweb : ${sms} Merci.`,
      objet: 'cde fourn',
      html: 'cdefourn',
    });
    this.props.addDestinataire({
      identite: fournisseur.nom,
      telPortable: fournisseur.telPortable,
      id: uuid.v4(),
    });
  };

  render() {
    const {
      fournisseur,
      produits,
      commandeContenus,
      commandeId,
      offres,
      key,
    } = this.props;

    const contenusFournisseur = Object.keys(commandeContenus)
      .map(id => commandeContenus[id])
      .filter(
        c =>
          c.commandeId === commandeId &&
          produits.find(
            pdt =>
              pdt.id === offres[c.offreId].produitId &&
              pdt.fournisseurId === fournisseur.id
          )
      );

    const totaux = calculeTotauxCommande({
      filter: cc =>
        produits.find(
          pdt =>
            pdt.id === offres[cc.offreId].produitId &&
            pdt.fournisseurId === fournisseur.id
        ),
      offres,
      commandeContenus,
      commandeId,
    });
    return (
      <div className="row" key={key}>
        <div className="col-md-8" style={{ margin: '3em 0 0.5em' }}>
          <div>
            {fournisseur.nom.toUpperCase()}
            {fournisseur.telPortable &&
              <FlatButton
                icon={<MessageIcon />}
                onClick={this.handleSendMessageFournisseur}
              />}
          </div>
        </div>
        <div
          className="col-md-4"
          style={{ textAlign: 'right', margin: '3em 0 0.5em' }}
        >
          <RaisedButton
            secondary
            label="Retirer"
            onClick={this.handleSupprCommandeContenusFourn}
          />
        </div>
        <div className="col-md-12">
          <DetailCommande
            contenusFiltered={contenusFournisseur}
            commandeContenus={Object.keys(commandeContenus).map(
              id => commandeContenus[id]
            )}
            produits={produits}
            commandeId={commandeId}
            offres={offres}
          />
          <DetailCommandeTotal totaux={totaux} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      supprimeCommandeContenusFournisseur: supprimerCommandeContenusFournisseur,
      setMessage,
      addDestinataire,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(CommandeFournisseur);
