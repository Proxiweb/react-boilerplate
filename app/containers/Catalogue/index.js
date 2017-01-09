import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ProduitSelector from './containers/ProduitSelector';
import DetailOffres from './containers/DetailOffres';
import TexteCatalogue from './containers/TexteCatalogue';

import { loadFournisseurs } from 'containers/Commande/actions';

class Catalogue extends Component { // eslint-disable-line
  static propTypes = {
    params: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { load, params } = this.props;
    const { relaiId } = params;
    load({ relaiId, jointures: true });
  }

  render() {
    const { produitId } = this.props.params;
    return (
      <div className="row center-md">
        <div className="col-md-4">
          <ProduitSelector params={this.props.params} />
        </div>
        <div className="col-md-6">
          {produitId && <DetailOffres params={this.props.params} />}
          {!produitId && <TexteCatalogue params={this.props.params} />}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  load: (query) => dispatch(loadFournisseurs(query)),
});

export default connect(null, mapDispatchToProps)(Catalogue);
