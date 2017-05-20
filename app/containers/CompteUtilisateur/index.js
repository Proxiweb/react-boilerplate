/*
 *
 * CompteUtilisateur
 *
 */

import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { logout } from '../Login/actions';
import { selectPayments, selectBalance, selectRelaiId } from './selectors';
import { selectRelais } from 'containers/Commande/selectors';
import { selectLocationState } from 'containers/App/selectors';
import ProfileFormContainer from 'containers/ProfileFormContainer';
import NotificationsForm from 'components/NotificationsForm';

export class CompteUtilisateur extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    locationState: PropTypes.object.isRequired,
    relaiId: PropTypes.string.isRequired,
    relais: PropTypes.string,
    params: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  handleChange = value => {
    const { pushState, params } = this.props;
    pushState(`/users/${params.userId}/profile?tab=${value}`);
  };

  render() {
    const { query } = this.props.locationState.locationBeforeTransitions;
    const { relais, relaiId } = this.props;

    return (
      <div className="row center-lg">
        <div className="col-lg-6">
          <Tabs
            inkBarStyle={{ height: 7, backgroundColor: this.context.muiTheme.appBar.color, marginTop: -7 }}
            value={query.tab}
            onChange={this.handleChange}
          >
            <Tab label="Profil" value="profil">
              <ProfileFormContainer relaiId={this.props.relaiId} afterSubmit={this.toggleState} />
            </Tab>
            <Tab label="Notifications" value="notifications">
              <NotificationsForm />
            </Tab>
            {relais &&
              relais[relaiId] &&
              <Tab label="Relais" value="relais">
                <Paper zDepth={2} style={{ padding: '1rem', minHeight: '444px' }}>
                  <p style={{ textAlign: 'center' }}>
                    Vous êtes inscrit sur le relais <strong>{relais[relaiId].nom}</strong>
                  </p>
                </Paper>
              </Tab>}
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  payments: selectPayments(),
  compte: selectBalance(),
  locationState: selectLocationState(),
  relaiId: selectRelaiId(),
  relais: selectRelais(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: url => dispatch(push(url)),
    logout: () => dispatch(logout()), // eslint-disable-line
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompteUtilisateur);
