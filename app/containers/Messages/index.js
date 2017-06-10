import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';

import { selectMessage } from 'containers/App/selectors';
import styles from './styles.css';
import { marquerCommeLu } from 'containers/App/actions';

class Messages extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    marquerCommeLu: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.marquerCommeLu(this.props.params.messageId);
  }

  render() {
    const { message: msg } = this.props;
    if (!msg) return null;
    return (
      <div className="row center-md">
        <div className="col-md-8" style={{ marginBottom: '1em' }}>
          <Paper style={{ padding: '15px', fontSize: '1.5em', fontWeight: 'bold' }}>
            <div>{msg.objet}</div>
            <div><small>{msg.identiteExpediteur}</small></div>
          </Paper>
        </div>
        <div className="col-md-8">
          <Paper>
            <div dangerouslySetInnerHTML={{ __html: msg.message }} className={styles.message} />
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  message: selectMessage(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      marquerCommeLu,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
