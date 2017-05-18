import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import ProduitSelector from './containers/ProduitSelector';
import DetailOffres from './containers/DetailOffres';
import TexteCatalogue from './containers/TexteCatalogue';

import { loadFournisseurs } from 'containers/Commande/actions';
import {
  selectProduitsRelaisByTypeProduit,
  selectTypesProduitsRelais,
} from 'containers/Commande/selectors';

import { selectPending } from 'containers/App/selectors';

class Catalogue extends Component { // eslint-disable-line
  static propTypes = {
    pending: PropTypes.bool.isRequired,
    typeProduits: PropTypes.array,
    produits: PropTypes.array,
    params: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { load, params } = this.props;
    const { relaiId } = params;
    load({ relaiId, jointures: true });
  }

  render() {
    const { typeProduits, produits, params, pending } = this.props;
    const { produitId } = params;
    return (
      <div className="row center-md">
        <div className="col-md-4">
          {!pending && <ProduitSelector
            produits={produits}
            typeProduits={typeProduits}
            params={this.props.params}
          />}
        </div>
        <div className="col-md-6">
          {produitId && <DetailOffres params={this.props.params} />}
          {!produitId && <TexteCatalogue params={this.props.params} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  typeProduits: selectTypesProduitsRelais(),
  produits: selectProduitsRelaisByTypeProduit(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadFournisseurs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
