import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactGridLayout from 'react-grid-layout';

import { loadUtilisateurs, loadRelais } from 'containers/Commande/actions';
import {
  selectUtilisateurs,
  selectCommandesUtilisateurs,
  selectRelais,
} from 'containers/Commande/selectors';

import { selectPending } from 'containers/App/selectors';

import Panel from './components/Panel';
import Utilisateurs from './components/Utilisateurs';
import Utilisateur from './components/Utilisateur';
import Commande from './components/Commande';

class Dashboard extends Component {
  static propTypes = {
    pending: PropTypes.bool.isRequired,
    utilisateurs: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    commandeUtilisateurs: PropTypes.object,
    loadRelais: PropTypes.func.isRequired,
  };

  state = {
    utilisateurId: null,
    commandeUtilisateurId: null,
  };

  componentDidMount() {
    this.props.loadUtilisateurs();
    this.props.loadRelais();
  }

  handleSelectUtilisateur = (event, utilisateurId) =>
    this.setState({ utilisateurId });

  handleSelectCommandeUtilisateur = (event, commandeUtilisateurId) =>
    this.setState({ commandeUtilisateurId });

  render() {
    const { relais, utilisateurs, pending, commandeUtilisateurs } = this.props;
    const { utilisateurId, commandeUtilisateurId } = this.state;
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2 },
      { i: 'b', x: 1, y: 0, w: 4, h: 9 },
      { i: 'c', x: 5, y: 0, w: 1, h: 2 },
    ];
    if (!utilisateurs || !relais) return null;
    const commandeUtilisateur = commandeUtilisateurId &&
      commandeUtilisateurs &&
      commandeUtilisateurs[commandeUtilisateurId]
      ? commandeUtilisateurs[commandeUtilisateurId]
      : null;
    console.log(
      moment(commandeUtilisateur.createdAt).format('LLL'),
      commandeUtilisateur,
      commandeUtilisateurId,
    );
    return (
      <ReactGridLayout
        className="layout"
        draggableHandle=".dragHandle"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1250}
        autoSize
        margin={[5, 5]}
      >
        <div key={'a'}>
          {!commandeUtilisateur
            ? <Panel title="Auncune commande" />
            : <Commande
                commandeUtilisateur={commandeUtilisateur}
                pending={pending}
                commandeUtilisateurId={commandeUtilisateurId}
              />}
        </div>
        <div key={'b'}>
          <Utilisateurs
            utilisateurs={utilisateurs}
            relais={relais}
            onClick={this.handleSelectUtilisateur}
            utilisateurId={utilisateurId}
          />
        </div>
        <div key={'c'}>
          {utilisateurId
            ? <Utilisateur
                utilisateur={utilisateurs[utilisateurId]}
                pending={pending}
                onClick={this.handleSelectCommandeUtilisateur}
                commandeUtilisateurId={commandeUtilisateurId}
              />
            : <Panel title="Sélectionnez un utilisateur" />}
        </div>
      </ReactGridLayout>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  utilisateurs: selectUtilisateurs(),
  commandeUtilisateurs: selectCommandesUtilisateurs(),
  relais: selectRelais(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loadUtilisateurs,
    loadRelais,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
