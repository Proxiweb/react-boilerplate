import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { format } from 'utils/dates';
import capitalize from 'lodash/capitalize';
import round from 'lodash/round';
import classnames from 'classnames';

import {
  selectOffres,
  selectProduits,
  selectCommande,
  selectUtilisateurs,
} from 'containers/Commande/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

import { fetchUtilisateurs } from 'containers/Commande/actions';

import { makeSelectPending } from 'containers/App/selectors';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';

import Adresse from './Adresse';
import styles from './styles.css';

class FactureDistributeur extends Component {
  // eslint-disable-line
  static propTypes = {
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    commande: PropTypes.object.isRequired,
    produits: PropTypes.object.isRequired,
    utilisateurs: PropTypes.object,
    loadU: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.loadAcheteurs();
  }

  componentWillReceiveProps(nextProps) {
    const { commandeUtilisateurs: thisCu } = this.props;
    const { commandeUtilisateurs: nextCu } = nextProps;
    if (nextCu && thisCu[0].id !== nextCu[0].id) {
      this.loadAcheteurs();
    }
  }

  loadAcheteurs() {
    const { commandeUtilisateurs, utilisateurs, loadU } = this.props;
    const utilisateursIds = commandeUtilisateurs
      .filter(cu => !utilisateurs || !Object.keys(utilisateurs)[cu.utilisateurId]) // ne pas charger ceux déjà chargés
      .map(cu => cu.utilisateurId);
    loadU(utilisateursIds);
  }

  buildCommandeUtilisateurRow = (utilisateurId, idx) => {
    const { commandeContenus, offres, utilisateurs, params } = this.props;
    if (!Object.keys(commandeContenus).length) return null;

    const { commandeId } = params;

    const totaux = calculeTotauxCommande({
      commandeContenus,
      offres,
      commandeId,
      filter: cc => cc.utilisateurId === utilisateurId,
    });

    return (
      <tr className={styles.item} key={idx}>
        <td>
          {utilisateurs[utilisateurId].nom.toUpperCase()}
          {' '}
          {capitalize(utilisateurs[utilisateurId].prenom)}
        </td>
        <td style={{ textAlign: 'right' }}>
          {parseFloat(totaux.recolteFond).toFixed(2)} €
        </td>
      </tr>
    );
    // });

    // return rows;
  };

  split = str => str.split('-')[0];

  render() {
    const { commandeUtilisateurs, commandeContenus, commande, offres, utilisateurs, auth } = this.props;

    if (!commande || !commandeUtilisateurs || !commandeContenus || !utilisateurs) {
      return null;
    }

    const totaux = calculeTotauxCommande({
      commandeContenus,
      offres,
      commandeId: commande.id,
    });

    return (
      <div className={classnames(styles.page, styles.invoiceBox)}>
        <table cellPadding="0" cellSpacing="0">
          <tbody>
            <tr className={styles.top}>
              <td colSpan="4">
                <table>
                  <tr>
                    <td
                      style={{
                        fontSize: '20px',
                        lineHeight: '20px',
                        color: '#333',
                      }}
                    >
                      <h3 className="factureTitle">
                        Facture Proxiweb{' '}
                        <small>
                          {this.split(commande.id)}
                          -
                          {this.split(auth.id)}
                        </small>
                      </h3>
                    </td>

                    <td
                      style={{
                        fontSize: '20px',
                        lineHeight: '20px',
                        color: '#333',
                      }}
                    >
                      <h3 className="factureTitle">
                        {format(commande.dateCommande, 'DD MM')}
                      </h3>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className={styles.information}>
              <td>
                <table>
                  <tr>
                    <td>
                      <Adresse label="Distributeur" datas={auth} />
                    </td>
                    <td />
                  </tr>
                </table>
              </td>
            </tr>

            <tr className={styles.heading}>
              <td>
                Adhérents
              </td>
              <td className={styles.center}>
                Prestation distribution HT
              </td>
            </tr>
            {commandeUtilisateurs.map((cu, idx) => this.buildCommandeUtilisateurRow(cu.utilisateurId, idx))}
            <tr>
              <td colSpan="2" style={{ textAlign: 'right' }}>
                Total: <strong>{totaux.recolteFond} €</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                {'T.V.A. non applicable. Article 293B du code général des impôts.'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: makeSelectPending(),
  commande: selectCommande(),
  produits: selectProduits(),
  utilisateurs: selectUtilisateurs(),
  auth: selectCompteUtilisateur(),
  offres: selectOffres(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadU: fetchUtilisateurs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FactureDistributeur);
