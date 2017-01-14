import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
import WalletIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import DoneIcon from 'material-ui/svg-icons/action/done';
import round from 'lodash/round';
import api from 'utils/stellarApi';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import DepotRelais from 'containers/DepotRelais';
import styles from './styles.css';
const SelectableList = makeSelectable(List);

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
    depot: false,
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

  findDepot = (utilisateurId) =>
    this.props.depots.find((d) =>
      d.utilisateurId === utilisateurId &&
      !d.transfertEffectue &&
      d.type === 'depot_relais'
    );

  handleClose = () => this.setState({ ...this.state, depot: false })

  handleDepotExpress = () => this.setState({ ...this.state, depot: false })

  handleDepotRelais = () => this.setState({ ...this.state, depot: false })

  computeDatas = (utilisateurId) => {
    const { utilisateurs } = this.props;
    const { paiements, totaux } = this.state;

    const ut = utilisateurs.find((u) => u.id === utilisateurId);
    const dep = this.findDepot(utilisateurId);
    // si un dépot a été fait, en tenir compte
    const depot = dep && dep.montant ? parseFloat(dep.montant) : 0;

    let iconColor = 'silver';
    if (paiements[ut.id]) {
      iconColor = totaux[ut.id] <= round(depot + parseFloat(paiements[ut.id].balance), 2)
        ? 'green'
        : 'orange';
    }

    return {
      dep,
      iconColor,
    };
  }

  render() {
    const { commandeUtilisateurs, onChange, params, utilisateurs } = this.props;
    const { paiements, totaux } = this.state;
    const depot = params.utilisateurId ? this.findDepot(params.utilisateurId) : null;
    return (
      <div className="row">
        <div className={`col-md-6 col-md-offset-3 ${styles.depot}`}>
          {!depot && params.utilisateurId &&
            <RaisedButton
              primary
              fullWidth
              label="Deposer des fonds"
              onClick={() => this.setState({ ...this.state, depot: true })}
            />
          }
          {!params.utilisateurId && <span style={{ color: 'black' }}>Acheteurs</span>}
          {depot && `Dépot : ${parseFloat(depot.montant).toFixed(2)} €`}
          {!depot && totaux[params.utilisateurId] && paiements[params.utilisateurId] &&
            <DepotRelais
              utilisateurId={params.utilisateurId}
              balance={paiements[params.utilisateurId]}
              totalCommande={totaux[params.utilisateurId].toFixed(2)}
              relaiId={params.relaiId}
              depot={depot}
              open={this.state.depot}
              onRequestClose={this.handleClose}
            />
          }
        </div>
        <div className="col-md-12">
          <SelectableList value={params.utilisateurId} onChange={onChange}>
            {
              commandeUtilisateurs
                .map((cu) => ({ ...cu, utilisateur: utilisateurs.find((u) => u.id === cu.utilisateurId) }))
                .filter((cu) => cu.commandeId === params.commandeId && cu.utilisateur && cu.utilisateur.nom)
                .sort((cu1, cu2) => cu1.utilisateur.nom > cu2.utilisateur.nom)
                .map((cu, idx) => {
                  const datas = this.computeDatas(cu.utilisateurId);
                  return (
                    <ListItem
                      key={idx}
                      primaryText={`${cu.utilisateur.nom.toUpperCase()} ${capitalize(cu.utilisateur.prenom)}`}
                      value={cu.utilisateurId}
                      leftIcon={
                        cu.dateLivraison
                        ? <DoneIcon color="green" />
                        : <PastilleIcon color={datas.iconColor} />
                      }
                      rightIcon={datas.dep && <WalletIcon />}
                    />
                  );
                })
            }
          </SelectableList>
        </div>
      </div>
    );
  }
}

export default connect()(ListeAcheteurs);
