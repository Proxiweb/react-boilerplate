/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { logout } from '../Login/actions';
import { selectPayments, selectBalance } from './selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.toggleState = ::this.toggleState;
    this.state = {
      edit: false,
    };
  }

  toggleState() {
    this.setState({
      edit: !this.state.edit,
    });
  }

  render() {
    return (
      <div className={`container ${styles.compteUtilisateur}`}>
        <div className="row center-xs">
          <div className="col-md-8">
            <ProfileFormContainer afterSubmit={this.toggleState} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  payments: selectPayments(),
  compte: selectBalance(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(logout()),  // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
