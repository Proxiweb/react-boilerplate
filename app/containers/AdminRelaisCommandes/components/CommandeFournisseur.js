import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'node-uuid';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
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
      <Card style={{ marginBottom: '1em' }}>
        <CardHeader
          title={fournisseur.nom.toUpperCase()}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <CardActions expandable>
            <div className="row center-md">
              {fournisseur.telPortable &&
                <div className="col-md-4">
                  <FlatButton
                    icon={<MessageIcon />}
                    onClick={this.handleSendMessageFournisseur}
                    fullWidth
                  />
                </div>}
              <div className="col-md-4">
                <RaisedButton
                  secondary
                  label="Retirer"
                  onClick={this.handleSupprCommandeContenusFourn}
                  fullWidth
                />
              </div>
            </div>
          </CardActions>
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
        </CardText>
      </Card>
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
