import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { loadFournisseurs, createCommande } from 'containers/Commande/actions';
import { selectFournisseursRelais, selectFournisseursCommande, selectCommandeLivraisons } from 'containers/Commande/selectors';
import NouvelleCommandeListeFournisseurs from './components/NouvelleCommandeListeFournisseurs';
import NouvelleCommandeParametres from './components/NouvelleCommandeParametres';
import NouvelleCommandeDistribution from './components/NouvelleCommandeDistribution';
import moment from 'moment';
import styles from './styles.css';

class NouvelleCommande extends Component { // eslint-disable-line
  static propTypes = {
    commande: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    fournisseursCommande: PropTypes.array.isRequired,
    livraisonsCommande: PropTypes.array.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    cdeFourns: [],
    parametres: {},
    distributions: [],
  }

  componentDidMount() {
    const { fournisseursCommande, commande, livraisonsCommande } = this.props;
    if (fournisseursCommande.length) {
      this.initCmde(fournisseursCommande, commande, livraisonsCommande);
    }
  }

  initCmde = (fournisseursCommande, commande, livraisonsCommande) => {
    this.setState({
      ...this.state,
      cdeFourns: fournisseursCommande,
      parametres: {
        dateLimite: new Date(commande.dateCommande),
        heureLimite: new Date(commande.dateCommande),
        montantMin: commande.montantMin,
        montantMinRelai: commande.montantMinRelais,
      },
      distributions: livraisonsCommande,
    });
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
    const hLim = parseInt(moment(heureLimite).format('HH'), 10);
    const mLim = parseInt(moment(heureLimite).format('mm'), 10);
    const commande = {
      dateCommande: moment(dateLimite).hours(hLim).minutes(mLim).toISOString(),
      resume,
      montantMin,
      montantMinRelai: montantMinRelais,
      fournisseurs: cdeFourns.map((f) => f.id),
      livraisons: distributions,
    };

    this.props.create(commande);
  }

  render() {
    const { fournisseurs, commande } = this.props;
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
                  label={`${commande && commande.id ? 'Modifier' : 'Créer'} cette commande`}
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
  fournisseurs: selectFournisseursRelais(),
  fournisseursCommande: selectFournisseursCommande(),
  livraisonsCommande: selectCommandeLivraisons(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadFournisseurs()),
  create: (commande) => dispatch(createCommande(commande)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
