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
import assign from 'lodash/assign';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
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
import { ajouter, supprimer, sauvegarder, load} from './actions';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import DetailCommande from 'components/DetailCommande';
import LivraisonSelector from 'components/LivraisonSelector';
import messages from './messages';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    contenus: PropTypes.number,
    quantiteOffresAchetees: PropTypes.array,
    livraisons: PropTypes.array,
    offres: PropTypes.object.isRequired,
    // offresRelais: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    sauvegarder: PropTypes.func.isRequired,

    load: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    selectedTypeProduct: PropTypes.object,
    commandeUtilisateur: PropTypes.object,
    produitsById: PropTypes.object,
    commande: PropTypes.commande,
    utilisateurId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.selectionnePlageHoraire = this.selectionnePlageHoraire.bind(this);
    this.state = { view: 'panier' };
  }

  componentDidMount() {
    const { commandeUtilisateur } = this.props;
    if (commandeUtilisateur) {
      this.props.load(commandeUtilisateur);
    }
  }

  selectionnePlageHoraire(plageHoraire, livraisonId) {
    const { commande } = this.props;
    this.props.sauvegarder(assign(commande, { plageHoraire, livraisonId }));
    this.setState({ view: 'panier' });
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
      offres,
      supprimer, // eslint-disable-line
      utilisateurId,
      livraisons,
    } = this.props;

    const { typeProduitId, commandeId } = params;
    const { view } = this.state;

    const testLivraisons = [
      {
        id: '802744c6-2d16-4517-aa43-0edbfcf35c8c',
        debut: '2016-09-30T14:00.000',
        fin: '2016-09-30T19:00.000+00:00',
      },
      {
        id: '900744c6-2d16-4517-aa43-0edbfcf35c8c',
        debut: '2016-10-01T10:00.000+00:00',
        fin: '2016-10-01T12:00.000+00:00',
      },
    ];
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
              {produits.map((pdt, idx) => <ListItem key={idx} onClick={() => this.navigateTo(pdt.id)}>{pdt.nom}</ListItem>)}
          </List>
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
          { (!commande || commande.contenus.length === 0) && <h1>Panier vide</h1>}
          { view === 'distribution' && (
            <LivraisonSelector
              livraisons={testLivraisons}
              plageHoraire={commande.plageHoraire}
              livraisonId={commande.livraisonId}
              selectionnePlageHoraire={this.selectionnePlageHoraire}
            />) }
          { view === 'panier' && commande && commande.contenus.length > 0 && (
            <DetailCommande
              contenus={commande.contenus}
              offres={offres}
              produits={produitsById}
              supprimer={supprimer}
              readOnly={typeof commande.id !== 'undefined'}
            />
          )}
          {commande && (!commande.id || commande.modifiee) && (
            <RaisedButton
              label="Valider le panier"
              style={{ marginTop: 20 }}
              onClick={() => this.props.sauvegarder(assign(commande, { commandeId, utilisateurId }))}
            />)}
          {view === 'panier' && commande && commande.id && !commande.modifiee && commande.livraisonId && (
            <div>
              <span>{commande.livraisonId} </span>
              <RaisedButton
                label="Modifier"
                style={{ marginTop: 20 }}
                onClick={() => this.setState({ view: 'distribution' })}
              />
            </div>
          )}
          {commande && commande.id && !commande.modifiee && !commande.livraisonId && (
            <RaisedButton
              label="Choisissez le jour de distribution"
              style={{ marginTop: 20 }}
              onClick={() => this.setState({ view: 'distribution' })}
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
  produitsById: selectProduits(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  // offresRelais: selectOffresRelais(),
  // commandeUtilisateur: selectUtilisateurCommandeUtilisateur(),
  utilisateurId: selectUtilisateurId(),
  params: selectParams(),
  commandeUtilisateur: selectUtilisateurCommandeUtilisateur(), // commande utilisateur existante
  commande: selectCommande(), // commande courante en cours d'édition
  livraisons: selectCommandeLivraisons(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    load: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    ajouter: (offre) => dispatch(ajouter(offre)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
    sauvegarder: (datas) => dispatch(sauvegarder(datas)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
