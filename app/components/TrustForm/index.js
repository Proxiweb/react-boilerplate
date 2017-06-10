import React, { Component } from "react";
import PropTypes from "prop-types";
export default class TrustForm extends Component {
  static propTypes = {
    trust: PropTypes.func.isRequired,
    stellarKeys: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.trust(this.code.value, this.amount.value, this.issuer.value, this.props.stellarKeys);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input
            name="issuer"
            type="text"
            className="form-control"
            placeholder="Issuer"
            ref={node => {
              this.issuer = node;
            }}
            defaultValue="GCSKO7QZZW6HNQ45J624XLRFUIB6HQYD4ZIFVFWSJUR5VAFBZP7FC7JI"
          />
        </div>
        <div className="form-group">
          <input
            name="code"
            type="text"
            className="form-control"
            placeholder="code"
            ref={node => {
              this.code = node;
            }}
            defaultValue="PROXI"
          />
        </div>
        <div className="form-group">
          <input
            name="amount"
            type="number"
            className="form-control"
            placeholder="amout"
            ref={node => {
              this.amount = node;
            }}
            defaultValue="200"
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit">Trust</button>
      </form>
    );
  }
}
