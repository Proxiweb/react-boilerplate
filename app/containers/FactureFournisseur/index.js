/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';

import {
  makeSelectCommandeCommandeUtilisateurs,
  makeSelectCommandeCommandeContenus,
  makeSelectCommandeContenus,
  makeSelectOffres,
  makeSelectFournisseurs,
  makeSelectProduits,
  makeSelectCommande,
  makeSelectUtilisateurs
} from 'containers/Commande/selectors';

import {
  loadFournisseurs,
  fetchUtilisateurs
} from 'containers/Commande/actions';

import { makeSelectPending } from 'containers/App/selectors';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import Adresse from './components/Adresse';
import { format } from 'utils/dates';
import classnames from 'classnames';

import styles from './styles.css';

class FactureFournisseur extends Component {
  // eslint-disable-line
  static propTypes = {
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    commande: PropTypes.object.isRequired,
    contenus: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    fournisseurs: PropTypes.object.isRequired,
    loadU: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired
  };

  componentDidMount() {
    const {
      commandeUtilisateurs,
      utilisateurs,
      fournisseurs,
      loadU,
      loadF,
      params
    } = this.props;
    const { fournisseurId } = params;
    const utilisateursIds = commandeUtilisateurs
      .filter(cu => !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
      .map(cu => cu.utilisateurId);

    loadU(utilisateursIds);

    if (!fournisseurs[fournisseurId]) {
      loadF({ fournisseurId });
    }
  }

  buildProducts = utilisateurId => {
    const {
      commandeContenus: cc,
      contenus: c,
      offres,
      produits,
      params
    } = this.props;
    const commandeContenus = cc.map(id => c[id]);
    const contenus = commandeContenus.filter(
      cC => cC.utilisateurId === utilisateurId
    );
    const { commandeId } = params;
    const totaux = calculeTotauxCommande({
      commandeContenus,
      offres,
      commandeId,
      filter: cc => cc.utilisateurId === utilisateurId
    });
    if (!contenus.length) return null;

    const rows = contenus.map((contenu, idx) => {
      const qteTotalOffre = commandeContenus
        .filter(cont => cont.offreId === contenu.offreId)
        .reduce((memo, cont) => memo + cont.quantite + cont.qteRegul, 0);
      const offre = offres[contenu.offreId];
      const tarif = trouveTarification(offre.tarifications, qteTotalOffre, 0);

      const tarifEnBaisse =
        offres[contenu.offreId].tarifications[0].prix > tarif.prix;

      return (
        <tr className={styles.item} key={idx}>
          <td>
            {produits[offre.produitId].nom.toUpperCase()} {offre.description}
          </td>
          <td className={styles.center}>{contenu.quantite}</td>
          <td className={styles.center}>
            {parseFloat(round(tarif.prix / 100 / 1.055, 2)).toFixed(2)}
            {tarifEnBaisse &&
              <span style={{ color: 'red' }}>
                {' '}
                <s>
                  {parseFloat(
                    round(offre.tarifications[0].prix / 100 / 1.055, 2)
                  ).toFixed(2)}
                </s>
              </span>}
          </td>
          <td className={styles.totaux}>
            {parseFloat(round(tarif.prix / 100, 2)).toFixed(2)} €
          </td>
        </tr>
      );
    });

    rows.push(
      <tr className={styles.total} key={contenus.length + 1}>
        <td />
        <td />
        <td />
        <td className={styles.right}>
          Total: {parseFloat(totaux.prix).toFixed(2)} €
        </td>
      </tr>
    );

    return rows;
  };

  render() {
    const {
      commandeUtilisateurs,
      commande,
      utilisateurs,
      fournisseurs,
      params
    } = this.props;

    const fournisseur = fournisseurs.find(f => f.id === params.fournisseurId);
    const utils = utilisateurs
      ? Object.keys(utilisateurs).map(id => utilisateurs[id])
      : null;

    return (
      <div className={classnames(styles.page, styles.invoiceBox)}>
        {commandeUtilisateurs.map((cu, idx) => {
          const contenusCommande = this.buildProducts(cu.utilisateurId);
          if (!contenusCommande) return null;
          return (
            <table cellPadding="0" cellSpacing="0" key={idx}>
              <tr className={styles.top}>
                <td colSpan="4">
                  <table>
                    <tr>
                      <td className={styles.title}>
                        <h3>
                          Facture Proxiweb <small>{cu.commandeId}_{idx}</small>
                        </h3>
                      </td>

                      <td className={styles.title}>
                        <h3>{format(commande.dateCommande, 'DD MM')}</h3>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className={styles.information}>
                <td colSpan="4">
                  <table>
                    <tr>
                      <td>
                        {fournisseur &&
                          <Adresse label="Fournisseur" datas={fournisseur} />}
                      </td>
                      <td>
                        <Adresse
                          label="Client"
                          datas={utils.find(u => u.id === cu.utilisateurId)}
                        />
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
                  Prix TTC
                </td>
              </tr>
              {contenusCommande}
            </table>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: makeSelectPending(),
  commande: makeSelectCommande(),
  commandeContenus: makeSelectCommandeCommandeContenus(),
  contenus: makeSelectCommandeContenus(),
  produits: makeSelectProduits(),
  commandeUtilisateurs: makeSelectCommandeCommandeUtilisateurs(),
  utilisateurs: makeSelectUtilisateurs(),
  fournisseurs: makeSelectFournisseurs(),
  offres: makeSelectOffres()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadU: fetchUtilisateurs,
      loadF: loadFournisseurs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FactureFournisseur);
/* eslint-enable */
