import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
import round from 'lodash/round';
import api from 'utils/stellarApi';
import { calculeTotauxCommande } from 'containers/Commande/utils';

const SelectableList = makeSelectable(List);

const getIcon = (cu) => {
  let color = 'green';
  if (!cu.datePaiement && !cu.dateLivraison) {
    color = 'red';
  } else if (!cu.dateLivraison) {
    color = 'orange';
  }

  return <PastilleIcon color={color} />;
};

class ListeAcheteurs extends Component { // eslint-disable-line
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    depots: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  state = {
    paiements: {},
    totaux: {},
    utilisateurSelected: null,
    error: false,
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
      })
      .catch(() => {
        this.setState({ ...this.state, error: true });
      });
  }

  render() {
    const { commandeUtilisateurs, onChange, params, utilisateurs } = this.props;
    return (
      <SelectableList value={location.pathname} onChange={onChange}>
        {
          commandeUtilisateurs
            .filter((cu) => cu.commandeId === params.commandeId)
            .map((cu, idx) => {
              const ut = utilisateurs.find((u) => u.id === cu.utilisateurId);
              if (!ut) return null;
              return (
                <ListItem
                  key={idx}
                  primaryText={`${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}`}
                  value={`/admin/relais/${params.relaiId}/commandes/${cu.commandeId}/utilisateurs/${cu.utilisateurId}`}
                  leftIcon={getIcon(cu)}
                />
              );
            })
        }
      </SelectableList>
    );
  }
}

export default connect()(ListeAcheteurs);
