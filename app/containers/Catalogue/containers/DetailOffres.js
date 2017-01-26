import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import { createStructuredSelector } from 'reselect';
import { prixAuKg, detailPrix } from 'containers/CommandeEdit/components/components/AffichePrix';
import OffreDetailsCard from 'components/OffreDetailsCard';


import {
    selectOffresDuProduit,
    selectTypesProduitsRelais,
    selectFournisseursRelais,
    selectProduitsRelaisByTypeProduit,
} from 'containers/Commande/selectors';

import OffreDetails from 'components/OffreDetails';
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
          const tR = offre.tarifications.length > 1;
          return (
            <OffreDetails
              key={idx}
              typeProduit={typeProduit}
              offre={offre}
              subTitle="Tarif dégressif (cliquez pour plus de détails)"
              expandable={tR}
            />);
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
