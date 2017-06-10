import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { format } from 'utils/dates';
import round from 'lodash/round';
import classnames from 'classnames';
import groupBy from 'lodash/groupBy';

import {
  selectOffres,
  selectFournisseurs,
  selectProduits,
  selectCommande,
  selectUtilisateurs,
} from 'containers/Commande/selectors';

import { loadFournisseurs, fetchUtilisateurs } from 'containers/Commande/actions';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';

import styles from './styles.css';

class CommandeFournisseur extends Component {
  // eslint-disable-line
  static propTypes = {
    pending: PropTypes.bool.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    utilisateurs: PropTypes.object,
    fournisseurs: PropTypes.array.isRequired,
    loadU: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fournisseurs, loadF, params } = this.props;
    const { fournisseurId } = params;
    this.loadAcheteurs();
    if (!fournisseurs.find(f => f.id === fournisseurId)) {
      loadF({ fournisseurId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.commande.id !== nextProps.commande.id) {
      this.loadAcheteurs();
    }
  }

  loadAcheteurs() {
    const { commandeUtilisateurs, utilisateurs, loadU } = this.props;

    const utilisateursIds = commandeUtilisateurs
      .filter(cu => !utilisateurs || !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
      .map(cu => cu.utilisateurId);

    loadU(utilisateursIds);
  }

  buildProduct = (commandeContenus, idx) => {
    const { offres, produits } = this.props;
    const offreId = commandeContenus[0].offreId;

    const qteTotal = commandeContenus.reduce((memo, cont) => memo + cont.quantite + cont.qteRegul, 0);

    const qteTotalOffreQte = commandeContenus.reduce((memo, cont) => memo + cont.quantite, 0);

    const tarif = trouveTarification(offres[offreId].tarifications, qteTotalOffreQte);

    return (
      <tr className={styles.item} key={idx}>
        <td>{produits[offres[offreId].produitId].nom.toUpperCase()}</td>
        <td className={styles.center}>{qteTotal}</td>
        <td className={styles.center}>
          {// eslint-disable-next-line
          parseFloat(round(tarif.prix / 100 / 1.055, 2)).toFixed(2)}
        </td>
        <td className={styles.totaux}>
          {// eslint-disable-next-line
          parseFloat(round(tarif.prix / 100 * qteTotal, 2)).toFixed(2)}{' '}
          €
        </td>
      </tr>
    );
  };

  split = str => str.split('-')[0];

  render() {
    const {
      pending,
      commandeUtilisateurs,
      commandeContenus,
      contenus,
      commande,
      utilisateurs,
      fournisseurs,
      produits,
      offres,
      params: { fournisseurId, commandeId },
    } = this.props;

    if (pending) {
      return <p>{'Chargements...'}</p>;
    }

    if (
      !fournisseurs ||
      !commande ||
      !commandeUtilisateurs ||
      !commandeContenus ||
      !commandeContenus.length > 0 ||
      !contenus ||
      !produits ||
      !utilisateurs
    ) {
      return null;
    }

    const commandeContenusFournisseur = commandeContenus.filter(
      id => produits[offres[contenus[id].offreId].produitId].fournisseurId === fournisseurId
    );
    const commandeContenusColl = commandeContenusFournisseur.map(id => contenus[id]);
    const contenusFournGrp = groupBy(
      commandeContenusColl.filter(
        cC => produits[offres[cC.offreId].produitId].fournisseurId === fournisseurId
      ),
      cc => cc.offreId
    );

    const totaux = commandeContenusColl
      ? calculeTotauxCommande({
          commandeContenus: contenus,
          offres,
          commandeId,
          filter: cc => produits[offres[cc.offreId].produitId].fournisseurId === fournisseurId,
        })
      : null;

    return (
      <div className={classnames(styles.page, styles.invoiceBox)}>
        <table cellPadding="0" cellSpacing="0">
          <tbody>
            <tr className={styles.top}>
              <td colSpan="4">
                <table>
                  <tr>
                    <td className={styles.title}>
                      <h3>Commande Proxiweb <small>{commandeId}</small></h3>
                    </td>
                    <td className={styles.title}>
                      <h3>{format(commande.dateCommande, 'DD MM')}</h3>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr className={styles.heading}>
              <td>
                Produit
              </td>
              <td className={styles.center}>
                Quantité
              </td>
              <td className={styles.center}>
                Prix unitaire HT
              </td>
              <td className={styles.totaux}>
                Total TTC
              </td>
            </tr>
            {Object.keys(contenusFournGrp).map((offreId, idx) =>
              this.buildProduct(contenusFournGrp[offreId], idx)
            )}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontSize: '1.2em', marginTop: '1em' }}>
          {commandeUtilisateurs.length}
          {' '}
          acheteur(s) - Total:
          {' '}
          <strong>{round(totaux.prix, 2)} €</strong>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commande: selectCommande(),
  produits: selectProduits(),
  utilisateurs: selectUtilisateurs(),
  fournisseurs: selectFournisseurs(),
  offres: selectOffres(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadU: fetchUtilisateurs,
      loadF: loadFournisseurs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CommandeFournisseur);
