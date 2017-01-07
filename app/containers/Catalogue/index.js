import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ProduitSelector from './containers/ProduitSelector';

class Catalogue extends Component { // eslint-disable-line
  static propTypes = {
    params: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <ProduitSelector params={this.props.params} />
        </div>
        <div className="col-md-8">
          <h1>Catalogue</h1>
        </div>
      </div>
    );
  }
}

export default connect()(Catalogue);
