import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {
  makeSelectOffresDuProduit,
  makeSelectTypesProduitsByIds,
} from 'containers/Commande/selectors';
import { makeSelectPending } from 'containers/App/selectors';
import Offre from './Offre';
import OffreFormContainer from './OffreFormContainer';
import OffresTopBar from './OffresTopBar';
import styles from './styles.css';

const aucuneOffreCss = { backgroundColor: '#1565c0', color: 'white' };

class Offres extends Component {
  static propTypes = {
    offres: PropTypes.array.isRequired,
    typesProduits: PropTypes.object.isRequired,
    produit: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  state = {
    editMode: false,
    new: false,
    type: 'actives',
    itemEditIndex: null,
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.produit.id !== this.props.produit.id ||
      nextProps.pending !== this.props.pending
    ) {
      this.setState({ ...this.state, editMode: false });
    }
  }

  toggleState = itemEditIndex =>
    this.setState({
      ...this.state,
      editMode: !this.state.editMode,
      itemEditIndex,
      nouvelle: false,
    });

  createOffre = () =>
    this.setState({ ...this.state, editMode: true, nouvelle: true });

  render() {
    const { offres, typesProduits, produit, pending } = this.props;
    const { type, editMode, itemEditIndex, nouvelle } = this.state;

    if (!typesProduits) return null;

    const typeProduit = typesProduits[produit.typeProduitId];

    return (
      <div className="row center-md">
        {pending &&
          <div className="col-md">
            <div className={styles.loader}>
              <RefreshIndicator
                size={70}
                left={10}
                top={10}
                status="loading"
                style={{ display: 'inline-block', position: 'absolute' }}
              />
            </div>
          </div>}
        {!editMode &&
          !pending &&
          <div className="col-md-12">
            <OffresTopBar onNewOffer={this.createOffre} type={type} />
            <div className="row">
              <div className="col-md-12">
                {offres &&
                  offres
                    .filter(off => off.relaiId === null && !off.archive)
                    .slice()
                    .sort((o1, o2) => o1.active > o2.active)
                    .map((off, idx) =>
                      (<Offre
                        index={idx}
                        key={idx}
                        offre={off}
                        typeProduit={typeProduit}
                        handleToggeState={() => this.toggleState(idx)}
                      />)
                    )}
                {(!offres || !offres.length) &&
                  <Paper className={styles.aucuneOffre} style={aucuneOffreCss}>
                    Aucune offre pour ce produit
                  </Paper>}
              </div>
            </div>
          </div>}
        {editMode &&
          !nouvelle &&
          !pending &&
          <div style={{ padding: '2em' }} className="col-md-12">
            <OffreFormContainer
              offre={offres.filter(o => !o.relaiId)[itemEditIndex]}
              tva={produit.tva}
              handleToggeState={this.toggleState}
              quantiteUnite={typeProduit.quantiteUnite}
            />
          </div>}
        {editMode &&
          nouvelle &&
          !pending &&
          <div style={{ padding: '2em' }} className="col-md-12">
            <OffreFormContainer
              offre={{
                produitId: produit.id,
                relaiId: null,
                active: true,
                tarifications: [
                  {
                    qteMinRelais: 0,
                    prix: 100,
                  },
                ],
                poids: 1000000,
              }}
              tva={produit.tva}
              handleToggeState={this.toggleState}
              quantiteUnite={typeProduit.quantiteUnite}
            />
          </div>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: makeSelectOffresDuProduit(),
  typesProduits: makeSelectTypesProduitsByIds(),
  pending: makeSelectPending(),
});

export default connect(mapStateToProps)(Offres);
