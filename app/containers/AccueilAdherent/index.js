import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { createStructuredSelector } from 'reselect';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { selectRelais } from 'containers/AdminRelais/selectors';
import { loadRelais } from 'containers/AdminRelais/actions';
// import styles from './styles.css';

class AccueilAdherent extends Component {
  static propTypes = {
    relais: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (!this.findRelais()) {
      this.props.load();
    }
  }

  findRelais = () =>
    this.props.relais.find(
      (r) => r.id === this.props.params.relaiId
    );

  render() {
    const ceRelais = this.findRelais();
    const { pushState } = this.props;
    return (
      <div className="row center-md">
        <Helmet
          title="Proxiweb - Bienvenue sur ce relais"
          meta={[
            { name: 'description', content: 'Message de bienvenue' },
          ]}
        />
        <div className="col-md-8">
          {ceRelais &&
            <Paper zDepth={2} style={{ padding: '1em' }}>
              <h1>Bienvenue sur le relais ProxiWeb<br />{ceRelais.nom}</h1>
              <div className="row center-md">
                <div className="col-md-8">
                  <p
                    style={{ padding: '1em', border: 'solid 1px silver', borderRadius: '5px 5px' }}
                    dangerouslySetInnerHTML={{ __html: ceRelais.presentation }} // eslint-disable-line
                  />
                </div>
                <div className="col-md-6">
                  <RaisedButton
                    label="Consulter les commandes en cours"
                    primary
                    onClick={() =>
                      pushState(`/relais/${ceRelais.id}/commandes`)
                    }
                  />
                </div>
              </div>
            </Paper>}
          {!ceRelais &&
            <Paper style={{ minHeight: '250px' }}>
              <RefreshIndicator
                size={70}
                left={0}
                top={20}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </Paper>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadRelais()),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccueilAdherent);
