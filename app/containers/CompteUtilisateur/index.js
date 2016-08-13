/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { logout } from '../Login/actions';
import selectCompteUtilisateur from './selectors';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.object,
    compteUtilisateur: PropTypes.object.isRequired,
    commande: PropTypes.object,
    logout: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className={`container ${styles.compteUtilisateur}`}>
        <div className="row">
          <div className="col-md-6 text-left withMarginTop">
            <Link to="/">Home</Link>
          </div>
          <div className="col-md-6 text-right withMarginTop">
            <button
              className="btn btn-default"
              onClick={this.props.logout}
            >
              <i className="fa fa-sign-out"></i> Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  compteUtilisateur: selectCompteUtilisateur(state),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(logout()),  // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
