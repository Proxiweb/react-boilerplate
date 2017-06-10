import React, { Component } from "react";
import PropTypes from "prop-types";

export default class MessageBox extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    asyncState: PropTypes.object.isRequired
  };

  render() {
    const { asyncState } = this.props;
    return (
      <div className="col-md-12">
        {asyncState.error && <p className="alert alert-danger">{asyncState.message}</p>}
        {asyncState.success &&
          asyncState.message &&
          <p className="alert alert-success">{asyncState.message}</p>}
        {asyncState.pending && asyncState.message && <p className="alert alert-info">{asyncState.message}</p>}
      </div>
    );
  }
}
