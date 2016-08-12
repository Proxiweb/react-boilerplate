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
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { loadDatas1Start } from './actions';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadDatas1: PropTypes.func.isRequired,
  }

  render() {
    return (
      <h1>
        <FormattedMessage {...messages.header} />
        <button onClick={() => this.props.loadDatas1(1)} className="btn btn-primary">Load Datas 1</button>
      </h1>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadDatas1: (id) => dispatch(loadDatas1Start(id)),
  };
}

export default connect(null, mapDispatchToProps)(HomePage);
