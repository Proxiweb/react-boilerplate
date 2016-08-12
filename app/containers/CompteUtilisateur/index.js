/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { logout } from '../Login/actions';
import selectCompteUtilisateur, { selectCommande } from './selectors';
import moment from 'moment';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.object,
    compteUtilisateur: PropTypes.object.isRequired,
    commande: PropTypes.object,
    logout: PropTypes.func.isRequired,
  }

  render() {
    const { commandes } = this.props.compteUtilisateur.auth;
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
          {(!commandes || commandes.length === 0) && (
            <div className="col-md-8 col-md-offset-2 text-center">
              <div className="alert alert-info">{'Aucune commande pour l\'instant'}</div>
            </div>)}
          {commandes && commandes.length > 0 && (<div className="col-md-12">
            <div className="row">
              <div className="col-md-4">
                <Nav bsStyle="pills" stacked>
                  {commandes && commandes.map(commande => (
                    <LinkContainer to={`/votre-compte/${commande.id}`} key={commande.id}>
                      <NavItem>{moment(commande.createdAt).format('LLL')}</NavItem>
                    </LinkContainer>
                  ))}
                </Nav>
              </div>
              <div className="col-md-8">
                {this.props.children}
              </div>
            </div>
          </div>)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  compteUtilisateur: selectCompteUtilisateur(state),
  commande: selectCommande(state, ownProps),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(logout()),  // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
