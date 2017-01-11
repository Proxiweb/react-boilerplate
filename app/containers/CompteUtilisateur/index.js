/*
 *
 * CompteUtilisateur
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { logout } from '../Login/actions';
import { selectPayments, selectBalance } from './selectors';
import { selectLocationState } from 'containers/App/selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import NotificationsForm from 'components/NotificationsForm';
import { Tabs, Tab } from 'material-ui/Tabs';
import styles from './styles.css';

export class CompteUtilisateur extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    locationState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  handleChange = (value) => {
    const { pushState, params } = this.props;
    pushState(`/users/${params.userId}/profile?tab=${value}`);
  }

  render() {
    const { query } = this.props.locationState.locationBeforeTransitions;
    return (
      <div className={`${styles.compteUtilisateur}`}>
        <div className="row center-lg">
          <div className="col-lg-6">
            <Tabs
              inkBarStyle={{ height: 7, backgroundColor: this.context.muiTheme.appBar.color, marginTop: -7 }}
              value={query.tab}
              onChange={this.handleChange}
            >
              <Tab label="Profil" value="profil">
                <ProfileFormContainer afterSubmit={this.toggleState} />
              </Tab>
              <Tab label="Notifications" value="notifications">
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
  locationState: selectLocationState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
    logout: () => dispatch(logout()),  // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
