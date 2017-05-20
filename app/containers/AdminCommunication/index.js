import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CommunicationFormContainer from './containers/CommunicationFormContainer';
import CommunicationsHistorique from './containers/CommunicationsHistorique';

// eslint-disable-next-line
class AdminCommunication extends Component {
  static propTypes = {
    communicationId: PropTypes.string.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    if (this.props.communicationId === 'courante') return <CommunicationFormContainer />;
    return <CommunicationsHistorique />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  communicationId: ownProps.params.communicationId,
});

export default connect(mapStateToProps)(AdminCommunication);
