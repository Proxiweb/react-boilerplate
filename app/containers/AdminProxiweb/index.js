import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { selectStellarKeys } from 'containers/App/selectors';
import { setStellarKeys } from 'containers/App/actions';

class ProxiwebConfig extends Component {
  static propTypes = {
    stellarKeys: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.props.stellarKeys };
  }

  handleValidation = () => this.props.set(this.state);

  render() {
    const { stellarKeys } = this.props;
    return (
      <div className="row center-md">
        <div className="col-md-6">
          <Paper style={{ padding: '1em' }}>
            <div className="row center-md">
              <div className="col-md-10">
                <TextField
                  name="Adresse"
                  fullWidth
                  floatingLabelText="Adresse"
                  onChange={(event, adresse) => this.setState({ ...this.state, adresse })}
                  value={this.state.adresse}
                  />
                <TextField
                  name="Secret"
                  fullWidth
                  floatingLabelText="Secret"
                  onChange={(event, secret) => this.setState({ ...this.state, secret })}
                  value={this.state.secret}
                />
              </div>
              <div className="col-md-6" style={{ marginTop: '1em' }}>
                <RaisedButton
                  primary
                  label="valider"
                  fullWidth
                  onClick={this.handleValidation}
                />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  stellarKeys: selectStellarKeys(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  set: setStellarKeys,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProxiwebConfig);
