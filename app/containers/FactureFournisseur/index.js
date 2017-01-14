import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';

import {
  selectCommandeCommandeUtilisateurs,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectOffres,
  selectFournisseurs,
  selectProduits,
} from 'containers/Commande/selectors';

import {
  loadFournisseurs,
} from 'containers/Commande/actions';

import {
  selectPending,
} from 'containers/App/selectors';

import { fetchUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import { trouveTarification } from
  'containers/CommandeEdit/components/components/AffichePrix';
import Adresse from './components/Adresse';
import classnames from 'classnames';

import styles from './styles.css';

class FactureFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    utilisateurs: PropTypes.object.isRequired,
    fournisseurs: PropTypes.object.isRequired,
    loadU: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      commandeUtilisateurs,
      utilisateurs,
      fournisseurs,
      loadU,
      loadF,
      params,
    } = this.props;
    const { fournisseurId } = params;
    const utilisateursIds =
      commandeUtilisateurs
        .filter((cu) => !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
        .map((cu) => cu.utilisateurId);

    loadU(utilisateursIds);

    if (!fournisseurs[fournisseurId]) {
      loadF({ fournisseurId });
    }
  }

  buildProducts = (utilisateurId) => {
    const { commandeContenus: cc, contenus: c, offres, produits, params } = this.props;
    const commandeContenus = cc.map((id) => c[id]);
    const contenus = commandeContenus.filter((cC) => cC.utilisateurId === utilisateurId);
    const { commandeId } = params;
    const totaux = calculeTotauxCommande({
      contenus,
      commandeContenus,
      offres,
      commandeId,
    });

    const rows =
      contenus
        .map((contenu) => {
          const qteTotalOffre =
            commandeContenus
              .filter((cont) =>
                cont.offreId === contenu.offreId
              )
              .reduce((memo, cont) =>
                memo + cont.quantite + cont.qteRegul
              , 0);

          const tarif = trouveTarification(
            offres[contenu.offreId].tarifications,
            qteTotalOffre,
            contenu.quantite
          );

          return (<tr className={styles.item}>
            <td>{produits[offres[contenu.offreId].produitId].description}</td>
            <td>{contenu.quantite}</td>
            <td>{parseFloat(round(tarif.prix / 100 / 1.055, 2)).toFixed(2)}</td>
            <td>{parseFloat(round(tarif.prix / 100, 2)).toFixed(2)} €</td>
          </tr>);
        }
      );

      rows.push(
        <tr className={styles.total}>
            <td />
            <td />
            <td />
            <td>
               Total: {parseFloat(totaux.prix).toFixed(2)} €
            </td>
        </tr>
      );

      return rows;
  }

  render() {
    const {
      commandeUtilisateurs,
      utilisateurs,
      fournisseurs,
      params,
    } = this.props;

    const fournisseur = fournisseurs.find((f) => f.id === params.fournisseurId);

    return (
      <div className={classnames(styles.page, styles.invoiceBox)}>
        <ul>
          {
            commandeUtilisateurs
              .map((cu, idx) =>
              <table cellPadding="0" cellSpacing="0">
                  <tr class="top">
                      <td colSpan="4">
                          <table>
                              <tr>
                                  <td className={styles.title}>
                                      <h3>Facture Proxiweb <small>{cu.commandeId}_{idx}</small></h3>
                                  </td>

                                  <td>
                                      Created: January 1, 2015<br />
                                      Due: February 1, 2015
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
                                    {
                                      fournisseur &&
                                        <Adresse
                                          label="Fournisseur"
                                          datas={fournisseur}
                                        />
                                    }
                                  </td>
                                  <td />
                                  <td />
                                  <td>
                                    <Adresse
                                      label="Client"
                                      datas={utilisateurs.find((u) =>
                                        u.id === cu.utilisateurId
                                      )}
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
                      <td>
                          Quantité
                      </td>
                      <td>
                          Prix unitaire HT
                      </td>
                      <td>
                          Prix TTC
                      </td>
                  </tr>
                  {this.buildProducts(cu.utilisateurId)}
              </table>
              )
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  commandeContenus: selectCommandeCommandeContenus(),
  contenus: selectCommandeContenus(),
  produits: selectProduits(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  utilisateurs: selectUtilisateurs(),
  fournisseurs: selectFournisseurs(),
  offres: selectOffres(),
});

const mapDispatchToProps = (dispatch) => ({
  loadU: (ids) => dispatch(fetchUtilisateurs(ids)),
  loadF: (query) => dispatch(loadFournisseurs(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactureFournisseur);
