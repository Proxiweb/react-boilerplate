import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { List, makeSelectable } from 'material-ui/List';
import { format } from 'utils/dates';
import compareDesc from 'date-fns/compare_desc';
import addMinutes from 'date-fns/add_minutes';
import getTime from 'date-fns/get_time';
import groupBy from 'lodash/groupBy';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
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
    distributions: PropTypes.array.isRequired,
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

  handleClick = (
    utilisateurSelected,
    utilisateurDepot,
    utilisateurTotalCommande,
    utilisateurBalance
  ) => {
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
      distributions,
      stellarKeys,
      offres,
      commandeContenus,
      depots,
    } = this.props;

    const {
      utilisateurDepot,
      utilisateurTotalCommande,
      utilisateurBalance,
    } = this.state;

    const utilisateur = utilisateurs.find(u => u.id === utilisateurId);
    // const contenus = Object.keys(this.props.contenus).map(k => this.props.contenus[k]);
    const acheteurs = commandeUtilisateurs
      .filter(cu => cu.commandeId === commandeId)
      .map(cu => ({
        ...cu,
        utilisateur: utilisateurs.find(u => u.id === cu.utilisateurId),
        debutLivraisonISO: livraisons[cu.livraisonId]
          ? format(
              addMinutes(
                livraisons[cu.livraisonId].debut,
                livraisons[cu.livraisonId].plageHoraire
              )
            )
          : null,
        debutLivraisonUnix: livraisons[cu.livraisonId]
          ? getTime(
              addMinutes(
                livraisons[cu.livraisonId].debut,
                livraisons[cu.livraisonId].plageHoraire
              )
            )
          : 0,
      }))
      .slice()
      .sort(
        (cu1, cu2) =>
          cu1.debutLivraisonUnix > cu2.debutLivraisonUnix &&
          cu1.utilisateur.nom > cu2.utilisateur.nom
      );

    const acheteursGrp = groupBy(acheteurs, 'debutLivraisonISO');

    return (
      <div className="row">
        <div className={`col-md-10 col-md-offset-1 ${styles.depot}`}>
          {stellarKeys &&
            (!stellarKeys.adresse || !stellarKeys.secret) &&
            <p>Parametrez Proxiweb</p>}
          {// !utilisateurDepot &&
          utilisateurId &&
            <RaisedButton
              primary
              fullWidth
              label="Depot"
              disabled={
                stellarKeys && (!stellarKeys.adresse || !stellarKeys.secret)
              }
              onClick={() => this.setState({ ...this.state, depot: true })}
            />}
          {false &&
            utilisateurDepot &&
            `Dépot : ${parseFloat(utilisateurDepot.montant).toFixed(2)} €`}
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
            {Object.keys(acheteursGrp).map(key => (
              <div key={key}>
                <Subheader>{format(key, 'LL HH:mm')}</Subheader>
                {acheteursGrp[key].map((cu, idx2) => (
                  <ListeAcheteursItem
                    key={idx2}
                    utilisateur={cu.utilisateur}
                    depots={depots}
                    commandeUtilisateur={cu}
                    value={cu.utilisateurId}
                    onClick={this.handleClick}
                    totaux={calculeTotauxCommande({
                      filter: cc => cc.utilisateurId === cu.utilisateurId,
                      offres,
                      commandeContenus,
                      commandeId,
                    })}
                  />
                ))}
              </div>
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
