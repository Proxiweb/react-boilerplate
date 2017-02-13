import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import FlatButton from 'material-ui/FlatButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import PersonIcon from 'material-ui/svg-icons/social/person';
import DoneIcon from 'material-ui/svg-icons/action/done';
import { calculeTotauxCommande } from 'containers/Commande/utils';

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
    const totaux = calculeTotauxCommande({
      contenus: Object.keys(contenus).map((key) => contenus[key]),
      offres,
      commandeContenus,
      commandeId,
    });

    return (
      <div>
        {(includes(auth.roles, 'ADMIN') || includes(auth.roles, 'RELAI_ADMIN')) &&
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
            {includes(auth.roles, 'ADMIN') && <FlatButton
              label="Finaliser la commande"
              icon={<DoneIcon />}
              onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/finalisation`)}
            />}
          </div>
        }
        <div className="row end-md">
          <div className="col-md-6">
            Total Distributeur: <strong>{parseFloat(totaux.recolteFond).toFixed(2)} €</strong>
          </div>
        </div>
        {fournisseurs
          .filter((f) => f.visible)
          .map((fournisseur, idx) => {
            const pdts = produits.filter((pdt) => pdt.fournisseurId === fournisseur.id);
            return (
              <CommandeFournisseur
                key={idx}
                fournisseur={fournisseur}
                produits={pdts}
                commandeContenus={commandeContenus}
                contenus={contenus}
                offres={offres}
                commandeId={commandeId}
              />
            );
          })
        }
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DetailsParFournisseur);
