import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import RefreshIndicator from 'material-ui/RefreshIndicator';

import DetailCommande from 'components/DetailCommande';
import { loadCommandes } from 'containers/Commande/actions';

import {
  selectProduits,
  selectOffres,
  selectUserIdCommandeUtilisateur,
  selectCommandeId,
  selectCommandeCommandeContenus,
  selectCommandeContenus,
} from 'containers/Commande/selectors';


class DetailCommandeContainer extends Component {
  static propTypes = {
    commandeId: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired, // eslint-disable-line
    produits: PropTypes.object,
    offres: PropTypes.object,
    commandeUtilisateur: PropTypes.object.isRequired,
    commandeContenus: PropTypes.array.isRequired,
    contenus: PropTypes.object.isRequired,

    loadCommandeById: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { commandeUtilisateur, loadCommandeById, commandeId } = this.props;
    if (!commandeUtilisateur) {
      loadCommandeById({ id: commandeId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.commandeId !== nextProps.commandeId
    ) {
      this.props.loadCommandeById(nextProps.commandeId);
    }
  }

  render() {
    const { produits, offres, commandeUtilisateur, commandeContenus, contenus } = this.props;
    if (!commandeUtilisateur) {
      return (
        <RefreshIndicator
          size={40}
          left={0}
          top={10}
          status="loading"
          style={{ display: 'inline-block', position: 'relative' }}
        />
      );
    }
    console.log(commandeContenus, contenus);
    return null;
    return (
      <DetailCommande
        contenus={commandeUtilisateur.contenus}
        offres={offres}
        produits={produits}
        montant={commandeUtilisateur.montant}
        recolteFond={commandeUtilisateur.recolteFond}
        readOnly
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeId: selectCommandeId(),
  produits: selectProduits(),
  offres: selectOffres(),
  commandeUtilisateur: selectUserIdCommandeUtilisateur(),
  contenus: selectCommandeContenus(),
  commandeContenus: selectCommandeCommandeContenus(),
});

const mapDispatchToProps = (dispatch) => ({
  loadCommandeById: (query) => dispatch(loadCommandes(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailCommandeContainer);
