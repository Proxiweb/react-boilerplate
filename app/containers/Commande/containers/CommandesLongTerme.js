import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import { green500, cyan500 } from 'material-ui/styles/colors';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import Panel from 'components/Panel';

import {
  makeSelectCommandeContenus,
  makeSelectOffres, // selectCommandesUtilisateur,
} from 'containers/Commande/selectors';

import CommandePanel from 'containers/Commande/components/CommandePanel';
import styles from './styles.css';

const Offre = ({
  imageSrc,
  nom,
  tarif,
  prct,
  commandeId,
  pushState,
  relaiId,
  utilisateurId,
  buttonClicked,
  commandeUtilisateurExiste,
  withLink,
}) =>
  (<Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={
        withLink
          ? <Link
            to={`/admin/relais/${relaiId}/commandes/${commandeId}`}
            className={styles.link}
          >
            {nom}
          </Link>
          : nom
      }
      subtitle={tarif}
      avatar={imageSrc}
      actAsExpander
      showExpandableButton
    />
    {prct &&
      <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 10 }}>
        <LinearProgress
          mode="determinate"
          value={prct}
          color={prct < 100 ? cyan500 : green500}
          style={{ height: 6, backgroundColor: '#EDE7E7' }}
        />
      </div>}
    <CardActions expandable>
      <RaisedButton
        label={
          commandeUtilisateurExiste(commandeId)
            ? 'Modifier ma commande'
            : 'Commander'
        }
        icon={<ShoppingCartIcon />}
        fullWidth
        primary
        onClick={() => {
          buttonClicked();
          pushState(
            `/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`
          );
        }}
      />
    </CardActions>
  </Card>);

Offre.propTypes = {
  imageSrc: PropTypes.string,
  nom: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  relaiId: PropTypes.string.isRequired,
  utilisateurId: PropTypes.string.isRequired,
  prct: PropTypes.number.isRequired,
  tarif: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
  withLink: PropTypes.bool.isRequired,
  buttonClicked: PropTypes.func.isRequired,
  commandeUtilisateurExiste: PropTypes.func.isRequired,
};

class CommandesLongTerme extends Component {
  static propTypes = {
    commandesIds: PropTypes.array.isRequired,
    commandes: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commandeUtilisateurExiste: PropTypes.func.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    relaiId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    getCommandeInfos: PropTypes.func.isRequired,
    buttonClicked: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    withLink: PropTypes.bool.isRequired,
  };

  getInfos = commandeId => {
    const {
      commandeContenus,
      commandes,
      offres,
      getCommandeInfos,
    } = this.props;
    const { montantMin, qteMin } = commandes[commandeId];

    if (qteMin) {
      const nbreAcheteurs = commandes[commandeId].commandeUtilisateurs.length;
      const prct = parseInt(nbreAcheteurs * 100 / qteMin, 10);
      return {
        prct,
        infoTarif: `${nbreAcheteurs} acheteurs sur ${qteMin}`,
        typesProduits: getCommandeInfos(commandeId),
      };
    }

    const contenus = commandes[commandeId].commandeUtilisateurs.reduce(
      (memo, cuId) =>
        memo.concat(
          Object.keys(commandeContenus)
            .filter(id => commandeContenus[id].commandeUtilisateurId === cuId)
            .map(id => commandeContenus[id])
        ),
      []
    );
    let prct = 0;
    let prix = 0;
    if (contenus.length > 0 && montantMin) {
      const totaux = calculeTotauxCommande({
        contenus,
        offres,
        commandeContenus,
        commandeId,
      });
      prix = round(totaux.prix, 2);
      prct = parseInt(prix * 100 / montantMin, 10);
    }

    return {
      prct,
      infoTarif: `${prix} € sur ${montantMin} €`,
      prix,
      typesProduits: getCommandeInfos(commandeId),
    };
  };

  render() {
    const {
      commandeUtilisateurExiste,
      commandes,
      buttonClicked,
      pushState,
      pending,
      relaiId,
      utilisateurId,
      withLink,
    } = this.props;
    return (
      <div>
        <Panel>Commandes de long terme</Panel>
        {this.props.commandesIds.map((id, idx) => {
          const infos = this.getInfos(id);

          if (commandes[id].dateCommande) {
            return (
              <CommandePanel
                nom={infos ? infos.typesProduits.join(', ') : null}
                dateCommande={commandes[id].dateCommande}
                label={
                  commandeUtilisateurExiste(id)
                    ? 'Modifier ma commande'
                    : 'Commander'
                }
                prct={100}
                fav={false}
                key={idx}
                commandeId={`${id}`}
                disabled={pending}
                clickHandler={() => {
                  buttonClicked();
                  pushState(
                    `/relais/${relaiId}/commandes/${id}?utilisateurId=${utilisateurId}`
                  );
                }}
              />
            );
          }
          return (
            <Offre
              key={idx}
              nom={infos.typesProduits.join(',')}
              commandeId={id}
              tarif={infos.infoTarif}
              prct={infos.prct}
              fav
              pushState={this.props.pushState}
              relaiId={this.props.relaiId}
              utilisateurId={this.props.utilisateurId}
              commandeUtilisateurExiste={commandeUtilisateurExiste}
              buttonClicked={buttonClicked}
              withLink={withLink}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeContenus: makeSelectCommandeContenus(),
  offres: makeSelectOffres(),
  // commandeUtilisateurs: makeSelectCommandesUtilisateurs(),
});

export default connect(mapStateToProps)(CommandesLongTerme);
