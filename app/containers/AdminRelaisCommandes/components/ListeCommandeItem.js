import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { format } from 'utils/dates';
import { ListItem } from 'material-ui/List';
import { bindActionCreators } from 'redux';
import { deleteCommande } from 'containers/Commande/actions';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import CommandeListeTypesProduits from './CommandeListeTypesProduits';

const iconButtonElement = (
  <IconButton touch tooltip="Plus..." tooltipPosition="bottom-left">
    <MoreVertIcon color="gray" />
  </IconButton>
);

class ListeCommandeItem extends Component {
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
    commande: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  handleRemoveCommande = id => {
    if (confirm('Supprimer cette commande')) {
      this.props.deleteCommande(id);
    }
  };

  handleClick = commandeId => {
    const { relaiId } = this.props;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}`);
  };

  buildRightIcon = (relaiId, commande) => {
    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        {!commande.finalisation &&
          <MenuItem
            onClick={() =>
              this.props.pushState(
                `/admin/relais/${relaiId}/commandes/${commande.id}/edit`
              )}
          >
            Modifier
          </MenuItem>}
        {commande.finalisation &&
          <MenuItem
            onClick={() =>
              this.props.pushState(
                `/distributeurs/${relaiId}/factures/${commande.id}?print=true`
              )}
          >
            Facture
          </MenuItem>}
        {commande.commandeUtilisateurs.length === 0 &&
          <MenuItem onClick={() => this.handleRemoveCommande(commande.id)}>
            Supprimer
          </MenuItem>}
      </IconMenu>
    );
  };

  render() {
    const { commande, relaiId } = this.props;
    const commandeId = commande.id;
    const paiementsOk =
      commande.finalisation &&
      commande.finalisation.destinataires.filter(
        d => d.montant > 0 && !d.paiementOk
      ).length === 0;
    if (commande.finalisation) {
      console.log(paiementsOk);
    }
    return (
      <ListItem
        primaryText={
          commande.dateCommande
            ? format(commande.dateCommande, 'DD MMMM HH:mm')
            : 'date indéfinie'
        }
        secondaryText={<CommandeListeTypesProduits commande={commande} />}
        value={commande.id}
        rightIconButton={this.buildRightIcon(relaiId, commande)}
        onTouchTap={() => this.handleClick(commandeId)}
        style={{ backgroundColor: paiementsOk ? '#a2f9a2' : 'white' }}
      />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteCommande,
      pushState: push,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ListeCommandeItem);
