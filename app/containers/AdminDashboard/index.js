import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactGridLayout from 'react-grid-layout';

import { loadUtilisateurs, loadRelais } from 'containers/Commande/actions';
import {
  selectUtilisateurs,
  selectRelais,
} from 'containers/Commande/selectors';

import Panel from './components/Panel';
import Utilisateurs from './components/Utilisateurs';
import Utilisateur from './components/Utilisateur';

class Dashboard extends Component {
  static propTypes = {
    utilisateurs: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
  };

  state = {
    utilisateurId: null,
  };

  componentDidMount() {
    this.props.loadUtilisateurs();
    this.props.loadRelais();
  }

  handleSelectUtilisateur = utilisateurId => this.setState({ utilisateurId });

  render() {
    const { relais, utilisateurs } = this.props;
    const { utilisateurId } = this.state;
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2 },
      { i: 'b', x: 1, y: 0, w: 4, h: 9 },
      { i: 'c', x: 5, y: 0, w: 1, h: 2 },
    ];
    if (!utilisateurs || !relais) return null;
    return (
      <ReactGridLayout
        className="layout"
        draggableHandle=".dragHandle"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1800}
        autoSize
        margin={[5, 5]}
      >
        <div key={'a'}><Panel title="a">Loremo...</Panel></div>
        <div key={'b'}>
          <Utilisateurs
            utilisateurs={utilisateurs}
            relais={relais}
            onClick={this.handleSelectUtilisateur}
          />
        </div>
        <div key={'c'}>
          <Utilisateur
            utilisateur={utilisateurId ? utilisateurs[utilisateurId] : null}
          />
        </div>
      </ReactGridLayout>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  utilisateurs: selectUtilisateurs(),
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
