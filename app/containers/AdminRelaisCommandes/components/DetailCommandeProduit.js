import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import round from 'lodash/round';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';


export default class CommnandeParProduitFournisseur extends Component { // eslint-disable-line
  static propTypes = {
    contenus: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
    qteTotalOffre: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
  }

  render() {
    const { produit, contenus, offre, qteTotalOffre } = this.props;
    const quantite = contenus.reduce((memo, c) => memo + c.quantite + c.qteRegul, 0);
    const tarif = trouveTarification(offre.tarifications, qteTotalOffre, quantite);
    const tarifEnbaisse = offre.tarifications[0].prix > tarif.prix;
    return (
      <TableRow>
        <TableRowColumn>{produit.nom}</TableRowColumn>
        <TableRowColumn>{quantite}</TableRowColumn>
        <TableRowColumn>
          {
            <span>
              {round(parseInt(offre.prix, 10) / 100, 2).toFixed(2)}
              { tarifEnbaisse ? <s></s> : ''}
            </span>
          }
        </TableRowColumn>
        <TableRowColumn>{round(parseInt(offre.recolteFond, 10) / 100, 2).toFixed(2)}</TableRowColumn>
        <TableRowColumn>{round(((offre.recolteFond + parseInt(offre.prix, 10)) * quantite) / 100, 2).toFixed(2)}</TableRowColumn>
      </TableRow>
    );
  }
}
