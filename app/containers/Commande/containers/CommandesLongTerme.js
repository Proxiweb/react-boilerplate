import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import round from 'lodash/round';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import GradeIcon from 'material-ui/svg-icons/action/grade';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import { orange800, green500, cyan500 } from 'material-ui/styles/colors';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import Panel from 'components/Panel';

import {
  selectCommandeContenus,
  selectOffres,
  // selectCommandesUtilisateur,
} from 'containers/Commande/selectors';

const Offre = ({ imageSrc, nom, tarif, prct, fav, commandeId, pushState, relaiId, utilisateurId }) => (
  <Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={nom}
      subtitle={tarif}
      avatar={imageSrc}
      actAsExpander
      showExpandableButton
    />
    <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 10 }}>
      <LinearProgress
        mode="determinate"
        value={prct}
        color={prct < 100 ? cyan500 : green500}
        style={{ height: 6, backgroundColor: '#EDE7E7' }}
      />
    </div>
    <CardActions expandable>
      <div className="row center-md">
        <div className="col-md-6">
          <FlatButton
            label="Commander"
            labelPosition="before"
            onClick={() => pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${utilisateurId}`)}
            icon={<ShoppingCartIcon color="black" />}
          />
        </div>
      </div>
    </CardActions>
  </Card>
);

Offre.propTypes = {
  imageSrc: PropTypes.string,
  nom: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  relaiId: PropTypes.string.isRequired,
  utilisateurId: PropTypes.string.isRequired,
  prct: PropTypes.number.isRequired,
  fav: PropTypes.bool.isRequired,
  tarif: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
};

class CommandesLongTerme extends Component {
  static propTypes = {
    commandesIds: PropTypes.array.isRequired,
    commandes: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    commandeContenus: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    relaiId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    getCommandeInfos: PropTypes.func.isRequired,
  }

  getInfos = (commandeId) => {
    const { commandeContenus, commandes, offres, getCommandeInfos } = this.props;
    const contenus = commandes[commandeId]
                            .commandeUtilisateurs
                            .reduce((memo, cuId) => memo.concat(
                              Object
                                .keys(commandeContenus)
                                .filter((id) => commandeContenus[id].commandeUtilisateurId === cuId)
                                .map((id) => commandeContenus[id])
                            ), []);
    let prct = 0;
    let prix = 0;
    const montantMin = commandes[commandeId].montantMin;
    if (contenus.length > 0) {
      const totaux = calculeTotauxCommande({ contenus, offres, commandeContenus, commandeId });
      prix = round(totaux.prix, 2);
      prct = parseInt((prix * 100) / montantMin, 10);
    }

    return {
      prct,
      montantMin,
      prix,
      typesProduits: getCommandeInfos(commandeId),
    };
  }

  render() {
    return (<div>
      <Panel>Commandes de long terme</Panel>
      {this.props.commandesIds.map((id, idx) => {
        const infos = this.getInfos(id);

        return (
          <Offre
            key={idx}
            nom={infos.typesProduits.join(',')}
            commandeId={id}
            tarif={`${infos.prix} € sur ${infos.montantMin} €`}
            prct={infos.prct}
            fav
            pushState={this.props.pushState}
            relaiId={this.props.relaiId}
            utilisateurId={this.props.utilisateurId}
          />
        );
      })}
    </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  commandeContenus: selectCommandeContenus(),
  offres: selectOffres(),
  // commandeUtilisateurs: selectCommandesUtilisateurs(),
});

export default connect(mapStateToProps)(CommandesLongTerme);
