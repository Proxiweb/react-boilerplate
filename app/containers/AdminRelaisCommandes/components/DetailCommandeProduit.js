import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import {
  trouveTarification,
} from 'containers/CommandeEdit/components/components/AffichePrix';
import buildCommandeRow from 'components/DetailCommandeColumns';

import { diminuer } from 'containers/CommandeEdit/actions';

import styles from './styles.css';
// eslint-disable-next-line
class CommnandeParProduitFournisseur extends Component {
  static propTypes = {
    contenus: PropTypes.array.isRequired,
    readOnly: PropTypes.bool.isRequired,
    produit: PropTypes.object.isRequired,
    qteTotalOffre: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
    commandeId: PropTypes.string.isRequired,
    diminuer: PropTypes.func.isRequired,
  };

  handleDiminuer = () => {
    const { commandeId, offre: { id }, contenus } = this.props;
    console.log(contenus[0]);
    // this.props.diminuer(commandeId, id)
  };

  render() {
    const {
      produit,
      contenus,
      offre,
      qteTotalOffre,
      idx,
      readOnly,
      commandeId,
    } = this.props;

    const tarif = trouveTarification(offre.tarifications, qteTotalOffre, 0);
    const tarifEnBaisse = offre.tarifications[0].prix > tarif.prix;
    const rows = buildCommandeRow({
      contenu: contenus[0],
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
    diminuer,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(
  CommnandeParProduitFournisseur,
);
