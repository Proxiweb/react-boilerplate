import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CommunicationForm from 'components/CommunicationForm';
import { loadCommunications, setMessage } from './actions';
import moment from 'moment';
import styles from './index.css';

class AdminCommunication extends Component { // eslint-disable-line
  static propTypes = {
    communication: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  render() {
    if (!this.props.communication) return null;
    const { sms, objet, html } = this.props.communication.message;

    // const palette = this.context.muiTheme.palette;
    return (
      <div className="row">
        <div className={`col-md-6 ${styles.panel}`}>
          <CommunicationForm onSubmit={this.props.setMessage} message={{ sms, objet, html }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  communication: state.communication,
});

const mapDispatchToProps = (dispatch) => ({
  setMessage: (message) => dispatch(setMessage(message)),
  // loadUtilisateursDatas: () => dispatch(loadUtilisateurs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCommunication);
