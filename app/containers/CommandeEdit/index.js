/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
  computeNombreCommandeContenus,
  selectOffres,
  selectOffresByProduit,
  selectProduits,
  selectNombreAcheteurs,
  selectParams,
  selectQuantiteOffresAchetees,
  selectUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { selectCommande } from './selectors';
import { ajouter, supprimer } from './actions';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import DetailCommande from 'components/DetailCommande';
import messages from './messages';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    contenus: PropTypes.number,
    quantiteOffresAchetees: PropTypes.array,
    offres: PropTypes.object.isRequired,
    // offresRelais: PropTypes.object.isRequired,
    acheteurs: PropTypes.number,
    pushState: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    selectedTypeProduct: PropTypes.object,
    commandeUtilisateur: PropTypes.object,
    produitsById: PropTypes.object,
    commande: PropTypes.commande,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    const { params } = this.props;
    this.props.pushState(`/commandes/${params.commandeId}/typeProduits/${value}`);
  }

  render() {
    const { typeProduits, produits, produitsById, acheteurs, quantiteOffresAchetees, params, commande, offres, supprimer } = this.props;
    const { commandeId, typeProduitId } = params;
    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
      <div className="col-md-2">
        <SelectField value={typeProduitId} onChange={this.handleChange}>
          { typeProduits && typeProduits.map((type, index) => <MenuItem key={index} value={type.id} primaryText={type.nom} />)}
        </SelectField>
        {produits && (
          <div>
            <ul>
              {
                produits.map((pdt, idx) => (
                  <li key={idx}>
                    <Link to={`/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${pdt.id}`}>{pdt.nom}</Link>
                  </li>))
                }
            </ul>
          </div>
          )}
        </div>
        <div className="col-md-5">
          {quantiteOffresAchetees && (
            <div>
              <ul>
                {quantiteOffresAchetees.map((offre, idx) => {
                  const produit = produits.find((pdt) => pdt.id === offre.produitId);
                  return (<li key={idx}>
                    {produit.nom} {offre.description} ({parseInt(offre.poids / 1000, 10)}g) : {offre.quantiteTotal}
                    <RaisedButton onClick={() => this.props.ajouter({ offreId: offre.id, quantite: 1 })} label="Ajouter" />
                  </li>);
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="col-md-5">
          { acheteurs && <h1>{acheteurs}</h1>}
          { (!commande || commande.contenus.length === 0) && <h1>Panier vide</h1>}
          { commande && commande.contenus.length > 0 && (
            <DetailCommande
              contenus={commande.contenus}
              offres={offres}
              produits={produitsById}
              supprimer={supprimer}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  // selectedTypeProduct: selectedTypeProduct(),
  offres: selectOffres(),
  acheteurs: selectNombreAcheteurs(),
  produitsById: selectProduits(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  // offresRelais: selectOffresRelais(),
  commandeUtilisateur: selectUtilisateurCommandeUtilisateur(),
  params: selectParams(),
  commande: selectCommande(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    ajouter: (offre) => dispatch(ajouter(offre)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
