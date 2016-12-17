import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import EditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import assign from 'lodash/assign';

import DetailCommande from 'components/DetailCommande';
import LivraisonSelector from './components/LivraisonSelector';
import DistributionSelected from './components/DistributionSelected';
import Paiement from './Paiement';

import styles from './OrderValidate.css';

export default class OrderValidate extends Component {
  static propTypes = {
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    produitsById: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    livraisons: PropTypes.array.isRequired,
    commandeProxiweb: PropTypes.object.isRequired,
    sauvegarder: PropTypes.func.isRequired,
    annuler: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    augmenter: PropTypes.func.isRequired,
    diminuer: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,
    balance: PropTypes.number.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { view: 'panier' };
    this.selectionnePlageHoraire = this.selectionnePlageHoraire.bind(this);
    this.showValidate = this.showValidate.bind(this);
    this.showDetailsCommande = this.showDetailsCommande.bind(this);
    this.showDistribSelected = this.showDistribSelected.bind(this);
    this.showLivraisonSelector = this.showLivraisonSelector.bind(this);
    this.showDistribButton = this.showDistribButton.bind(this);
    this.showCancel = this.showCancel.bind(this);
  }

  selectionnePlageHoraire(plageHoraire, livraisonId) {
    this.props.setDistibution(this.props.commandeId, plageHoraire, livraisonId);
    this.setState({ view: 'panier' });
  }

  showValidate() {
    const { commande, sauvegarder, commandeId, utilisateurId } = this.props;
    const { palette } = this.context.muiTheme;
    return (
      <div className={styles.validation}>
        <RaisedButton
          label={`${commande.modifiee ? 'Sauvegarder mes modifications' : 'Valider la commande'}`}
          style={{ marginTop: 20 }}
          labelColor={commande.modifiee ? 'black' : 'white'}
          backgroundColor={commande.modifiee ? palette.warningColor : palette.primary1Color}
          onClick={() => sauvegarder(assign(commande, { commandeId, utilisateurId }))}
        />
      </div>
    );
  }

  showDistribSelected() {
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

  showDistribButton() {
    return (
      <RaisedButton
        label="Choisissez le jour de distribution"
        icon={<DateRangeIcon />}
        style={{ marginTop: 20 }}
        onClick={() => this.setState({ view: 'distribution' })}
      />
    );
  }

  showDetailsCommande() {
    const { offres, commande, commandeId, produitsById, supprimer, augmenter, diminuer, commandeContenus } = this.props;
    return (
      <DetailCommande
        contenus={commande.contenus.reverse()}
        montant={commande.montant.toFixed(2)}
        recolteFond={commande.recolteFond.toFixed(2)}
        offres={offres}
        produits={produitsById}
        supprimer={supprimer}
        augmenter={augmenter}
        diminuer={diminuer}
        readOnly={commande.datePaiement}
        commandeContenus={commandeContenus}
        commandeId={commandeId}
      />
    );
  }

  showLivraisonSelector() {
    const { commande, livraisons, params } = this.props;
    return (<LivraisonSelector
      livraisons={livraisons}
      plageHoraire={commande.plageHoraire}
      livraisonId={commande.livraisonId}
      selectionnePlageHoraire={this.selectionnePlageHoraire}
      params={params}
    />);
  }

  showCancel() {
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
