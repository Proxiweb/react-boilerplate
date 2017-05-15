import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import setISODay from 'date-fns/set_iso_day';
import addHours from 'date-fns/add_hours';
import addMinutes from 'date-fns/add_minutes';
import isAfter from 'date-fns/is_after';
import { format } from 'utils/dates';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {
  loadFournisseurs,
  createCommande,
  loadRelais,
} from 'containers/Commande/actions';
import {
  selectFournisseursRelais,
  selectFournisseursCommande,
  selectCommandeLivraisons,
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
    livraisonsCommande: PropTypes.array,
    create: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    cdeFourns: [],
    parametres: {},
    distributions: [],
  };

  componentDidMount() {
    const {
      fournisseursCommande,
      commandes,
      livraisonsCommande,
      params: { commandeId },
    } = this.props;

    if (fournisseursCommande && fournisseursCommande.length) {
      this.initCmde(
        fournisseursCommande,
        commandes[commandeId],
        livraisonsCommande
      );
    }
  }

  initCmde = (fournisseursCommande, commande, livraisonsCommande) => {
    const { montantMin, montantMinRelai, qteMin, qteMinRelai } = commande;
    this.setState({
      ...this.state,
      cdeFourns: fournisseursCommande,
      parametres: {
        dateLimite: new Date(commande.dateCommande),
        heureLimite: new Date(commande.dateCommande),
        montantMin,
        montantMinRelai,
        qteMin,
        qteMinRelai,
      },
      distributions: livraisonsCommande,
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
    const { commandes, token, params: { commandeId } } = this.props;
    if (includes(this.state.cdeFourns, value)) return;
    if (!commandes || !commandes[commandeId]) {
      this.setState({
        ...this.state,
        cdeFourns: [...this.state.cdeFourns, value],
      });
      return;
    }
    post(`/api/commandes/${commandes.id}/fournisseurs`, {
      datas: { fournisseurId: value.id },
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      this.setState({
        ...this.state,
        cdeFourns: [...this.state.cdeFourns, value],
      });
    });
  };

  delFourn = value => {
    const { commande, token } = this.props;
    if (!commande.id) {
      this.setState({
        ...this.state,
        cdeFourns: this.state.cdeFourns.filter(cde => cde.id !== value.id),
      });
      return;
    }

    del(`/api/commande/${commande.id}/fournisseurs/${value.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      this.setState({
        ...this.state,
        cdeFourns: this.state.cdeFourns.filter(cde => cde.id !== value.id),
      });
    });
  };

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
    const { cdeFourns, parametres } = this.state;
    return cdeFourns.length > 0;
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
    const { parametres, distributions, cdeFourns } = this.state;
    const {
      resume,
      montantMin,
      montantMinRelai,
      dateLimite,
      heureLimite,
      qteMin,
      qteMinRelai,
    } = parametres;
    const { commandeId } = this.props.params;
    const dateCommande = this.calculeDateCommande(dateLimite, heureLimite);
    const commande = {
      id: commandeId !== 'nouvelle' ? commandeId : undefined,
      dateCommande: dateCommande ? format(dateCommande) : null,
      resume,
      montantMin,
      montantMinRelai,
      qteMin,
      qteMinRelai,
      fournisseurs: cdeFourns.map(f => f.id),
      livraisons: dateCommande ? distributions : [{ debut: null, fin: null }],
    };

    this.props.create(commande);
  };

  render() {
    const { fournisseurs, commande, commandeUtilisateurs } = this.props;
    const {
      cdeFourns,
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
