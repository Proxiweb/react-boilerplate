import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toggle from 'material-ui/Toggle';

import { saveProduit } from 'containers/Commande/actions';

import ProduitFormContainer from './ProduitFormContainer';
import PhotoEditor from './PhotoEditor';
import Produit from './Produit';
import Offres from './Offres';
import classnames from 'classnames';
import styles from './styles.css';

class AdminProduit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // null || produit || offre
      editView: props.params.produitId === 'new' ? 'produit' : null,
    };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.params.produitId !== nextProps.params.produitId) {
      this.setState({
        editView: nextProps.params.produitId === 'new' ? 'produit' : null,
      });
    }
  };

  changeView = editView => this.setState({ editView });

  toggleStock = () => {
    const { produit } = this.props;
    this.props.save({ ...produit, enStock: !produit.enStock }, null);
  };

  render() {
    const { produit, params, fournisseur: { typeProduitSecondaireDefault, typeProduitDefault } } = this.props;
    const { editView } = this.state;

    if (editView === 'produit') {
      const pdt = produit || {
        nom: 'Nouveau produit',
        description: '<p>Le nouveau produit</p>',
        fournisseurId: params.fournisseurId,
        typeProduitId: typeProduitDefault,
        typeProduitSecondaire: typeProduitSecondaireDefault,
      };
      return (
        <div className="row">
          <div className={classnames('col-md-4', styles.pdtInfo)}>
            {produit && <PhotoEditor produit={pdt} />}
          </div>
          <div className={classnames('col-md-8', styles.pdtInfo)}>
            <ProduitFormContainer produit={pdt} />
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.pdtInfo)}>
          <Produit produit={produit} setEditView={this.changeView} />
          <Toggle
            toggled={produit.enStock}
            label={produit.enStock ? 'En stock' : 'Non disponible'}
            className={styles.toggleStock}
            onToggle={this.toggleStock}
          />
        </div>
        <div className={classnames('col-md-9', styles.offreInfo)}>
          {editView === null && <Offres produit={produit} params={params} />}
          {editView === 'offre' && <Offres produit={produit} params={params} />}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      save: saveProduit,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(AdminProduit);
