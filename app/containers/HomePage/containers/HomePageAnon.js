import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';// import styles from './styles.css';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { selectRelais } from 'containers/Commande/selectors';
import { loadRelais } from 'containers/Commande/actions';

import { selectionneRelais } from 'containers/App/actions';
import { selectRelaiId } from 'containers/App/selectors';

import styles from './styles.css';
import cabas from './cabas.jpg';

class HomePageAnon extends Component {
  static propTypes = {
    relais: PropTypes.object,
    relaiId: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    choisirRelais: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    const { relais, load, choisirRelais } = this.props;
    // choisirRelais('test');
    if (!relais || !Object.keys(relais).length < 1) {
      load();
    }
  }

  render() {
    const { relais, relaiId } = this.props;
    if (!relais) return null;
    return (
      <div className="row center-md">
        <div className="col-md-10">
          <Paper className={styles.homepage}>
            <div className="row">
              <div className="col-md-3">
                <RaisedButton fullWidth label="Affiche" />
              </div>
              <div className="col-md-3">
                <RaisedButton fullWidth label="Doc" />
              </div>
              <div className="col-md-6">

              </div>
              <div className="col-md-12" style={{ padding: '1em' }}>
                <div className="row">
                  <div className="col-md-6">
                    <img src={cabas} alt="cabas" height="100%" width="auto" />
                  </div>
                  <div className="col-md-6"></div>
                </div>
              </div>
            </div>
            <h1>Homepage !{Object.keys(relais).length} {relaiId}</h1>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
  relaiId: selectRelaiId(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadRelais()),
  choisirRelais: (id) => dispatch(selectionneRelais(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageAnon);
