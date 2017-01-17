import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectOffresDuProduit,
  selectTypesProduitsByIds,
} from 'containers/Commande/selectors';

import Offre from './Offre';
import OffreFormContainer from './OffreFormContainer';
import OffresTopBar from './OffresTopBar';

class Offres extends Component {
  static propTypes = {
    offres: PropTypes.array.isRequired,
    typesProduits: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
  }

  state = {
    editMode: false,
    type: 'actives',
    itemEditIndex: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.produit.id !== this.props.produit.id) {
      this.setState({ ...this.state, editMode: false });
    }
  }

  handleTypeChange = (event, value) => this.setState({ ...this.state, type: value })

  toggleState = (idx) => this.setState({ editMode: !this.state.editMode, itemEditIndex: idx })

  render() {
    const { offres, typesProduits, produit } = this.props;
    const { type, editMode, itemEditIndex } = this.state;

    if (!offres || !typesProduits) return null;
    const offresFltr = offres.filter((off) => off.active === (type === 'actives'));
    const typeProduit = typesProduits[produit.typeProduitId];
    return (
      <div className="row">
        {!editMode && (
          <div className="col-md-12">
            <OffresTopBar onChangeType={this.handleTypeChange} onNewOffer={null} type={type} />
            <div className="row">
              <div className="col-md-12">
                {offresFltr.map((off, idx) => (
                  <Offre
                    index={idx}
                    offre={off}
                    typeProduit={typeProduit}
                    handleToggeState={() => this.toggleState(idx)}
                  />))}
              </div>
            </div>
          </div>
        )}
        {editMode && (
          <div style={{ padding: '2em' }} className="col-md-12">
            <OffreFormContainer
              offre={offres[itemEditIndex]}
              tva={produit.tva}
              handleToggeState={this.toggleState}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: selectOffresDuProduit(),
  typesProduits: selectTypesProduitsByIds(),
});

export default connect(mapStateToProps)(Offres);
