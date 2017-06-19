import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import setISODay from 'date-fns/set_iso_day';
import addHours from 'date-fns/add_hours';
import addMinutes from 'date-fns/add_minutes';
import addDays from 'date-fns/add_days';
import setMinutes from 'date-fns/set_minutes';
import setHours from 'date-fns/set_hours';
import isAfter from 'date-fns/is_after';
import startOfWeek from 'date-fns/start_of_week';
import startOfDay from 'date-fns/start_of_day';
import { format } from 'utils/dates';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import uuid from 'node-uuid';
import {
  loadFournisseurs,
  saveCommande,
  loadRelais,
} from 'containers/Commande/actions';
import {
  makeSelectFournisseursRelais,
  makeSelectFournisseursCommande,
  makeSelectCommandeCommandeUtilisateurs,
} from 'containers/Commande/selectors';
import { makeSelectToken } from 'containers/CompteUtilisateur/selectors';
import NouvelleCommandeListeFournisseurs from './components/NouvelleCommandeListeFournisseurs';
import NouvelleCommandeParametres from './components/NouvelleCommandeParametres';
import NouvelleCommandeDistribution from './components/NouvelleCommandeDistribution';
import styles from './styles.css';

class NouvelleCommande extends Component {
  // eslint-disable-line
  static propTypes = {
    commandes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
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
      const [heures, minutes] = heure.split(':');
      dateLimiteFournisseur = format(
        addHours(
          addMinutes(
            addDays(startOfDay(startOfWeek(dateLimite)), jourSemaine),
            parseInt(minutes, 10)
          ),
          parseInt(heures, 10)
        )
      );
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
        dL => // eslint-disable-line
          dL.fournisseurId !== fournisseurId
            ? { ...dL }
            : { ...dL, dateLimite: format(date) }
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

      const livraisons = relais.distributionJours.map(livr => {
        const dateDebut = setMinutes(
          setHours(
            setISODay(dateCommande, livr.jour - 1),
            livr.heureDebut.split(':')[0]
          ),
          livr.heureDebut.split(':')[1]
        );

        const dateFin = setMinutes(
          setHours(
            setISODay(dateCommande, livr.jour - 1),
            livr.heureFin.split(':')[0]
          ),
          livr.heureFin.split(':')[1]
        );

        return {
          debut: format(dateDebut),
          fin: format(dateFin),
        };
      });
      distributions = livraisons.filter(livr =>
        isAfter(livr.debut, dateCommande)
      );
    }
    this.setState({
      ...this.state,
      distributions,
      parametres,
    });
  };

  validate = () => {
    const { datesLimites } = this.state;
    return datesLimites.length > 0;
    //  &&
    //   ( parametres.dateLimite instanceof Date &&
    //     parametres.heureLimite instanceof Date
    //   );
  };

  calculeDateCommande = (dateLimite, heureLimite) => {
    if (!dateLimite || !heureLimite) return null;
    const hLim = parseInt(format(heureLimite, 'HH'), 10);
    const mLim = parseInt(format(heureLimite, 'mm'), 10);
    return addMinutes(addHours(dateLimite, hLim), mLim);
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
    const { commandeId, relaiId } = this.props.params;
    const dateCommande = this.calculeDateCommande(dateLimite, heureLimite);
    const commande = {
      id: commandeId !== 'nouvelle' ? commandeId : undefined,
      dateCommande: dateCommande ? format(dateCommande) : null,
      resume,
      montantMin,
      montantMinRelai,
      qteMin,
      qteMinRelai,
      distributions: distributions.map(d => ({
        ...d,
        relaiId,
        id: d.id ? d.id : uuid.v4(),
      })),
      datesLimites,
    };

    this.props.create(commande);
  };

  render() {
    const { fournisseurs, params: { commandeId } } = this.props;

    const { datesLimites, parametres, distributions } = this.state;
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
  fournisseurs: makeSelectFournisseursRelais(),
  fournisseursCommande: makeSelectFournisseursCommande(),
  commandeUtilisateurs: makeSelectCommandeCommandeUtilisateurs(),
  token: makeSelectToken(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadFournisseurs,
      loadR: loadRelais,
      create: saveCommande,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
