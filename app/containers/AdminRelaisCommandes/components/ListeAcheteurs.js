import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
import { selectStellarKeys } from 'containers/App/selectors';
import styles from './styles.css';
const SelectableList = makeSelectable(List);

class ListeAcheteurs extends Component {
  // eslint-disable-line
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    stellarKeys: PropTypes.object,
    params: PropTypes.object.isRequired,
    contenus: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    depots: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    paiements: {},
    totaux: {},
    utilisateurSelected: null,
    error: false,
    depot: false,
  };

  componentDidMount() {
    const { utilisateurs, commandeUtilisateurs } = this.props;
    commandeUtilisateurs.forEach(cu => {
      const ut = utilisateurs.find(u => u.id === cu.utilisateurId);
      this.loadAccount(cu.utilisateurId, ut.stellarKeys.adresse);
    });
  }

  loadAccount(id, accountId) {
    const contenus = Object.keys(this.props.contenus)
      .map(k => this.props.contenus[k]);
    const {
      params,
      commandeContenus,
      offres,
    } = this.props;

    const { commandeId } = params;

    api
      .loadAccount(accountId)
      .then(res => {
        const bal = res.balances.find(b => b.asset_code === 'PROXI');
        const totaux = calculeTotauxCommande({
          contenus: contenus.filter(
            c => c.utilisateurId === id && c.commandeId === commandeId,
          ),
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

  findDepot = utilisateurId =>
    this.props.depots.find(
      d =>
        d.utilisateurId === utilisateurId &&
          !d.transfertEffectue &&
          d.type === 'depot_relais',
    );

  handleClose = () => this.setState({ ...this.state, depot: false });

  handleDepotExpress = () => this.setState({ ...this.state, depot: false });

  handleDepotRelais = () => this.setState({ ...this.state, depot: false });

  computeDatas = utilisateurId => {
    const { utilisateurs, params: { commandeId } } = this.props;
    const { paiements, totaux } = this.state;

    const ut = utilisateurs.find(u => u.id === utilisateurId);
    const dep = this.findDepot(utilisateurId);
    // si un dépot a été fait, en tenir compte
    const depot = dep && dep.montant ? parseFloat(dep.montant) : 0;

    let iconColor = 'silver';
    if (paiements[ut.id]) {
      const totalAvecDepot = round(
        depot + parseFloat(paiements[ut.id].balance),
        2,
      );
      iconColor = totaux[ut.id] <= totalAvecDepot ? 'green' : 'orange';
    }

    return {
      dep,
      iconColor,
    };
  };

  render() {
    const {
      commandeUtilisateurs,
      onChange,
      params,
      utilisateurs,
      stellarKeys,
    } = this.props;

    const { paiements, totaux } = this.state;
    const depot = params.utilisateurId
      ? this.findDepot(params.utilisateurId)
      : null;

    const utilisateur = utilisateurs.find(u => u.id === params.utilisateurId);

    return (
      <div className="row">
        <div className={`col-md-10 col-md-offset-1 ${styles.depot}`}>
          {stellarKeys &&
            (!stellarKeys.adresse || !stellarKeys.secret) &&
            <p>Parametrez Proxiweb</p>}
          {!depot &&
            params.utilisateurId &&
            <RaisedButton
              primary
              fullWidth
              label="Deposer des fonds"
              disabled={
                stellarKeys && (!stellarKeys.adresse || !stellarKeys.secret)
              }
              onClick={() => this.setState({ ...this.state, depot: true })}
            />}
          {depot && `Dépot : ${parseFloat(depot.montant).toFixed(2)} €`}
          {!depot &&
            totaux[params.utilisateurId] &&
            paiements[params.utilisateurId] &&
            <DepotRelais
              utilisateur={utilisateur}
              balance={paiements[params.utilisateurId]}
              totalCommande={totaux[params.utilisateurId].toFixed(2)}
              relaiId={params.relaiId}
              depot={depot}
              open={this.state.depot}
              onRequestClose={this.handleClose}
              stellarKeys={stellarKeys}
              onDepotDirectSuccess={() =>
                this.loadAccount(
                  utilisateur.id,
                  utilisateur.stellarKeys.adresse,
                )}
            />}
        </div>
        <div className={`col-md-12 ${styles.listeAcheteurs}`}>
          <SelectableList value={params.utilisateurId} onChange={onChange}>
            {commandeUtilisateurs
              .filter(
                cu =>
                  cu.commandeId === params.commandeId &&
                    cu.utilisateur &&
                    cu.utilisateur.nom,
              )
              .map(cu => ({
                ...cu,
                utilisateur: utilisateurs.find(u => u.id === cu.utilisateurId),
                datas: this.computeDatas(cu.utilisateurId),
              }))
              .slice()
              .sort((cu1, cu2) => cu1.utilisateur.nom > cu2.utilisateur.nom)
              .map((cu, idx) => (
                <ListItem
                  key={idx}
                  primaryText={
                    `${cu.utilisateur.nom.toUpperCase()} ${capitalize(
                      cu.utilisateur.prenom,
                    )}`
                  }
                  value={cu.utilisateurId}
                  leftIcon={
                    cu.dateLivraison
                      ? <DoneIcon color="green" />
                      : <PastilleIcon color={cu.datas.iconColor} />
                  }
                  rightIcon={cu.datas.dep && <WalletIcon />}
                />
              ))}
          </SelectableList>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  stellarKeys: selectStellarKeys(),
});

export default connect(mapStateToProps)(ListeAcheteurs);
