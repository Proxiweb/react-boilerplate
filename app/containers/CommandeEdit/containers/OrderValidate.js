import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import assign from 'lodash/assign';

import DetailCommande from 'components/DetailCommande';
import LivraisonSelector from 'containers/CommandeEdit/components/components/LivraisonSelector';
import DistributionSelected from 'containers/CommandeEdit/components/components/DistributionSelected';
import Paiement from 'containers/CommandeEdit/components/Paiement';

import {
  ajouter,
  augmenter,
  diminuer,
  supprimer,
  sauvegarder,
  annuler,
  setDistibution,
  load,
} from 'containers/CommandeEdit/actions';

import {
  selectCommande,
} from 'containers/CommandeEdit/selectors';

import {
  selectCommande as selectCommandeProxiweb,
  selectCommandeContenus,
  selectOffres,
  selectProduits,
  selectCommandeLivraisons,
  selectAuthUtilisateurCommandeUtilisateur,
} from 'containers/Commande/selectors';

import { selectMontantBalance } from 'containers/CompteUtilisateur/selectors';

import styles from './OrderValidate.css';

class OrderValidate extends Component {
  static propTypes = {
    produitsById: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    commandeUtilisateur: PropTypes.object,
    utilisateurId: PropTypes.string.isRequired,
    livraisons: PropTypes.array.isRequired,
    commandeProxiweb: PropTypes.object.isRequired,
    balance: PropTypes.number.isRequired,

    load: PropTypes.func.isRequired,
    sauvegarder: PropTypes.func.isRequired,
    annuler: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    augmenter: PropTypes.func.isRequired,
    diminuer: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    view: 'panier',
  }

  componentDidMount() {
    const { commandeUtilisateur } = this.props;
    if (commandeUtilisateur) {
      this.props.load(commandeUtilisateur);
    }
  }

  selectionnePlageHoraire = (plageHoraire, livraisonId) => {
    this.props.setDistibution(this.props.params.commandeId, plageHoraire, livraisonId);
    this.setState({ view: 'panier' });
  }

  showValidate = () => {
    const { commande, params, utilisateurId } = this.props;
    const { commandeId } = params;
    const { palette } = this.context.muiTheme;
    return (
      <div className={styles.validation}>
        <RaisedButton
          label={`${commande.modifiee ? 'Sauvegarder mes modifications' : 'Valider la commande'}`}
          style={{ marginTop: 20 }}
          labelColor={commande.modifiee ? 'black' : 'white'}
          backgroundColor={commande.modifiee ? palette.warningColor : palette.primary1Color}
          onClick={() => this.props.sauvegarder(assign(commande, { commandeId, utilisateurId }))}
        />
      </div>
    );
  }

  showDistribSelected = () => {
    const { commande, livraisons } = this.props;
    const livraison = livraisons.find((liv) => liv.id === commande.livraisonId);
    if (!livraison) return <p>Livraison manquante</p>;
    return (
      <div className={styles.distributionSelected}>
        <DistributionSelected
          livraison={livraison}
          noPlageHoraire={commande.plageHoraire}
          className={styles.distriItem}
        />
        <FlatButton
          label="modifier"
          onClick={() => this.setState({ view: 'distribution' })}
          className={styles.distriButton}
          icon={<EditorIcon />}
          style={{ minWidth: 44 }}
        />
      </div>
    );
  }

  showDistribButton = () =>
    <RaisedButton
      label="Choisissez le jour de distribution"
      icon={<DateRangeIcon />}
      style={{ marginTop: 20 }}
      onClick={() => this.setState({ view: 'distribution' })}
    />;

  showDetailsCommande = () => {
    const {
      offres,
      commande,
      params,
      produitsById,
      commandeContenus,
    } = this.props;
    return (
      <DetailCommande
        contenus={commande.contenus}
        montant={commande.montant.toFixed(2)}
        recolteFond={commande.recolteFond.toFixed(2)}
        offres={offres}
        produits={produitsById}
        supprimer={this.props.supprimer}
        augmenter={this.props.augmenter}
        diminuer={this.props.diminuer}
        readOnly={commande.datePaiement}
        commandeContenus={commandeContenus}
        commandeId={params.commandeId}
      />
    );
  }

  showLivraisonSelector = () => {
    const { commande, livraisons, params } = this.props;
    return (<LivraisonSelector
      livraisons={livraisons}
      plageHoraire={commande.plageHoraire}
      livraisonId={commande.livraisonId}
      selectionnePlageHoraire={this.selectionnePlageHoraire}
      params={params}
    />);
  }

  showCancel = () => {
    const { commande } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        <RaisedButton
          label="Annuler la commande"
          secondary
          style={{ marginTop: 20 }}
          onClick={() => this.props.annuler(commande.id, commande.commandeId)}
          icon={<TrashIcon />}
        />
      </div>
    );
  }

  render() {
    const { commande, balance, commandeProxiweb } = this.props;
    const { view } = this.state;

    return (<div>
      { view === 'distribution' ? this.showLivraisonSelector() : this.showDetailsCommande() }
      { view === 'panier' && commande.livraisonId && this.showDistribSelected() }
      <div style={{ textAlign: 'center' }}>{view !== 'distribution' && !commande.livraisonId && commande.contenus.length > 0 && this.showDistribButton()}</div>
      {view === 'panier' && commande.livraisonId && (!commande.id || commande.modifiee) && this.showValidate()}
      {view === 'panier' && !commande.dateLivraison && commande.id && !commande.modifiee && this.showCancel()}
      {commande.id && <Paiement montant={commande.montant} balance={balance} dateLimite={moment(commandeProxiweb.dateCommande).format('LLLL')} />}
    </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  commande: selectCommande(), // commande courante en cours d'édition
  commandeUtilisateur: selectAuthUtilisateurCommandeUtilisateur(), // commande utilisateur existante
  commandeProxiweb: selectCommandeProxiweb(),
  offres: selectOffres(),
  commandeContenus: selectCommandeContenus(),
  produitsById: selectProduits(),
  balance: selectMontantBalance(),
  livraisons: selectCommandeLivraisons(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    load: (commandeUtilisateur) => dispatch(load(commandeUtilisateur)),
    ajouter: (commandeId, offre) => dispatch(ajouter(commandeId, offre)),
    augmenter: (commandeId, offreId) => dispatch(augmenter(commandeId, offreId)),
    diminuer: (commandeId, offreId) => dispatch(diminuer(commandeId, offreId)),
    supprimer: (offreId) => dispatch(supprimer(offreId)),
    sauvegarder: (datas) => dispatch(sauvegarder(datas)),
    annuler: (id, commandeId) => dispatch(annuler(id, commandeId)),
    setDistibution: (commandeId, livraisonId, plageHoraire) => dispatch(setDistibution(commandeId, livraisonId, plageHoraire)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderValidate);
