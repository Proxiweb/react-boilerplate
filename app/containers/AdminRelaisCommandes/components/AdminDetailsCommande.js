import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectCommandeCommandeUtilisateurs,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectOffres,
} from 'containers/Commande/selectors';

import { fetchUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';

import { selectDepots } from 'containers/AdminDepot/selectors';
import { loadDepotsRelais } from 'containers/AdminDepot/actions';

import { selectRoles } from 'containers/CompteUtilisateur/selectors';

import DetailsParFournisseur from './DetailsParFournisseur';
import ListeAcheteurs from './ListeAcheteurs';
import { selectPending } from 'containers/App/selectors';
import DetailsParUtilisateur from './DetailsParUtilisateur';

class AdminDetailsCommande extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
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
  }

  componentDidMount() {
    const { commandeUtilisateurs, utilisateurs, params } = this.props;
    const utilisateursIds =
      commandeUtilisateurs
        .filter((cu) => !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
        .map((cu) => cu.utilisateurId);

    this.props.loadUtilisateurs(utilisateursIds);
    this.props.loadDepots(params.relaiId);
  }

  handleChangeList = (event, value) => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs/${value}`);
  }

  render() {
    const {
      pending,
      commandeUtilisateurs,
      commandeContenus,
      commande,
      depots,
      contenus,
      offres,
      params,
      utilisateurs,
      roles,
      children,
    } = this.props;
    return (
      <div className="row">
        <div className="col-md-4">
          {!pending &&
            commandeUtilisateurs &&
            commandeContenus &&
            contenus &&
            utilisateurs.length > 0 &&
            depots &&
            offres &&
            <ListeAcheteurs
              commandeUtilisateurs={commandeUtilisateurs}
              commandeContenus={commandeContenus}
              contenus={contenus}
              utilisateurs={utilisateurs}
              depots={depots}
              offres={offres}
              params={params}
              roles={roles}
              onChange={this.handleChangeList}
            />
          }
        </div>
        <div className="col-md-8">
          {!children && <DetailsParFournisseur params={params} commandeUtilisateurs={commandeUtilisateurs} />}
          {children && (
            <DetailsParUtilisateur
              params={params}
              commande={commande}
              commandeUtilisateur={commandeUtilisateurs.find((cu) => cu.utilisateurId === params.utilisateurId)}
              utilisateur={utilisateurs.find((ut) => ut.id === params.utilisateurId)}
            />)}
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
  depots: selectDepots(),
  roles: selectRoles(),
  offres: selectOffres(),
});

const mapDispatchToProps = (dispatch) => ({
  loadUtilisateurs: (ids) => dispatch(fetchUtilisateurs(ids)),
  loadDepots: (relaiId) => dispatch(loadDepotsRelais(relaiId)),
  pushState: (url) => dispatch(push(url)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminDetailsCommande);
