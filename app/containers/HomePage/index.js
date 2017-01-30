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

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
// import styles from './styles.css';
import { createStructuredSelector } from 'reselect';
import Commandes from 'containers/Commande';
import HomePageAnon from './containers/HomePageAnon';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  render() {
    const { auth } = this.props;
    if (auth && auth.relaiId) {
      return <Commandes params={{ relaiId: auth.relaiId }} />;
    }
    return <HomePageAnon />;
  }
}


const mapStateToProps = createStructuredSelector({
  auth: selectCompteUtilisateur(),
});

export default connect(mapStateToProps)(HomePage);
