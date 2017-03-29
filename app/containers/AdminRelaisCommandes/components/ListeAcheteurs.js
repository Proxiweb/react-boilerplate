import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, makeSelectable } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import { calculeTotauxCommande } from 'containers/Commande/utils';
import DepotRelais from 'containers/DepotRelais';
import { selectStellarKeys } from 'containers/App/selectors';
import ListeAcheteursItem from './ListeAcheteursItem';
import styles from './styles.css';
const SelectableList = makeSelectable(List);

class ListeAcheteurs extends Component {
  // eslint-disable-line
  static propTypes = {
    commandeUtilisateurs: PropTypes.array.isRequired,
    stellarKeys: PropTypes.object,
    params: PropTypes.object.isRequired,
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    depots: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    utilisateurSelected: null,
    utilisateurDepot: null,
    utilisateurTotalCommande: null,
    utilisateurBalance: null,
    depot: false,
  };

  handleClose = () => this.setState({ ...this.state, depot: false });

  handleDepotExpress = () => this.setState({ ...this.state, depot: false });

  handleDepotRelais = () => this.setState({ ...this.state, depot: false });

  handleClick = (utilisateurSelected, utilisateurDepot, utilisateurTotalCommande, utilisateurBalance) => {
    this.setState({
      ...this.state,
      utilisateurSelected,
      utilisateurDepot,
      utilisateurTotalCommande,
      utilisateurBalance,
    });
    this.props.onChange(utilisateurSelected);
  };

  render() {
    const {
      commandeUtilisateurs,
      params: { commandeId, utilisateurId, relaiId },
      utilisateurs,
      stellarKeys,
      offres,
      commandeContenus,
      depots,
    } = this.props;

    const { utilisateurDepot, utilisateurTotalCommande, utilisateurBalance } = this.state;

    const utilisateur = utilisateurs.find(u => u.id === utilisateurId);
    const contenus = Object.keys(this.props.contenus).map(k => this.props.contenus[k]);
    const acheteurs = commandeUtilisateurs
      .filter(cu => cu.commandeId === commandeId)
      .map(cu => ({
        ...cu,
        utilisateur: utilisateurs.find(u => u.id === cu.utilisateurId),
      }))
      .slice()
      .sort((cu1, cu2) => cu1.utilisateur.nom > cu2.utilisateur.nom);

    return (
      <div className="row">
        <div className={`col-md-10 col-md-offset-1 ${styles.depot}`}>
          {stellarKeys && (!stellarKeys.adresse || !stellarKeys.secret) && <p>Parametrez Proxiweb</p>}
          {// !utilisateurDepot &&
          utilisateurId &&
            <RaisedButton
              primary
              fullWidth
              label="Depot"
              disabled={stellarKeys && (!stellarKeys.adresse || !stellarKeys.secret)}
              onClick={() => this.setState({ ...this.state, depot: true })}
            />}
          {false && utilisateurDepot && `Dépot : ${parseFloat(utilisateurDepot.montant).toFixed(2)} €`}
          {// !utilisateurDepot &&
          utilisateurId &&
            utilisateurBalance &&
            <DepotRelais
              utilisateur={utilisateur}
              balance={utilisateurBalance}
              totalCommande={utilisateurTotalCommande}
              relaiId={relaiId}
              depot={utilisateurDepot}
              commandeId={commandeId}
              open={this.state.depot}
              onRequestClose={this.handleClose}
              stellarKeys={stellarKeys}
              onDepotDirectSuccess={this.handleClose}
            />}
        </div>
        <div className={`col-md-12 ${styles.listeAcheteurs}`}>
          <SelectableList value={utilisateurId}>
            {acheteurs.map((cu, idx) => (
              <ListeAcheteursItem
                key={idx}
                utilisateur={cu.utilisateur}
                depots={depots}
                commandeUtilisateur={cu}
                value={cu.utilisateurId}
                onClick={this.handleClick}
                totaux={calculeTotauxCommande({
                  contenus: contenus.filter(
                    c => c.utilisateurId === cu.utilisateurId && c.commandeId === commandeId,
                  ),
                  offres,
                  commandeContenus,
                  commandeId,
                })}
              />
            ))}
          </SelectableList>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  stellarKeys: selectStellarKeys(),
});

export default connect(mapStateToProps)(ListeAcheteurs);
