import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
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

class PaiementsCommande extends Component {
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
  }

  state = {
    paiements: {},
    totaux: {},
    utilisateurSelected: null,
  }

  componentDidMount() {
    const { utilisateurs, commandeUtilisateurs } = this.props;
    commandeUtilisateurs.forEach((cu) => {
      const ut = utilisateurs.find((u) => u.id === cu.utilisateurId);
      this.loadAccount(cu.utilisateurId, ut.stellarKeys.adresse);
    });
  }

  loadAccount(id, accountId) {
    const contenus = Object
                      .keys(this.props.contenus)
                      .map((k) => this.props.contenus[k]);
    const {
      params,
      commandeContenus,
      offres,
    } = this.props;

    const { commandeId } = params;

    api
      .loadAccount(accountId)
      .then((res) => {
        const bal = res.balances.find((b) => b.asset_code === 'PROXI');
        const totaux = calculeTotauxCommande({
          contenus: contenus.filter((c) => c.utilisateurId === id),
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
      });
  }

  handleChangeList = (event, value) =>
    this.setState({
      ...this.state,
      utilisateurSelected: value,
    });

  render() {
    const {
      commandeUtilisateurs,
      utilisateurs,
      params,
    } = this.props;

    const { paiements, totaux, utilisateurSelected } = this.state;

    return (
      <div className="row">
        <div className={classnames('col-md-12', styles.panel)}>
          <div className="row">
            <div className="col-md-4 col-md-offset-1">
              <SelectableList value={utilisateurSelected} onChange={this.handleChangeList}>
                {
                  commandeUtilisateurs
                  .filter((cu) => cu.commandeId === params.commandeId)
                  .map((cu, idx) => {
                    const ut = utilisateurs.find((u) => u.id === cu.utilisateurId);
                    let iconColor = 'silver';
                    if (paiements[ut.id]) {
                      iconColor = totaux[ut.id] <= parseFloat(paiements[ut.id].balance) ? 'green' : 'orange';
                    }
                    return (
                      <ListItem
                        key={idx}
                        primaryText={
                          `${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}
                           ${totaux[ut.id] ? ` - ${totaux[ut.id].toFixed(2)} €` : ''}
                          `
                        }
                        value={ut.id}
                        leftIcon={cu.datePaiement ? null : <PastilleIcon color={iconColor} />}
                      />
                  );
                  })
                }
              </SelectableList>
            </div>
            <div className="col-md-4">
            </div>
          </div>
        </div>
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
});

export default connect(mapStateToProps)(PaiementsCommande);