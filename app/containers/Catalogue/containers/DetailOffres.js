import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';
import { prixAuKg, detailPrix } from 'containers/CommandeEdit/components/components/AffichePrix';
import OffreDetailsCard from 'components/OffreDetailsCard';


import {
    selectOffresDuProduit,
    selectTypesProduitsRelais,
    selectFournisseursRelais,
    selectProduitsRelaisByTypeProduit,
} from 'containers/Commande/selectors';

import styles from './styles.css';

class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array,
    produits: PropTypes.array.isRequired,
    typeProduits: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array,
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

  render() {
    const { viewOffre } = this.state;
    const {
      offres,
      fournisseurs,
      produits,
      typeProduits,
      params,
    } = this.props;

    if (!offres || !typeProduits) return null;
    const { produitId, relaiId } = params;
    const produit = produits.find((pdt) => pdt.id === produitId);

    if (!produit) {
      return <h1>{'Produit non trouvé'}</h1>;
    }

    const fournisseur = fournisseurs.find((f) => f.id === produit.fournisseurId);
    const muiTheme = this.context.muiTheme;

    // const generateTarifMin = (tarifications, idx) => {
    //   if (idx === 0) return <span><strong>1</strong> à <strong>{tarifications[1].qteMinRelais - 1}</strong></span>;
    //   const tarif = tarifications[idx];
    //   return tarifications[idx + 1]
    //     ? <span><strong>{tarif.qteMinRelais}</strong> à <strong>{tarifications[idx + 1].qteMinRelais - 1}</strong></span>
    //     : <span><strong>{tarif.qteMinRelais} et plus</strong></span>;
    // };

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
        { viewOffre && offres.filter((o) => o.active && o.relaiId === relaiId).map((offre, idx) => {
          const typeProduit = typeProduits.find((typesPdt) => typesPdt.id === produit.typeProduitId);
          const dPrix = detailPrix(offre, 0, 'json');
          const pAuKg = prixAuKg(offre, typeProduit, 'json');
          const tR = offre.tarifications.length > 1;
          return <OffreDetailsCard typeProduit={typeProduit} offre={offre} showSubtitle />;
          return (
            <div key={idx} className={`row ${styles.offre}`}>
              <div className="col-md-12">
                <Card
                  style={{
                    backgroundColor: muiTheme.palette.groupColor,
                    border: `solid 1px ${muiTheme.palette.groupColorBorder}`,
                    boxShadow: 'none',
                  }}
                >
                  <CardHeader
                    actAsExpander={tR}
                    showExpandableButton={tR}
                    textStyle={{ textAlign: 'left', paddingRight: 215 }}
                    title={<span>
                      {dPrix.descriptionPdt} : <strong>{parseFloat(dPrix.prix).toFixed(2)} €</strong>
                      {offre.poids && <small style={{ color: 'gray' }}>{`${'   '}${pAuKg.prixAuKg} € / Kg`}</small>}
                    </span>}
                    subtitle={tR && 'Tarif dégressif (cliquez pour plus de détails)'}
                  />
                  <CardText expandable>
                    <Table
                      selectable={false}
                      multiSelectable={false}
                    >
                      <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        style={{ color: 'black' }}
                      >
                        <TableRow>
                          <TableHeaderColumn
                            style={{ textAlign: 'left', color: 'black' }}
                          >
                            Quantité achetée <sup>*</sup></TableHeaderColumn>
                          <TableHeaderColumn
                            style={{ textAlign: 'right', color: 'black' }}
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
  typeProduits: selectTypesProduitsRelais(),
  offres: selectOffresDuProduit(),
  fournisseurs: selectFournisseursRelais(),
  produits: selectProduitsRelaisByTypeProduit(),
});

export default connect(mapStateToProps)(DetailOffres);
