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
    new: false,
    type: 'actives',
    itemEditIndex: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.produit.id !== this.props.produit.id) {
      this.setState({ ...this.state, editMode: false });
    }
  }

  toggleState = (itemEditIndex) =>
    this.setState({
      ...this.state,
      editMode: !this.state.editMode,
      itemEditIndex,
      nouvelle: false,
    })

  createOffre = () =>
    this.setState({ ...this.state, editMode: true, nouvelle: true })

  render() {
    const { offres, typesProduits, produit } = this.props;
    const { type, editMode, itemEditIndex, nouvelle } = this.state;

    if (!offres || !typesProduits) return null;

    const typeProduit = typesProduits[produit.typeProduitId];
    return (
      <div className="row">
        {!editMode && (
          <div className="col-md-12">
            <OffresTopBar onNewOffer={this.createOffre} type={type} />
            <div className="row">
              <div className="col-md-12">
                {offres
                  .filter((off) => off.relaiId === null)
                  .slice().sort((o1, o2) => o1.active > o2.active)
                  .map((off, idx) => (
                    <Offre
                      index={idx}
                      offre={off}
                      typeProduit={typeProduit}
                      handleToggeState={() => this.toggleState(idx)}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}
        {editMode && !nouvelle && (
          <div style={{ padding: '2em' }} className="col-md-12">
            <OffreFormContainer
              offre={offres[itemEditIndex]}
              tva={produit.tva}
              handleToggeState={this.toggleState}
            />
          </div>
        )}
        {editMode && nouvelle && (
          <div style={{ padding: '2em' }} className="col-md-12">
            <OffreFormContainer
              offre={{
                produitId: produit.id,
                relaiId: null,
                active: true,
                tarifications: [{
                  qteMinRelais: 0,
                  prix: 100,
                }],
                poids: 10000,
              }}
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
