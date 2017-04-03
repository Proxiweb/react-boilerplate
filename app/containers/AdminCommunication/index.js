import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CommunicationFormContainer from './containers/CommunicationFormContainer';
import CommunicationsHistorique from './containers/CommunicationsHistorique';

class AdminCommunication extends Component { // eslint-disable-line
  static propTypes = {
    communicationId: PropTypes.string.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.communicationId === 'courante') return <CommunicationFormContainer />;
    if (this.props.communicationId === 'passees') return <CommunicationsHistorique />;
    return (
      <div>Anciennes</div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  communicationId: ownProps.params.communicationId,
});

export default connect(mapStateToProps)(AdminCommunication);
