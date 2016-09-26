/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
  computeNombreCommandeContenus,
  selectOffresByProduit,
  selectNombreAcheteurs,
  selectParams,
  selectQuantiteOffresAchetees,
  selectUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    contenus: PropTypes.number,
    quantiteOffresAchetees: PropTypes.array,
    offres: PropTypes.array,
    acheteurs: PropTypes.number,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    selectedTypeProduct: PropTypes.object,
    commandeUtilisateur: PropTypes.object,
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
    const { typeProduits, produits, acheteurs, quantiteOffresAchetees, params, commandeUtilisateur } = this.props;
    const { commandeId, typeProduitId } = params;
    return (
      <div className={styles.commandeEdit}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <h1><FormattedMessage {...messages.header} /></h1>
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
        {quantiteOffresAchetees && (
          <div>
            <ul>
              {quantiteOffresAchetees.map((offre, idx) => {
                const produit = produits.find((pdt) => pdt.id === offre.produitId);
                return <li key={idx}>{produit.nom} {offre.description} ({parseInt(offre.poids / 1000, 10)}g) : {offre.quantiteTotal}</li>;
              })}
            </ul>
          </div>
        )}
        { acheteurs && <h1>{acheteurs}</h1>}
        { !commandeUtilisateur && <h1>Panier vide</h1>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  // selectedTypeProduct: selectedTypeProduct(),
  offres: selectOffresByProduit(),
  acheteurs: selectNombreAcheteurs(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  // contenus: computeNombreCommandeContenus(),
  commandeUtilisateur: selectUtilisateurCommandeUtilisateur(),
  params: selectParams(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
