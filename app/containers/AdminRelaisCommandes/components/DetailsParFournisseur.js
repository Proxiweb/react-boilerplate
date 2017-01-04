import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import FlatButton from 'material-ui/FlatButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import PersonIcon from 'material-ui/svg-icons/social/person';

import {
  selectCommandeCommandeContenus,
  selectCommandeContenus,
  selectFournisseursCommande,
  selectCommandeProduits,
  selectOffres,
} from 'containers/Commande/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

import CommandeFournisseur from './CommandeFournisseur';

class DetailsParFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    offres: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  render() {
    const {
      commandeContenus,
      contenus,
      produits,
      fournisseurs,
      offres,
      params,
      auth,
      pushState,
    } = this.props;

    const { commandeId, relaiId } = params;
    return (
      <div>
        {auth.roles.includes('ADMIN') &&
          <div>
            <FlatButton
              label="Virer les fonds"
              icon={<SendIcon />}
              onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/paiements`)}
            />
            <FlatButton
              label="Passer une commande"
              icon={<PersonIcon />}
              onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs`)}
            />
          </div>
        }
        {fournisseurs
          .filter((f) => f.visible)
          .map((fournisseur, idx) => (
            <CommandeFournisseur
              key={idx}
              fournisseur={fournisseur}
              produits={produits.filter((pdt) => pdt.fournisseurId === fournisseur.id)}
              commandeContenus={commandeContenus}
              contenus={contenus}
              offres={offres}
              commandeId={commandeId}
            />
          ))}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
  fournisseurs: selectFournisseursCommande(),
  produits: selectCommandeProduits(),
  offres: selectOffres(),
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParFournisseur);
