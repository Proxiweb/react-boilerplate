import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
const SelectableList = makeSelectable(List);
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import { format } from 'utils/dates';
import Panel from './Panel';

import {
  loadCommandeUtilisateurs,
  loadFournisseurs,
} from 'containers/Commande/actions';

import {
  selectCommandesUtilisateurs,
  selectCommandeContenus,
  selectOffres,
  selectProduits,
} from 'containers/Commande/selectors';

class Utilisateur extends Component {
  static propTypes = {
    utilisateur: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    commandeUtilisateurs: PropTypes.object,
    commandeUtilisateurId: PropTypes.string,
    loadCommandeUtilisateurs: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  state = {
    fournisseursLoaded: {},
    utilisateursCommandesLoaded: {},
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.utilisateur.id !== nextProps.utilisateur.id) {
      const fLoaded = {};
      const cLoaded = {};
      if (!this.state.utilisateursCommandesLoaded[nextProps.utilisateur.id]) {
        this.props.loadCommandeUtilisateurs({
          utilisateurId: nextProps.utilisateur.id,
        });
        cLoaded[nextProps.utilisateur.id] = true;
      }

      if (!this.state.fournisseursLoaded[nextProps.utilisateur.relaiId]) {
        this.props.loadFournisseurs({
          relaiId: nextProps.utilisateur.relaiId,
          jointures: true,
        });
        fLoaded[nextProps.utilisateur.relaiId] = true;
      }

      this.setState({
        fournisseursLoaded: {
          ...this.state.fournisseursLoaded,
          ...fLoaded,
        },
        utilisateursCommandesLoaded: {
          ...this.state.utilisateursCommandesLoaded,
          ...cLoaded,
        },
      });
    }
  }

  render() {
    const {
      commandeUtilisateurs,
      commandeUtilisateurId,
      utilisateur,
      pending,
      onClick,
    } = this.props;

    return (
      <Panel
        title={
          utilisateur
            ? `${utilisateur.nom.toUpperCase()} ${capitalize(utilisateur.prenom)}`
            : 'Sélectionnez un utilisateur'
        }
      >
        {pending && <p>Chargement...</p>}
        {!pending &&
          commandeUtilisateurs &&
          <SelectableList value={commandeUtilisateurId} onChange={onClick}>

            {Object.keys(commandeUtilisateurs)
              .filter(
                id => commandeUtilisateurs[id].utilisateurId === utilisateur.id
              )
              .map(id => (
                <ListItem
                  value={id}
                  innerDivStyle={{ padding: '4px 0' }}
                  nestedListStyle={{ padding: '5px' }}
                >
                  {format(commandeUtilisateurs[id].createdAt, 'MMMM D YYYY')}
                </ListItem>
              ))}
          </SelectableList>}
      </Panel>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeContenus: selectCommandeContenus(),
  offres: selectOffres(),
  produits: selectProduits(),
  commandeUtilisateurs: selectCommandesUtilisateurs(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCommandeUtilisateurs,
      loadFournisseurs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Utilisateur);
