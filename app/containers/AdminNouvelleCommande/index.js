import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { loadFournisseurs, createCommande, loadRelais } from 'containers/Commande/actions';
import {
  selectFournisseursRelais,
  selectFournisseursCommande,
  selectCommandeLivraisons,
  selectCommandeCommandeUtilisateurs,
} from 'containers/Commande/selectors';
import NouvelleCommandeListeFournisseurs from './components/NouvelleCommandeListeFournisseurs';
import NouvelleCommandeParametres from './components/NouvelleCommandeParametres';
import NouvelleCommandeDistribution from './components/NouvelleCommandeDistribution';
import moment from 'moment';
import styles from './styles.css';

class NouvelleCommande extends Component { // eslint-disable-line
  static propTypes = {
    commande: PropTypes.object,
    params: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    fournisseursCommande: PropTypes.array,
    commandeUtilisateurs: PropTypes.array.isRequired,
    livraisonsCommande: PropTypes.array,
    create: PropTypes.func.isRequired,
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
    const {
      fournisseursCommande,
      commande,
      livraisonsCommande,
    } = this.props;

    if (fournisseursCommande && fournisseursCommande.length) {
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
    this.setState({ ...this.state, distributions: [...this.state.distributions, value] });
  }

  delDistrib = (index) => {
    this.setState({ ...this.state, distributions: this.state.distributions.filter((dist, idx) => idx !== index) });
  }

  addFourn = (value) => {
    if (this.state.cdeFourns.includes(value)) return;
    this.setState({ ...this.state, cdeFourns: [...this.state.cdeFourns, value] });
  }

  delFourn = (value) => this.setState({
    ...this.state,
    cdeFourns: this.state.cdeFourns.filter((cde) => cde.id !== value.id),
  });

  changeParam = (key, value) => {
    const parametres = { ...this.state.parametres, [key]: value };
    let distributions = this.state.distributions;
    const { relais } = this.props;
    if (
      !distributions.length &&
      relais.distributionJours.length &&
      parametres.heureLimite &&
      parametres.dateLimite
    ) {
      const dateCommande = this.calculeDateCommande();
      const livraisons =
        relais.distributionJours
          .map((livr) => {
            const dateDebut = moment(dateCommande)
              .weekday(livr.jour)
              .hours(livr.heureDebut.split(':')[0])
              .minutes(livr.heureDebut.split(':')[1]);
            const dateFin = moment(dateCommande)
              .weekday(livr.jour)
              .hours(livr.heureFin.split(':')[0])
              .minutes(livr.heureFin.split(':')[1]);

            return {
              debut: dateDebut.toISOString(),
              fin: dateFin.toISOString(),
            };
          });
      distributions = livraisons.filter((livr) => moment(livr.debut).isAfter(dateCommande));
    }
    this.setState({
      ...this.state,
      distributions,
      parametres,
    });
  }

  validate = () => {
    const { cdeFourns, parametres } = this.state;
    return cdeFourns.length > 0;
    //  &&
    //   ( parametres.dateLimite instanceof Date &&
    //     parametres.heureLimite instanceof Date
    //   );
  }

  calculeDateCommande = () => {
    const { dateLimite, heureLimite } = this.state.parametres;
    if (!dateLimite || !heureLimite) return null;
    const hLim = parseInt(moment(heureLimite).format('HH'), 10);
    const mLim = parseInt(moment(heureLimite).format('mm'), 10);
    return moment(dateLimite).hours(hLim).minutes(mLim);
  }

  create = () => {
    const { parametres, distributions, cdeFourns } = this.state;
    const { resume, montantMin, montantMinRelais } = parametres;
    const { commandeId } = this.props.params;
    const dateCommande = this.calculeDateCommande();
    const commande = {
      id: commandeId !== 'nouvelle' ? commandeId : undefined,
      dateCommande: dateCommande ? dateCommande.toISOString() : null,
      resume,
      montantMin,
      montantMinRelai: montantMinRelais,
      fournisseurs: cdeFourns.map((f) => f.id),
      livraisons: dateCommande ? distributions : [{ debut: null, fin: null }],
    };

    this.props.create(commande);
  }

  render() {
    const { fournisseurs, commande, commandeUtilisateurs } = this.props;
    const { cdeFourns, parametres, distributions, confirmDestroyOpen } = this.state;
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
                  dateLimiteCommande={parametres.dateLimite}
                />
              </Tab>
            </Tabs>
            <div className="row center-md">
              <div className="col-md-6">
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
  commandeUtilisateurs: selectCommandeCommandeUtilisateurs(),
  livraisonsCommande: selectCommandeLivraisons(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadFournisseurs,
  loadR: loadRelais,
  create: createCommande,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
