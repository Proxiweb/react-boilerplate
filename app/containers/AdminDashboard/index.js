import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactGridLayout from 'react-grid-layout';

import { loadUtilisateurs, loadRelais } from 'containers/Commande/actions';
import { selectUtilisateurs, selectRelais } from 'containers/Commande/selectors';

import Panel from './components/Panel';
import Utilisateurs from './components/Utilisateurs';

class Dashboard extends Component {

  static propTypes = {
    utilisateurs: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.loadUtilisateurs();
    this.props.loadRelais();
  }

  render() {
    const { relais, utilisateurs } = this.props;
    const layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 0, w: 4, h: 2, minW: 4, minH: 13 },
      { i: 'c', x: 5, y: 0, w: 1, h: 2 },
    ];
    if (!utilisateurs || !relais) return null;
    console.log(utilisateurs);
    return (
      <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1800} margin={[5, 5]}>
        <div key={'a'}><Panel title="a">Lorem...</Panel></div>
        <div key={'b'}><Utilisateurs utilisateurs={utilisateurs} relais={relais} /></div>
        <div key={'c'}><Panel title="c">sid amed...</Panel></div>
      </ReactGridLayout>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  utilisateurs: selectUtilisateurs(),
  relais: selectRelais(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadUtilisateurs,
  loadRelais,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
