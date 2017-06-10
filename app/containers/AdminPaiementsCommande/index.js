import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
import WalletIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import api from 'utils/stellarApi';

import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectOffres,
  selectCommandeCommandeUtilisateurs,
} from 'containers/Commande/selectors';

import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import round from 'lodash/round';
import styles from './styles.css';
import classnames from 'classnames';
import capitalize from 'lodash/capitalize';

const SelectableList = makeSelectable(List);

import DepotRelais from 'containers/DepotRelais';
import { selectDepots } from 'containers/AdminDepot/selectors';
import { loadDepotsRelais } from 'containers/AdminDepot/actions';
import ValidationCommande from './components/ValidationCommande';

class PaiementsCommande extends Component {
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    depots: PropTypes.array,
    offres: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
  };

  state = {
    paiements: {},
    totaux: {},
    utilisateurSelected: null,
    error: false,
  };

  componentDidMount() {
    const { utilisateurs, commandeUtilisateurs, params } = this.props;
    commandeUtilisateurs.forEach(cu => {
      const ut = utilisateurs.find(u => u.id === cu.utilisateurId);
      this.loadAccount(cu.utilisateurId, ut.stellarKeys.adresse);
    });
    this.props.load(params.relaiId);
  }

  loadAccount(id, accountId) {
    const contenus = Object.keys(this.props.contenus).map(k => this.props.contenus[k]);
    const { params, commandeContenus, offres } = this.props;

    const { commandeId } = params;

    api
      .loadAccount(accountId)
      .then(res => {
        const bal = res.balances.find(b => b.asset_code === 'PROXI');
        const totaux = calculeTotauxCommande({
          utilisateurId: c.utilisateurId,
          offres,
          commandeContenus,
          commandeId,
        });
        this.setState({
          ...this.state,
          paiements: {
            ...this.state.paiements,
            [id]: bal,
          },
          totaux: {
            ...this.state.totaux,
            [id]: round(totaux.prix + totaux.recolteFond, 2),
          },
        });
      })
      .catch(() => {
        this.setState({ ...this.state, error: true });
      });
  }

  handleChangeList = (event, value) =>
    this.setState({
      ...this.state,
      utilisateurSelected: value,
    });

  render() {
    const { commandeUtilisateurs, utilisateurs, params, depots } = this.props;

    const { paiements, totaux, utilisateurSelected, error } = this.state;

    if (error) {
      return (
        <div className="col-md-12">
          <h1>{"Les comptes n'ont pu être chargé veuillez réessayer ultérieurement"}</h1>
        </div>
      );
    }
    return (
      <div className={classnames('col-md-12', styles.panel)}>
        {depots &&
          Object.keys(paiements).length === commandeUtilisateurs.length &&
          <div className="row">
            <div className="col-md-12">
              <ValidationCommande
                paiements={paiements}
                totaux={totaux}
                depots={depots}
                commandeUtilisateurs={commandeUtilisateurs}
              />
            </div>
            <div className="col-md-4 col-md-offset-2">
              <SelectableList value={utilisateurSelected} onChange={this.handleChangeList}>
                {commandeUtilisateurs.filter(cu => cu.commandeId === params.commandeId).map((cu, idx) => {
                  const ut = utilisateurs.find(u => u.id === cu.utilisateurId);
                  const dep = depots.find(
                    d =>
                      d.utilisateurId === cu.utilisateurId &&
                      !d.transfertEffectue &&
                      d.type === 'depot_relais'
                  );
                  // si un dépot a été fait, en tenir compte
                  const totalAvecDepot = dep && dep.montant
                    ? round(parseFloat(dep.montant) + parseFloat(paiements[ut.id].balance), 2)
                    : round(parseFloat(paiements[ut.id].balance), 2);

                  let iconColor = 'silver';
                  if (paiements[ut.id]) {
                    iconColor = totaux[ut.id] <= totalAvecDepot ? 'green' : 'orange';
                  }
                  return (
                    <ListItem
                      key={idx}
                      primaryText={`${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}
                           ${totaux[ut.id] ? ` - ${totaux[ut.id].toFixed(2)} €` : ''}
                          `}
                      value={ut.id}
                      leftIcon={cu.datePaiement ? null : <PastilleIcon color={iconColor} />}
                      rightIcon={dep && <WalletIcon />}
                    />
                  );
                })}
              </SelectableList>
            </div>
            <div className="col-md-4">
              {utilisateurSelected &&
                <DepotRelais
                  utilisateurId={utilisateurSelected}
                  balance={paiements[utilisateurSelected]}
                  totalCommande={totaux[utilisateurSelected].toFixed(2)}
                  relaiId={params.relaiId}
                  depot={depots.find(
                    d =>
                      d.utilisateurId === utilisateurSelected &&
                      !d.transfertEffectue &&
                      d.type === 'depot_relais'
                  )}
                />}
            </div>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  utilisateurs: selectUtilisateurs(),
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  offres: selectOffres(),
  depots: selectDepots(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadDepotsRelais,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PaiementsCommande);
