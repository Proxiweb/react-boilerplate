import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { selectCommandeCommandeUtilisateurs } from 'containers/Commande/selectors';
import { fetchUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { selectUtilisateurDomain } from 'containers/AdminUtilisateurs/selectors';
import { selectPending } from 'containers/App/selectors';
const SelectableList = makeSelectable(List);
import capitalize from 'lodash.capitalize';

class AdminDetailsCommande extends Component {
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.loadUtilisateurs(this.props.commandeUtilisateurs.map((cu) => cu.utilisateurId));
  }

  render() {
    const { pending, commandeUtilisateurs, params, utilisateurs } = this.props;

    return (
      <div className="row">
        <div className="col-m-3">
          {!pending &&
            (<SelectableList value={location.pathname}>
              {commandeUtilisateurs.map((cu, idx) => {
                const ut = utilisateurs.datas.find((u) => u.id === cu.utilisateurId);
                return (
                  <ListItem
                    key={idx}
                    primaryText={`${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}`}
                    value={`/admin/relais/${params.relaiId}/commandes/${cu.id}`}
                  />
                );
              }
              )}
            </SelectableList>
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  utilisateurs: selectUtilisateurDomain(),
});

const mapDispatchToProps = (dispatch) => ({
  loadUtilisateurs: (ids) => dispatch(fetchUtilisateurs(ids)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminDetailsCommande);
