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

  state = {
    // produit || offre || null
    editView: null,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.params.produitId !== nextProps.params.produitId) {
      this.setState({ editView: null });
    }
  }

  changeView = (editView) =>
    this.setState({ editView })

  render() {
    const { produit, params } = this.props;
    const { editView } = this.state;

    if (editView === 'produit') {
      return (
        <div className="row">
          <div className="col-md-3">
            <PhotoEditor produit={produit} />
          </div>
          <div className="col-md-9">
            <ProduitFormContainer produit={produit} />
          </div>
        </div>);
    }

    return (
      <div className="row">
        <div className="col-md-4">
          <Produit
            produit={produit}
            setEditView={this.changeView}
          />
        </div>
        <div className="col-md-8">
          {editView === null && <Offres produit={produit} params={params} />}
          {editView === 'offre' &&
            <Offres produit={produit} params={params} />}
        </div>
      </div>);
  }
}

export default AdminProduit;
