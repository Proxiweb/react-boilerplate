import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CommunicationFormContainer from './containers/CommunicationFormContainer';
import styles from './index.css';

class AdminCommunication extends Component { // eslint-disable-line
  static propTypes = {
    communicationId: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  render() {
    if (this.props.communicationId === 'courante') return <CommunicationFormContainer />;
    if (this.props.communicationId === 'passees') return <div>Anciennes</div>;
    return (
      <div>Anciennes</div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  communicationId: ownProps.params.communicationId,
});

export default connect(mapStateToProps)(AdminCommunication);
