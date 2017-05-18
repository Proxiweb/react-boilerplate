import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { createStructuredSelector } from 'reselect';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { selectRelais } from 'containers/AdminRelais/selectors';
import { loadRelais } from 'containers/AdminRelais/actions';
import legumes from './legumes.jpg';
import styles from './styles.css';

const constStyles  = {
  refresh: {
    display: 'inline-block',
    position: 'relative',
  }
};

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
            <Paper zDepth={2} style={styles.paper}>
              <div className="row center-md">
                <div className="col-md-2">
                  <img src={legumes} alt="legumes" style={styles.img} />
                </div>
                <div className="col-md-8">
                  <h1>Relais ProxiWeb {ceRelais.nom}</h1>
                  <p>{ceRelais.adresseComplete}</p>
                  <p
                    style={styles.presentation}
                    dangerouslySetInnerHTML={{ __html: ceRelais.presentation }} // eslint-disable-line
                  />
                  <RaisedButton
                    label="Consulter les commandes en cours"
                    primary
                    onClick={() =>
                      pushState('/')
                    }
                  />
                </div>
                <div className="col-md-6">
                </div>
              </div>
            </Paper>}
          {!ceRelais &&
            <Paper style={styles.refresh}>
              <RefreshIndicator
                size={70}
                left={0}
                top={20}
                status="loading"
                style={constStyles.refresh}
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadRelais,
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AccueilAdherent);
