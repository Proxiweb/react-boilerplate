import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import { connect } from 'react-redux';
import { removeMessage } from 'containers/App/actions';
import Snackbar from 'material-ui/Snackbar';

class Notifications extends Component { // eslint-disable-line
  static propTypes = {
    messages: PropTypes.array.isRequired,
    removeMsg: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages.length > this.props.messages.length) {
      this.setState({
        open: true,
      });
    }
  }

  handleRequestClose = () => {
    const { messages, removeMsg } = this.props;
    removeMsg(messages[0].id);
    this.setState({
      open: false,
    });
  };

  render() {
    const { messages } = this.props;
    if (messages.length < 1) return null;
    const message = messages[0];
    const colors = {
      error: { backgroundColor: '#B43133', color: 'white' },
      success: { backgroundColor: '#7DB646', color: 'black' },
      info: { backgroundColor: '#000', color: 'white' },
    };
    return (
      <Snackbar
        open={this.state.open}
        message={message.text}
        autoHideDuration={message.duration || 5000}
        bodyStyle={{ backgroundColor: colors[message.type].backgroundColor, textAlign: 'center' }}
        contentStyle={{ color: colors[message.type].color }}
        onRequestClose={this.handleRequestClose}
      />
    );
  }
}

export default connect(
  (state) => ({ messages: state.global.messages }),
  (dispatch) => ({ removeMsg: (id) => dispatch(removeMessage(id)) })
)(Notifications);
