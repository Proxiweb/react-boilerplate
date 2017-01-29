import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export default class MessageMaj extends Component {
  render() {
    return (
      <div className="row center-md">
        <div className="col-md-6">
          <Paper style={{ padding: '1em' }}>
            <h1>Mise à jour de ProxiWeb</h1>
            <h3>Veuillez patienter...</h3>
          </Paper>
        </div>
      </div>
    );
  }
}
