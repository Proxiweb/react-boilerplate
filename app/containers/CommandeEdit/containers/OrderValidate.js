import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
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
} from 'containers/CommandeEdit/actions';

import { selectCommande } from 'containers/CommandeEdit/selectors';

import {
  selectCommande as selectCommandeProxiweb,
  selectCommandeContenus,
  selectOffres,
  selectProduits,
  selectCommandeLivraisons,
} from 'containers/Commande/selectors';

import { selectPending } from 'containers/App/selectors';

// import { selectMontantBalance } from 'containers/CompteUtilisateur/selectors';

import styles from './OrderValidate.css';

const constStyles = {
  margin20: {
    marginTop: 20,
  },
  margin40: {
    marginTop: 40,
  },
  minWidth: {
    minWidth: 44,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
};

class OrderValidate extends Component {
  static propTypes = {
    produitsById: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    livraisons: PropTypes.array.isRequired,
    commandeProxiweb: PropTypes.object.isRequired,
    balance: PropTypes.number,
    panierExpanded: PropTypes.bool.isRequired,

    sauvegarder: PropTypes.func.isRequired,
    annuler: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    augmenter: PropTypes.func.isRequired,
    diminuer: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    view: 'panier',
  };

  selectionnePlageHoraire = (plageHoraire, livraisonId) => {
    this.props.setDistibution(this.props.params.commandeId, plageHoraire, livraisonId);
    this.setState({ view: 'panier' });
  };

  showValidate = () => {
    const { commande, params, utilisateurId, pending } = this.props;
    const { commandeId } = params;
    const { palette } = this.context.muiTheme;
    let label = null;
    if (commande.modifiee) {
      label = pending ? 'Sauvegarde des modifications...' : 'Sauvegarder mes modifications';
    } else {
      label = pending ? 'Validation de la commande...' : 'Valider la commande';
    }
    return (
      <div className={styles.validation}>
        <RaisedButton
          label={label}
          style={constStyles.margin20}
          labelColor={commande.modifiee ? 'black' : 'white'}
          backgroundColor={commande.modifiee ? palette.warningColor : palette.primary1Color}
          onClick={() => this.props.sauvegarder(assign(commande, { commandeId, utilisateurId }))}
        />
      </div>
    );
  };

  showDistribSelected = () => {
    const { commande, livraisons, params } = this.props;
    const livraison = livraisons.find(liv => liv.id === commande.livraisonId);
    if (!livraison) return <p>Livraison manquante</p>;
    return (
      <div className={styles.distributionSelected}>
        <DistributionSelected
          livraison={livraison}
          noPlageHoraire={commande.plageHoraire}
          className={styles.distriItem}
          params={params}
        />
        <FlatButton
          label="modifier"
          onClick={() => this.setState({ view: 'distribution' })}
          className={styles.distriButton}
          icon={<EditorIcon />}
          style={constStyles.minWidth}
        />
      </div>
    );
  };

  showDistribButton = () => (
    <RaisedButton
      label="Choisissez le jour de distribution"
      icon={<DateRangeIcon />}
      style={constStyles.margin20}
      onClick={() => this.setState({ view: 'distribution' })}
    />
  );

  showDetailsCommande = contenus => {
    const {
      offres,
      commande,
      params,
      produitsById,
      commandeContenus,
      panierExpanded,
    } = this.props;

    return (
      <DetailCommande
        contenus={contenus}
        offres={offres}
        produits={produitsById}
        supprimer={this.props.supprimer}
        augmenter={this.props.augmenter}
        diminuer={this.props.diminuer}
        readOnly={commande.datePaiement}
        commandeContenus={commandeContenus}
        commandeId={params.commandeId}
        panierExpanded={panierExpanded}
      />
    );
  };

  showLivraisonSelector = () => {
    const { commande, livraisons, params } = this.props;
    return (
      <LivraisonSelector
        livraisons={livraisons}
        plageHoraire={commande.plageHoraire}
        livraisonId={commande.livraisonId}
        selectionnePlageHoraire={this.selectionnePlageHoraire}
        params={params}
      />
    );
  };

  showCancel = () => {
    const { commande, pending } = this.props;
    return (
      <div style={constStyles.textAlignCenter}>
        <RaisedButton
          label={`${!pending ? 'Annuler ma ' : 'Annulation de la '}commande`}
          secondary
          style={constStyles.margin20}
          onClick={() => this.props.annuler(commande.id, commande.commandeId)}
          icon={<TrashIcon />}
        />
      </div>
    );
  };

  render() {
    const { commande, commandeContenus, params, offres, balance, commandeProxiweb, pending } = this.props;
    const { view } = this.state;
    const contenusCommande = commande.contenus.map(
      contenu => // quand il s'agit d'une commande depuis Bd, il n'y a que l'id -> commandeContenus[id] // quand le contenu vient d'être ajouté, contenu est un objet sans id
      typeof contenu === 'object' ? contenu : commandeContenus[contenu]
    );

    return (
      <div>
        {view === 'distribution' ? this.showLivraisonSelector() : this.showDetailsCommande(contenusCommande)}
        {view === 'panier' && commande.livraisonId && this.showDistribSelected()}
        <div style={constStyles.textAlignCenter}>
          {view !== 'distribution' &&
            commandeProxiweb.dateCommande &&
            !commande.livraisonId &&
            commande.contenus.length > 0 &&
            this.showDistribButton()}
        </div>
        {view === 'panier' &&
          (commande.livraisonId || !commandeProxiweb.dateCommande) &&
          (!commande.id || commande.modifiee) &&
          this.showValidate()}
        {view === 'panier' &&
          !commande.dateLivraison &&
          commande.id &&
          !commande.modifiee &&
          this.showCancel()}
        {commande.id &&
          balance !== null &&
          view === 'panier' &&
          <Paiement
            contenus={contenusCommande}
            commandeContenus={commandeContenus}
            commandeId={params.commandeId}
            balance={balance}
            offres={offres}
            pending={pending}
            dateLimite={moment(commandeProxiweb.dateCommande).format('LLLL')}
          />}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commande: selectCommande(), // commande courante en cours d'édition
  commandeProxiweb: selectCommandeProxiweb(),
  offres: selectOffres(),
  commandeContenus: selectCommandeContenus(),
  produitsById: selectProduits(),
  // balance: selectMontantBalance(),
  livraisons: selectCommandeLivraisons(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    ajouter,
    augmenter,
    diminuer,
    supprimer,
    sauvegarder,
    annuler,
    setDistibution,
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(OrderValidate);
