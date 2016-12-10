import React, { Component, PropTypes } from 'react';
import Produit from './Produit';
import Offres from './Offres';

class AdminProduit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  state = {
    editView: false,
  }

  render() {
    const { produit, params } = this.props;
    return (
      <div className="row">
        <div className="col-md-4">
          <Produit produit={produit} />
        </div>
        <div className="col-md-8">
          <Offres produit={produit} params={params} />
        </div>
      </div>);
  }
}

export default AdminProduit;
