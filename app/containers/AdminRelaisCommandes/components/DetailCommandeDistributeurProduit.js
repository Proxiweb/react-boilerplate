import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import buildCommandeRow from 'components/DetailCommandeColumns';

import { supprimerCommandeContenu, diminuerCommandeContenu } from 'containers/Commande/actions';

import styles from './styles.css';
// eslint-disable-next-line
class CommnandeParProduitFournisseur extends Component {
  static propTypes = {
    contenu: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
    qteTotalOffre: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
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
    } = this.props;

    const tarif = trouveTarification(offre.tarifications, qteTotalOffre, 0);
    const rows = buildCommandeRow({
      contenu,
      idx,
      offre,
      colorTrendingDown: null,
      tarif,
      produit,
      vueDistributeur: true, // vue distributeur
    });

    return (
      <TableRow key={idx}>
        {rows}
      </TableRow>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      diminuer: diminuerCommandeContenu,
      supprimer: supprimerCommandeContenu,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(CommnandeParProduitFournisseur);
