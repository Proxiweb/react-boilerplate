import React, { Component, PropTypes } from 'react';
import Produit from './Produit';
import Offres from './Offres';
import ProduitFormContainer from './ProduitFormContainer';
import PhotoEditor from './PhotoEditor';

class AdminProduit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // null || produit || offre
      editView: props.params.produitId === 'new' ? 'produit' : null,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.params.produitId !== nextProps.params.produitId) {
      this.setState({ editView: nextProps.params.produitId === 'new' ? 'produit' : null });
    }
  }

  changeView = (editView) =>
    this.setState({ editView })

  render() {
    const { produit, params } = this.props;
    const { editView } = this.state;
    if (editView === 'produit') {
      const pdt = produit ||
        { nom: 'Nouveau produit',
          description: '<p>Le nouveau produit</p>',
          fournisseurId: params.fournisseurId,
        };
      return (
        <div className="row">
          <div className="col-md-4">
            {produit && <PhotoEditor produit={pdt} />}
          </div>
          <div className="col-md-8">
            <ProduitFormContainer produit={pdt} />
          </div>
        </div>);
    }

    return (
      <div className="row">
        <div className="col-md-3">
          <Produit
            produit={produit}
            setEditView={this.changeView}
          />
        </div>
        <div className="col-md-9">
          {editView === null && <Offres produit={produit} params={params} />}
          {editView === 'offre' &&
            <Offres produit={produit} params={params} />}
        </div>
      </div>);
  }
}

export default AdminProduit;
