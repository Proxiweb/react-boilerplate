import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeUtilisateurs,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectOffres,
  selectCommandeId,
  selectUtilisateurs,
} from 'containers/Commande/selectors';

import { fetchUtilisateurs } from 'containers/Commande/actions';

import { selectDepots } from 'containers/AdminDepot/selectors';
import { loadDepotsRelais } from 'containers/AdminDepot/actions';

import { selectRoles } from 'containers/CompteUtilisateur/selectors';

import DetailsParFournisseur from './DetailsParFournisseur';
import ListeAcheteurs from './ListeAcheteurs';
import { selectPending, selectCommandes } from 'containers/App/selectors';
import DetailsParUtilisateur from './DetailsParUtilisateur';
import ValidationCommandesAdherents from './ValidationCommandesAdherents';
import FinalisationCommande from './FinalisationCommande';

import styles from './styles.css';

class AdminDetailsCommande extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    commandes: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    children: PropTypes.node,
    depots: PropTypes.array,
    utilisateurs: PropTypes.array.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadDepots: PropTypes.func.isRequired,
  };

  state = {
    view: 'fournisseurs', // ou validation
  };

  componentDidMount() {
    this.loadUtilisateursCommande();
    this.props.loadDepots(this.props.params.relaiId);
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.params.commandeId !== this.props.params.commandeId) {
      this.loadUtilisateursCommande();
    }
  };

  loadUtilisateursCommande = () => {
    const { commandeUtilisateurs, utilisateurs } = this.props;
    const utilisateursIds = commandeUtilisateurs
      .filter(cu => !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
      .map(cu => cu.utilisateurId);

    this.props.loadUtilisateurs(utilisateursIds);
  };

  handleChangeList = value => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs/${value}`);
  };

  render() {
    const {
      pending,
      commandeUtilisateurs,
      commandeContenus,
      commandes,
      commandeId,
      depots,
      contenus,
      offres,
      params,
      utilisateurs,
      roles,
      children,
    } = this.props;
    const commande = commandes[commandeId];
    const utils = utilisateurs ? Object.keys(utilisateurs).map(id => utilisateurs[id]) : null;
    const { view } = this.state;
    return (
      <div className="row">
        <Helmet title={`Commande ${commande.id}`} />
        <div className={`col-md-4 ${styles.listeAcheteursContainer}`}>
          {commandeUtilisateurs &&
            contenus &&
            utils &&
            utils.length > 0 &&
            depots &&
            offres &&
            <ListeAcheteurs
              commandeUtilisateurs={commandeUtilisateurs}
              commandeContenus={contenus}
              utilisateurs={utils}
              distributions={commande.distributions}
              depots={depots}
              offres={offres}
              params={params}
              roles={roles}
              onChange={this.handleChangeList}
            />}
        </div>
        <div className="col-md-8">
          {!children &&
            commandeUtilisateurs &&
            contenus &&
            utils &&
            view === 'fournisseurs' &&
            <DetailsParFournisseur
              params={params}
              commandeUtilisateurs={commandeUtilisateurs}
              utilisateurs={utils}
              commandeContenus={contenus}
              handleValidate={() => this.setState({ view: 'validation' })}
              finalisation={commande.finalisation}
            />}
          {!children &&
            commandeUtilisateurs &&
            commandeUtilisateurs.filter(cu => cu.datePaiement).length < commandeUtilisateurs.length &&
            contenus &&
            !commande.validation &&
            view === 'validation' &&
            <ValidationCommandesAdherents
              params={params}
              commandeUtilisateurs={commandeUtilisateurs}
              contenus={contenus}
              utilisateurs={utils}
              commandeContenus={commandeContenus}
            />}
          {!children &&
            commandeUtilisateurs &&
            commandeUtilisateurs.filter(cu => cu.datePaiement).length === commandeUtilisateurs.length &&
            contenus &&
            view === 'validation' &&
            !commande.finalisation &&
            <FinalisationCommande params={params} contenus={contenus} commandeContenus={commandeContenus} />}
          {children &&
            utils &&
            <DetailsParUtilisateur
              params={params}
              commande={commande}
              commandeUtilisateur={commandeUtilisateurs.find(cu => cu.utilisateurId === params.utilisateurId)}
              roles={roles}
              depots={depots}
              utilisateur={utils.find(ut => ut.id === params.utilisateurId)}
            />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  utilisateurs: selectUtilisateurs(),
  commandeId: selectCommandeId(),
  depots: selectDepots(),
  roles: selectRoles(),
  offres: selectOffres(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadUtilisateurs: fetchUtilisateurs,
      loadDepots: loadDepotsRelais,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AdminDetailsCommande);
