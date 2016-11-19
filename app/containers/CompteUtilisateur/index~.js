/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { logout } from '../Login/actions';
import { selectProfile, selectPayments } from './selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import ListePaiements from 'components/ListePaiements';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    profile: PropTypes.object.isRequired,
    payments: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
  }

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
    // const { profile } = this.props.profile;
    const profile = { nom: 'GUYOMARCH', prenom: 'Régis' };
    return (
      <div className={`container ${styles.compteUtilisateur}`}>
        <div className="row">
          <div className="col-md-12 text-right withMarginTop">
            <button
              className="btn btn-default"
              onClick={this.props.logout}
            >
              <i className="fa fa-sign-out"></i> Se déconnecter
            </button>
          </div>
        </div>
        {this.state.edit && (<div>
          <button className="btn btn-default" onClick={this.toggleState}>Quitter edition</button>
          <ProfileFormContainer profile={profile} afterSubmit={this.toggleState} />
        </div>)}
        {!this.state.edit && (<div>
          <button className="btn btn-default" onClick={this.toggleState}>Modifier</button>
        </div>)}
        {this.props.payments && this.props.payments.length > 0 && <ListePaiements paiements={this.props.payments} />}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  profile: selectProfile(),
  payments: selectPayments(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(logout()),  // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
