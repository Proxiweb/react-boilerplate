import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
} from 'material-ui/Table';

import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import { createStructuredSelector } from 'reselect';
import {
    selectOffresProduitAvecTotalAchats,
    selectCommandeTypesProduits,
    selectFournisseurProduit,
    selectProduits,
} from 'containers/Commande/selectors';

import { selectCommande } from 'containers/CommandeEdit/selectors';

import {
  ajouter,
} from 'containers/CommandeEdit/actions';
import round from 'lodash/round';

import AffichePrix, { prixAuKg, detailPrix } from 'containers/CommandeEdit/components/components/AffichePrix';
import styles from './styles.css';

class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array,
    commande: PropTypes.object.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    produitsById: PropTypes.object.isRequired,
    typeProduits: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fournisseur: PropTypes.object,
    ajouter: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      viewOffre: true,
    };
  }

  handleClick = (e, commandeId, offreId, utilisateurId) => {
    e.stopPropagation();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.ajouter(
      commandeId,
      { offreId, quantite: 1, commandeId, utilisateurId }
    );
  }

  render() {
    const { viewOffre } = this.state;
    const {
      offres,
      fournisseur,
      produitsById,
      typeProduits,
      commande,
      utilisateurId,
      params,
    } = this.props;

    if (!offres || !typeProduits) return null;

    const { produitId, commandeId } = params;
    const produit = produitsById[produitId];
    const contenus = commande.contenus;
    const muiTheme = this.context.muiTheme;

    const generateTarifMin = (tarifications, idx) => {
      if (idx === 0) return <span><strong>1</strong> à <strong>{tarifications[1].qteMinRelais - 1}</strong></span>;
      const tarif = tarifications[idx];
      return tarifications[idx + 1]
        ? <span><strong>{tarif.qteMinRelais}</strong> à <strong>{tarifications[idx + 1].qteMinRelais - 1}</strong></span>
        : <span><strong>{tarif.qteMinRelais} et plus</strong></span>;
    };

    return (
      <div className={styles.offres}>
        <div className="row">
          <div className={`col-md-12 ${styles.fournisseurSwitch}`}>
            <FlatButton
              onClick={() => this.setState((oldState) => ({ viewOffre: !oldState.viewOffre }))}
              primary
              label={viewOffre ? fournisseur.nom : 'Afficher les offres'}
            />
          </div>
          {viewOffre && <div className={`${styles.produitTitre} col-md-12`}>{produit.nom.toUpperCase()}</div>}
          <div className="col-md-12">
            <div className="row" style={{ margin: 5 }}>
              <div className="col-md-6">
                {viewOffre && <img src={`https://proxiweb.fr/${produit.photo}`} alt={produit.nom} style={{ width: '100%', height: 'auto', maxWidth: 200 }} />}
                {!viewOffre && <img src={`https://proxiweb.fr/${fournisseur.illustration}`} alt={produit.nom} style={{ width: '100%', height: 'auto', maxWidth: 200 }} />}
              </div>
              <div className="col-md-6">
                {viewOffre && <p dangerouslySetInnerHTML={{ __html: produit.description }} />}
                {!viewOffre && <p dangerouslySetInnerHTML={{ __html: fournisseur.presentation }} />}
              </div>
            </div>
          </div>
        </div>
        { viewOffre && offres.map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
          const enStock = offre.stock === null || offre.stock > 0;

          const offreCommande = contenus.find((cont) => cont.offreId === offre.id);
          const qteCommande = offreCommande ? offreCommande.quantite : 0;
          const dPrix = detailPrix(offre, qteCommande, 'json');
          const pAuKg = prixAuKg(offre, typeProduit, 'json');
          const tR = offre.tarifications.length > 1;

          return (
            <div key={idx} className={`row ${styles.offre}`}>
              <div className="col-md-12">
                <Card
                  style={{
                    backgroundColor: muiTheme.palette.groupColor,
                    border: `solid 1px ${muiTheme.palette.groupColorBorder}`,
                    boxShadow: 'none',
                    padding: '3px',
                  }}
                >
                  <CardHeader
                    actAsExpander={false}
                    showExpandableButton={tR}
                    style={{ padding: '5px' }}
                    textStyle={{ textAlign: 'left', paddingRight: 215, width: '360px' }}
                    title={<span>
                      {dPrix.descriptionPdt} : <strong>{parseFloat(dPrix.prix).toFixed(2)} €</strong>
                      {offre.poids && <small style={{ color: 'gray' }}>{`${'   '}${pAuKg.prixAuKg} € / Kg`}</small>}
                    </span>}
                  >
                    {
                      enStock ?
                        <RaisedButton
                          onClick={
                            (event) => this.handleClick(event, commandeId, offre.id, utilisateurId)
                          }
                          primary
                          label="Ajouter au panier"
                          icon={<AddShoppingCart />}
                        /> :
                        <span className={styles.nonDispo}>Non disponible</span>
                    }
                  </CardHeader>
                  <CardText expandable>
                    <Table
                      selectable={false}
                      multiSelectable={false}
                    >
                      <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                      >
                        <TableRow>
                          <TableHeaderColumn>Quantité achetée <sup>*</sup></TableHeaderColumn>
                          <TableHeaderColumn
                            style={{ textAlign: 'right' }}
                          >
                            Tarif
                          </TableHeaderColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody displayRowCheckbox={false}>
                        {offre.tarifications.map((t, index, tarifications) =>
                          <TableRow>
                            <TableRowColumn>
                              {generateTarifMin(tarifications, index)}
                            </TableRowColumn>
                            <TableRowColumn
                              style={{ textAlign: 'right' }}
                            >
                              {parseFloat(round((t.prix + t.recolteFond) / 100, 2)).toFixed(2)} €
                            </TableRowColumn>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <p><sup>*</sup> Quantité globale achetée par tous les participants de la commande</p>
                  </CardText>
                </Card>
              </div>
            </div>);
        })}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  offres: selectOffresProduitAvecTotalAchats(),
  fournisseur: selectFournisseurProduit(),
  produitsById: selectProduits(),
  commande: selectCommande(), // commande courante en cours d'édition
});

const mapDispatchToProps = (dispatch) => ({
  ajouter: (commandeId, offre) => dispatch(ajouter(commandeId, offre)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailOffres);
