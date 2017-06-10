/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { loadRelais } from 'containers/Commande/actions';
import { selectRelais } from 'containers/Commande/selectors';
// import styles from './styles.css';
import { createStructuredSelector } from 'reselect';
import Commandes from 'containers/Commande';
import HomePageAnon from './containers/HomePageAnon';
// import Cache from 'containers/Commande/containers/Cache';
// eslint-disable-next-line react/prefer-stateless-function
class HomePage extends Component {
  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    push: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
    relais: PropTypes.object,
  };

  render() {
    const { auth, relais } = this.props;
    if (auth && auth.relaiId) {
      if (!auth.relaiId) this.props.push('/choixRelais');
      if (!relais) this.props.loadRelais({ id: auth.relaiId });
      return <Commandes params={{ relaiId: auth.relaiId }} />;
    }
    return <HomePageAnon />;
  }
}

const mapStateToProps = createStructuredSelector({
  auth: selectCompteUtilisateur(),
  relais: selectRelais(),
});

const mapDispatchToProps = dispatch => bindActionCreators({ push, loadRelais }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
