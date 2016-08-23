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
import { loadDatas1Start, loadDatas2Start } from './actions';
import styles from './styles.css';
import MessageBox from 'components/MessageBox';
import LocaleToggle from 'containers/LocaleToggle';

import { selectAsyncDatas1, selectAsyncDatas2 } from './selectors';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loadDatas1: PropTypes.func.isRequired,
    loadDatas2: PropTypes.func.isRequired,
    asyncDatas1: PropTypes.object.isRequired,
    asyncDatas2: PropTypes.object.isRequired,
  }

  render() {
    const { asyncDatas1, asyncDatas2 } = this.props;
    return (
      <div className="row text-center">
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
          <MessageBox asyncState={asyncDatas1} />
          <button onClick={() => this.props.loadDatas1(1)} className="btn btn-primary">Load Datas 1</button>
        </div>
        <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
          <button
            onClick={() => this.props.loadDatas2(1)}
            className="btn btn-primary"
          >
            <span>{ !asyncDatas2.pending && 'Load Datas 2'} { asyncDatas2.pending && 'loading...' }</span>
          </button>
        </div>
        <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
          <LocaleToggle />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  asyncDatas1: selectAsyncDatas1(state),
  asyncDatas2: selectAsyncDatas2(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  loadDatas1: (id) => dispatch(loadDatas1Start(id)),
  loadDatas2: (id) => dispatch(loadDatas2Start(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
