/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { logout } from '../Login/actions';
import selectCompteUtilisateur from './selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.object,
    compteUtilisateur: PropTypes.object.isRequired,
    commande: PropTypes.object,
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
    const { auth } = this.props.compteUtilisateur;
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
          <input type="text" value={auth.email} className="form-control" />
        </div>)}
        {!this.state.edit && (<div>
          <button className="btn btn-default" onClick={this.toggleState}>Modifier</button>
          <ProfileFormContainer />
        </div>)}
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
