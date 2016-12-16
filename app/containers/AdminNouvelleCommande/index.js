import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { loadFournisseurs, createCommande } from 'containers/Commande/actions';
import { selectFournisseurs } from 'containers/Commande/selectors';
import NouvelleCommandeListeFournisseurs from './components/NouvelleCommandeListeFournisseurs';
import NouvelleCommandeParametres from './components/NouvelleCommandeParametres';
import NouvelleCommandeDistribution from './components/NouvelleCommandeDistribution';
import moment from 'moment';
import styles from './styles.css';

class NouvelleCommande extends Component { // eslint-disable-line
  static propTypes = {
    create: PropTypes.func.isRequired,
    fournisseurs: PropTypes.array.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    cdeFourns: [],
    parametres: {},
    distributions: [],
  }

  addDistrib = (value) => {
    this.setState({ distributions: [...this.state.distributions, value] });
  }

  delDistrib = (index) => {
    this.setState({ distributions: this.state.distributions.filter((dist, idx) => idx !== index) });
  }

  addFourn = (value) => {
    if (this.state.cdeFourns.includes(value)) return;
    this.setState({ cdeFourns: [...this.state.cdeFourns, value] });
  }

  delFourn = (value) => this.setState({
    ...this.state,
    cdeFourns: this.state.cdeFourns.filter((cde) => cde.id !== value.id),
  });

  changeParam = (key, value) => this.setState({
    ...this.state,
    parametres: {
      ...this.state.parametres,
      [key]: value,
    },
  });

  validate = () => {
    const { cdeFourns, parametres } = this.state;
    return cdeFourns.length && parametres.dateLimite instanceof Date && parametres.heureLimite instanceof Date;
  }

  create = () => {
    const { parametres, distributions, cdeFourns } = this.state;
    const { dateLimite, heureLimite, resume, montantMin, montantMinRelais } = parametres;
    const commande = {
      dateCommande: `${moment(dateLimite).format('YYYY-MM-DD')}T${moment(heureLimite).format('HH:mm')}`,
      resume,
      montantMin,
      montantMinRelai: montantMinRelais,
      fournisseurs: cdeFourns.map((f) => f.id),
      livraisons: distributions,
    };

    this.props.create(commande);
  }

  render() {
    const { fournisseurs } = this.props;
    const { cdeFourns, parametres, distributions } = this.state;
    const { muiTheme } = this.context;

    return (
      <div className="row center-md">
        <div className="col-md-10">
          <Paper className={styles.panel}>
            <Tabs
              inkBarStyle={{ height: 7, backgroundColor: muiTheme.appBar.color, marginTop: -7 }}
              contentContainerClassName={styles.tab}
            >
              <Tab label="Fournisseurs">
                <NouvelleCommandeListeFournisseurs
                  addFourn={this.addFourn}
                  delFourn={this.delFourn}
                  fournisseurs={fournisseurs}
                  fournisseursCommande={cdeFourns}
                />
              </Tab>
              <Tab label="Paramètres">
                <NouvelleCommandeParametres
                  parametres={parametres}
                  changeParam={this.changeParam}
                />
              </Tab>
              <Tab label="Distribution">
                <NouvelleCommandeDistribution
                  distributions={distributions}
                  addDistrib={this.addDistrib}
                  delDistrib={this.delDistrib}
                />
              </Tab>
            </Tabs>
            <div className="row center-md">
              <div className="col-md-4">
                <RaisedButton
                  primary
                  label="Sauvegarder"
                  onClick={() => this.create()}
                  fullWidth
                  disabled={!this.validate()}
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
  fournisseurs: selectFournisseurs(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadFournisseurs()),
  create: (commande) => dispatch(createCommande(commande)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
