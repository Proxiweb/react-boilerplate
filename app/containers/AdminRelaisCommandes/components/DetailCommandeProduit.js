import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import {
  trouveTarification,
} from 'containers/CommandeEdit/components/components/AffichePrix';
import buildCommandeRow from 'components/DetailCommandeColumns';

import {
  supprimerCommandeContenu,
  diminuerCommandeContenu,
} from 'containers/Commande/actions';

import styles from './styles.css';
// eslint-disable-next-line
class CommnandeParProduitFournisseur extends Component {
  static propTypes = {
    contenu: PropTypes.object.isRequired,
    readOnly: PropTypes.bool.isRequired,
    produit: PropTypes.object.isRequired,
    qteTotalOffre: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    // diminuer: PropTypes.func.isRequired,
    supprimer: PropTypes.func.isRequired,
  };

  handleDiminuer = () => {
    const { contenu, supprimer } = this.props;
    if (contenu.quantite === 1) {
      supprimer(contenu);
    } else {
      alert('Diminution non implémmentée'); // eslint-disable-line
    }
  };

  render() {
    const {
      produit,
      contenu,
      offre,
      qteTotalOffre,
      idx,
      readOnly,
    } = this.props;

    const tarif = trouveTarification(offre.tarifications, qteTotalOffre, 0);
    const tarifEnBaisse = offre.tarifications[0].prix > tarif.prix;
    const rows = buildCommandeRow({
      contenu,
      idx,
      offre,
      tarifEnBaisse,
      colorTrendingDown: 'green',
      tarif,
      produit,
    });

    return (
      <TableRow key={idx}>
        {rows}
        {!readOnly &&
          <TableRowColumn className={styles.lessSmallCol}>
            <button onClick={this.handleDiminuer} title="quantite - 1">
              - 1
            </button>
          </TableRowColumn>}
      </TableRow>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    diminuer: diminuerCommandeContenu,
    supprimer: supprimerCommandeContenu,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(
  CommnandeParProduitFournisseur,
);
