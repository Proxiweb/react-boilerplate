import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import uuid from 'node-uuid';
import {
  loadFournisseurs,
  createCommande,
  loadRelais,
} from 'containers/Commande/actions';
import {
  selectFournisseursRelais,
  selectFournisseursCommande,
  selectCommandeCommandeUtilisateurs,
} from 'containers/Commande/selectors';
import { selectToken } from 'containers/CompteUtilisateur/selectors';
import NouvelleCommandeListeFournisseurs
  from './components/NouvelleCommandeListeFournisseurs';
import NouvelleCommandeParametres
  from './components/NouvelleCommandeParametres';
import NouvelleCommandeDistribution
  from './components/NouvelleCommandeDistribution';
import { post, del } from 'utils/apiClient';
import styles from './styles.css';

class NouvelleCommande extends Component {
  // eslint-disable-line
  static propTypes = {
    commande: PropTypes.object,
    params: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    fournisseursCommande: PropTypes.array,
    commandeUtilisateurs: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    create: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    parametres: {},
    distributions: [],
    datesLimites: [],
  };

  componentDidMount() {
    const { commandes, params: { commandeId } } = this.props;

    this.initCmde(commandes[commandeId]);
  }

  initCmde = commande => {
    const {
      montantMin,
      montantMinRelai,
      qteMin,
      qteMinRelai,
      datesLimites,
      distributions,
    } = commande;
    this.setState({
      ...this.state,
      parametres: {
        dateLimite: new Date(commande.dateCommande),
        heureLimite: new Date(commande.dateCommande),
        montantMin,
        montantMinRelai,
        qteMin,
        qteMinRelai,
      },
      distributions,
      datesLimites,
    });
  };

  addDistrib = value => {
    this.setState({
      ...this.state,
      distributions: [...this.state.distributions, value],
    });
  };

  delDistrib = index => {
    this.setState({
      ...this.state,
      distributions: this.state.distributions.filter(
        (dist, idx) => idx !== index
      ),
    });
  };

  addFourn = value => {
    const { dateLimite } = this.state.parametres;
    const fournisseur = this.props.fournisseurs.find(f => f.id === value);

    const infosRelai = fournisseur.relais.find(
      r => r.id === this.props.params.relaiId
    );

    let dateLimiteFournisseur = null;

    if (infosRelai && infosRelai.limiteCommande) {
      const { jourSemaine, heure } = infosRelai.limiteCommande;
      const [heures, minutes] = infosRelai.limiteCommande.heure.split(':');
      dateLimiteFournisseur = moment(dateLimite)
        .startOf('week')
        .startOf('day')
        .add(jourSemaine, 'days')
        .add(parseInt(heures, 10), 'hours')
        .add(parseInt(minutes, 10), 'minutes')
        .toISOString();
    }

    this.setState({
      ...this.state,
      datesLimites: this.state.datesLimites.concat({
        fournisseurId: value,
        dateLimite: dateLimiteFournisseur,
      }),
    });
  };

  delFourn = value => {
    this.setState({
      ...this.state,
      datesLimites: this.state.datesLimites.filter(
        dL => dL.fournisseurId !== value
      ),
    });
  };

  handleModifDateLimiteFourn = (fournisseurId, date) =>
    this.setState({
      ...this.state,
      datesLimites: this.state.datesLimites.map(
        dL =>
          dL.fournisseurId !== fournisseurId
            ? { ...dL }
            : { ...dL, dateLimite: moment(date).toISOString() }
      ),
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
      const dateCommande = this.calculeDateCommande(
        parametres.dateLimite,
        parametres.heureLimite
      );
      const distributions = relais.distributionJours
        .map(livr => {
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
        })
        .filter(livr => moment(livr.debut).isAfter(dateCommande));
    }
    this.setState({
      ...this.state,
      distributions,
      parametres,
    });
  };

  validate = () => {
    const { datesLimites, parametres } = this.state;
    return datesLimites.length > 0;
    //  &&
    //   ( parametres.dateLimite instanceof Date &&
    //     parametres.heureLimite instanceof Date
    //   );
  };

  calculeDateCommande = (dateLimite, heureLimite) => {
    if (!dateLimite || !heureLimite) return null;
    const hLim = parseInt(moment(heureLimite).format('HH'), 10);
    const mLim = parseInt(moment(heureLimite).format('mm'), 10);
    return moment(dateLimite).hours(hLim).minutes(mLim);
  };

  create = () => {
    const { parametres, distributions, datesLimites } = this.state;
    const {
      resume,
      montantMin,
      montantMinRelai,
      dateLimite,
      heureLimite,
      qteMin,
      qteMinRelai,
    } = parametres;
    console.log(datesLimites);
    const { commandeId, relaiId } = this.props.params;
    const dateCommande = this.calculeDateCommande(dateLimite, heureLimite);
    const commande = {
      id: commandeId !== 'nouvelle' ? commandeId : undefined,
      dateCommande: dateCommande ? dateCommande.toISOString() : null,
      resume,
      montantMin,
      montantMinRelai,
      qteMin,
      qteMinRelai,
      distributions: distributions.map(d => ({ ...d, relaiId, id: uuid.v4() })),
      datesLimites,
    };

    this.props.create(commande);
  };

  render() {
    const {
      fournisseurs,
      commande,
      commandeUtilisateurs,
      params: { commandeId },
    } = this.props;

    const {
      datesLimites,
      parametres,
      distributions,
      confirmDestroyOpen,
    } = this.state;
    const { muiTheme } = this.context;

    return (
      <div className="row center-md">
        <div className="col-md-10">
          <Paper className={styles.panel}>
            <Tabs
              inkBarStyle={{
                height: 7,
                backgroundColor: muiTheme.appBar.color,
                marginTop: -7,
              }}
              contentContainerClassName={styles.tab}
            >
              <Tab label="Paramètres">
                <NouvelleCommandeParametres
                  parametres={parametres}
                  changeParam={this.changeParam}
                />
              </Tab>
              <Tab label="Fournisseurs">
                <NouvelleCommandeListeFournisseurs
                  addFourn={this.addFourn}
                  delFourn={this.delFourn}
                  onModifDateLimiteFourn={this.handleModifDateLimiteFourn}
                  fournisseurs={fournisseurs}
                  datesLimites={datesLimites}
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
                  label={`${commandeId ? 'Modifier' : 'Créer'} cette commande`}
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
  token: selectToken(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadFournisseurs,
      loadR: loadRelais,
      create: createCommande,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
