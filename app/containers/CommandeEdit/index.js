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
import { List, ListItem } from 'material-ui/List';
import Helmet from 'react-helmet';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
  selectCommandeProduits,
  selectFournisseurProduit,
  computeNombreCommandeContenus,
  selectOffres,
  selectOffresByProduit,
  selectProduits,
  selectNombreAcheteurs,
  selectParams,
  selectCommandeLivraisons,
  selectQuantiteOffresAchetees,
  selectUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';
import { selectCommande } from './selectors';
import { selectUtilisateurId } from 'containers/CompteUtilisateur/selectors';
import { ajouter, supprimer, sauvegarder, load, setDistibution } from './actions';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import OrderValidate from 'components/OrderValidate';
import messages from './messages';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    commandeProduits: PropTypes.array.isRequired,
    quantiteOffresAchetees: PropTypes.array,
    livraisons: PropTypes.array,
    offres: PropTypes.object.isRequired,
    // offresRelais: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    sauvegarder: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,

    load: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateur: PropTypes.object,
    produitsById: PropTypes.object,
    commande: PropTypes.object,
    fournisseur: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentDidMount() {
    const { commandeUtilisateur, typeProduits, commandeProduits, params } = this.props;
    const { commandeId } = params;
    if (commandeUtilisateur) {
      this.props.load(commandeUtilisateur);
    }

    // sélectionner le premier produit du premier type
    const premierTypeProduit = typeProduits.length ? typeProduits[0] : null;
    if (premierTypeProduit) {
      const pdts = commandeProduits.filter((prod) => prod.typeProduitId === premierTypeProduit.id);
      if (pdts && pdts.length) {
        this.props.pushState(`/commandes/${commandeId}/typeProduits/${premierTypeProduit.id}/produits/${pdts[0].id}`);
      }
    }
  }

  handleChange(event, index, value) {
    const { params } = this.props;
    this.props.pushState(`/commandes/${params.commandeId}/typeProduits/${value}`);
  }

  navigateTo(productId) {
    const { commandeId, typeProduitId } = this.props.params;
    this.props.pushState(`/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}`);
  }

  render() {
    const {
      typeProduits,
      produits,
      produitsById,
      quantiteOffresAchetees,
      params,
      commande,
      fournisseur,
      offres,
      supprimer, // eslint-disable-line
      utilisateurId,
      livraisons,
    } = this.props;

    const { typeProduitId, commandeId, produitId } = params;

    return (
      <div className={`${styles.commandeEdit} row`}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <div className="col-md-2">
          <SelectField
            value={typeProduitId}
            onChange={this.handleChange}
            iconStyle={{ fill: 'black' }}
            underlineStyle={{ borderColor: 'black' }}
            style={{ width: '100%' }}
          >
            { typeProduits && typeProduits.map((type, index) => <MenuItem key={index} value={type.id} primaryText={type.nom} />)}
          </SelectField>
          {produits && (
            <List>
                {produits.map((pdt, idx) => (
                  <ListItem
                    key={idx}
                    onClick={() => this.navigateTo(pdt.id)}
                    style={produitId && pdt.id === produitId ? { backgroundColor: 'red' } : {}}
                  >
                    {pdt.nom}
                  </ListItem>
                ))}
            </List>
            )}
        </div>
        <div className="col-md-5">
          {quantiteOffresAchetees && (
            <div>
              <p>{fournisseur && fournisseur.nom}</p>
              <ul>
                {quantiteOffresAchetees.map((offre, idx) => {
                  const produit = produits.find((pdt) => pdt.id === offre.produitId);
                  return (<li key={idx}>
                    {produit.nom} {offre.description} ({parseInt(offre.poids / 1000, 10)}g) : {offre.quantiteTotal}
                    {!commande.id && (<RaisedButton
                      onClick={() => this.props.ajouter({ offreId: offre.id, quantite: 1, commandeId, utilisateurId })}
                      label="Ajouter"
                    />)}
                  </li>);
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="col-md-5">
          { (!commande || commande.contenus.length === 0) ?
            <h1>Panier vide</h1> :
            <OrderValidate
              commande={commande}
              commandeId={commandeId}
              utilisateurId={utilisateurId}
              sauvegarder={this.props.sauvegarder}
              supprimer={this.props.supprimer}
              setDistibution={this.props.setDistibution}
              produitsById={produitsById}
              offres={offres}
            />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  commandeProduits: selectCommandeProduits(),
  // selectedTypeProduct: selectedTypeProduct(),
  offres: selectOffres(),
  produitsById: selectProduits(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  // offresRelais: selectOffresRelais(),
  // commandeUtilisateur: selectUtilisateurCommandeUtilisateur(),
  utilisateurId: selectUtilisateurId(),
  params: selectParams(),
  commandeUtilisateur: selectUtilisateurCommandeUtilisateur(), // commande utilisateur existante
  commande: selectCommande(), // commande courante en cours d'édition
  livraisons: selectCommandeLivraisons(),
  fournisseur: selectFournisseurProduit(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    load: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    ajouter: (offre) => dispatch(ajouter(offre)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
    sauvegarder: (datas) => dispatch(sauvegarder(datas)),
    setDistibution: (livraisonId, plageHoraire) => dispatch(setDistibution(livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
