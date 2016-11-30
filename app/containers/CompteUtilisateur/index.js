/*
 *
 * CompteUtilisateur
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { logout } from '../Login/actions';
import { selectPayments, selectBalance } from './selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import NotificationsForm from 'components/NotificationsForm';
import { Tabs, Tab } from 'material-ui/Tabs';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={`${styles.compteUtilisateur}`}>
        <div className="row center-lg">
          <div className="col-lg-6">
            <Tabs>
              <Tab label="Profil">
                <ProfileFormContainer afterSubmit={this.toggleState} />
              </Tab>
              <Tab label="Notifications">
                <NotificationsForm />
              </Tab>
            </Tabs>
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
