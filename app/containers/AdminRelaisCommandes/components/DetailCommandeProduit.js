import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import round from 'lodash/round';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import buildCommandeRow from 'components/DetailCommandeColumns';

export default class CommnandeParProduitFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
    qteTotalOffre: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
  }

  render() {
    const { produit, contenus, offre, qteTotalOffre, idx } = this.props;
    const quantite = contenus.reduce((memo, c) => memo + c.quantite + c.qteRegul, 0);
    const tarif = trouveTarification(offre.tarifications, qteTotalOffre, quantite);
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
      <TableRow>
        { rows }
      </TableRow>
    );
  }
}
