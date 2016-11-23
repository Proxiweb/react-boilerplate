import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import assign from 'lodash/assign';

import DetailCommande from 'components/DetailCommande';
import LivraisonSelector from 'components/LivraisonSelector';
import DistributionSelected from 'components/DistributionSelected';
import styles from './styles.css';

export default class OrderValidate extends Component {
  static propTypes = {
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    produitsById: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    sauvegarder: PropTypes.func.isRequired,
    annuler: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
    setDistibution: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { view: 'panier' };
    this.testLivraisons = [
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
    this.selectionnePlageHoraire = this.selectionnePlageHoraire.bind(this);
    this.showValidate = this.showValidate.bind(this);
    this.showDetailsCommande = this.showDetailsCommande.bind(this);
    this.showDistribSelected = this.showDistribSelected.bind(this);
    this.showLivraisonSelector = this.showLivraisonSelector.bind(this);
    this.showDistribButton = this.showDistribButton.bind(this);
    this.showCancel = this.showCancel.bind(this);
  }

  selectionnePlageHoraire(plageHoraire, livraisonId) {
    this.props.setDistibution(plageHoraire, livraisonId);
    this.setState({ view: 'panier' });
  }

  showValidate() {
    const { commande, sauvegarder, commandeId, utilisateurId } = this.props;
    return (
      <div className={styles.validation}>
        <RaisedButton
          label="Valider la commande"
          style={{ marginTop: 20 }}
          primary
          onClick={() => sauvegarder(assign(commande, { commandeId, utilisateurId }))}
        />
      </div>
    );
  }

  showDistribSelected() {
    const { commande } = this.props;

    return (
      <div className={styles.distributionSelected}>
        <DistributionSelected
          livraison={this.testLivraisons.find((liv) => liv.id === commande.livraisonId)}
          noPlageHoraire={commande.plageHoraire}
          className={styles.distriItem}
        />
        <RaisedButton
          label="Modifier"
          onClick={() => this.setState({ view: 'distribution' })}
          className={styles.distriButton}
        />
      </div>
    );
  }

  showDistribButton() {
    return (
      <RaisedButton
        label="Choisissez le jour de distribution"
        style={{ marginTop: 20 }}
        onClick={() => this.setState({ view: 'distribution' })}
      />
    );
  }

  showDetailsCommande() {
    const { offres, commande, produitsById, supprimer } = this.props;
    return (<DetailCommande
      contenus={commande.contenus}
      montant={commande.montant.toFixed(2)}
      recolteFond={commande.recolteFond.toFixed(2)}
      offres={offres}
      produits={produitsById}
      supprimer={supprimer}
      readOnly={typeof commande.id !== 'undefined'}
    />);
  }

  showLivraisonSelector() {
    const { commande } = this.props;
    return (<LivraisonSelector
      livraisons={this.testLivraisons}
      plageHoraire={commande.plageHoraire}
      livraisonId={commande.livraisonId}
      selectionnePlageHoraire={this.selectionnePlageHoraire}
    />);
  }

  showCancel() {
    const { commande } = this.props;
    return (
      <RaisedButton
        label="Annuler la commande"
        secondary
        style={{ marginTop: 20 }}
        onClick={() => this.props.annuler(commande.id)}
      />
    );
  }

  render() {
    const { commande } = this.props;
    const { view } = this.state;

    return (<div>
      { view === 'distribution' ? this.showLivraisonSelector() : this.showDetailsCommande() }
      { view === 'panier' && commande.livraisonId && this.showDistribSelected() }
      {!commande.livraisonId && commande.contenus.length > 0 && this.showDistribButton()}
      {commande.livraisonId && !commande.id && this.showValidate()}
      {!commande.dateLivraison && commande.id && this.showCancel()}
    </div>);
  }
}
