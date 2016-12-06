import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
import { selectCommandeCommandeUtilisateurs } from 'containers/Commande/selectors';
import { fetchUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';
import DetailsParFournisseur from './DetailsParFournisseur';
import { selectPending } from 'containers/App/selectors';
const SelectableList = makeSelectable(List);
import capitalize from 'lodash.capitalize';


import DetailsParUtilisateur from './DetailsParUtilisateur';

const getIcon = (cu) => {
  let color = 'green';
  if (!cu.datePaiement && !cu.dateLivraison) {
    color = 'red';
  } else if (!cu.dateLivraison) {
    color = 'orange';
  }

  return <PastilleIcon color={color} />;
};


class AdminDetailsCommande extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    commandeUtilisateurs: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    const { commandeUtilisateurs, utilisateurs } = this.props;
    this.props.loadUtilisateurs(
      commandeUtilisateurs
        .filter((cu) => !utilisateurs[cu.utilisateurId]) // ne pas charger ceux déjà chargés
        .map((cu) => cu.utilisateurId)
    );
  }

  render() {
    const { pending, commandeUtilisateurs, params, utilisateurs, children, pushState } = this.props;
    return (
      <div className="row">
        <div className="col-md-3">
          {!pending &&
            (<SelectableList value={location.pathname}>
              {commandeUtilisateurs.map((cu, idx) => {
                const ut = utilisateurs.find((u) => u.id === cu.utilisateurId);
                if (!ut) return null;
                return (
                  <ListItem
                    key={idx}
                    primaryText={`${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}`}
                    value={`/admin/relais/${params.relaiId}/commandes/${cu.commandeId}/utilisateurs/${cu.utilisateurId}`}
                    onClick={() => pushState(`/admin/relais/${params.relaiId}/commandes/${cu.commandeId}/utilisateurs/${cu.utilisateurId}`)}
                    leftIcon={getIcon(cu)}
                  />
                );
              }
              )}
            </SelectableList>
            )
          }
        </div>
        <div className="col-md-9">
          {!children && <DetailsParFournisseur params={params} commandeUtilisateurs={commandeUtilisateurs} />}
          {children && (
            <DetailsParUtilisateur
              params={params}
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
  utilisateurs: selectUtilisateurs(),
});

const mapDispatchToProps = (dispatch) => ({
  loadUtilisateurs: (ids) => dispatch(fetchUtilisateurs(ids)),
  pushState: (url) => dispatch(push(url)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminDetailsCommande);
