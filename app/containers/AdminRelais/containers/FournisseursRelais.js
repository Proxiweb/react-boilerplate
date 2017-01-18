import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import PastilleIcon from 'material-ui/svg-icons/image/brightness-1';
import Toggle from 'material-ui/Toggle';
import { createStructuredSelector } from 'reselect';
import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import {
  selectFournisseurs,
  selectProduits,
  selectOffres,
  selectTypesProduitsByIds,
} from 'containers/Commande/selectors';

import {
  loadFournisseurs,
  loadTypesProduits,
} from 'containers/Commande/actions';

import styles from './styles.css';

import OffreDetailsCard from 'components/OffreDetailsCard';

const SelectableList = makeSelectable(List);

class FournisseursRelais extends Component {
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
    load: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired,
    loadT: PropTypes.func.isRequired,
    fournisseurs: PropTypes.array.isRequired,
    produits: PropTypes.object,
    params: PropTypes.object.isRequired,
    typesProduits: PropTypes.object.isRequired,
    offres: PropTypes.object,
  }

  state = {
    fournisseurSelected: null,
    produitSelected: null,
  }

  componentDidMount = () => {
    const { relaiId, load, loadT } = this.props;
    load({ relaiId });
    loadT();
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.relaiId !== this.props.relaiId) {
      this.setState({
        fournisseurSelected: null,
        produitSelected: null,
      });
      this.props.load(nextProps.relaiId);
    }
  }

  handleChangeFournisseur = (event, index, value) => {
    this.setState({ fournisseurSelected: value });
    this.props.loadF(value);
  }

  handleSelectProduit = (event, value) =>
    this.setState({
      ...this.state,
      produitSelected: value,
    })

  render() {
    const { fournisseurs, produits, offres: offresById, params, typesProduits } = this.props;
    const { fournisseurSelected, produitSelected } = this.state;
    const produitsFournisseur = fournisseurSelected && produits
                                ? Object.keys(produits)
                                    .map((k) => produits[k])
                                    .filter((p) => p.fournisseurId === fournisseurSelected)
                                : [];

    const offres = offresById ? Object.keys(offresById).map((id) => offresById[id]) : [];
    const offresProduit = produitSelected
                          ? offres.filter((o) => {
                            console.log(o);
                            return o.produitId === produitSelected &&
                              o.relaiId === params.relaiId
                          }
                            )
                          : [];
    console.log(offresProduit);
    return (
      <div className="row">
        <div className="col-md-4">
          {fournisseurs && fournisseurs.length > 0 &&
            <SelectField
              fullWidth
              value={fournisseurSelected}
              onChange={this.handleChangeFournisseur}
            >
              {fournisseurs.map((data) =>
                <MenuItem key={data.id} value={data.id} primaryText={data.nom.toUpperCase()} />
              )}
            </SelectField>
          }
          { produitsFournisseur.length > 0 &&
            <SelectableList value={produitSelected} onChange={this.handleSelectProduit} className={styles.listePdts}>
              {produitsFournisseur
                .map((pdt, idx) =>
                  <ListItem
                    key={idx}
                    primaryText={pdt.nom.toUpperCase()}
                    value={pdt.id}
                    leftIcon={
                      <PastilleIcon
                        color={
                          offres.find((o) =>
                              o.produitId === pdt.id &&
                              o.active &&
                              o.relaiId === params.relaiId
                            )
                          ? 'green'
                          : 'silver'
                        }
                      />
                    }
                  />
              )}
            </SelectableList>
          }
        </div>
        <div className="col-md-8" style={{ marginTop: '2em' }}>
          {offresProduit.length > 0 && typesProduits &&
            offresProduit
            .sort((o1, o2) => o1.active > o2.active)
            .map((o, idx) =>
              <div className={`row ${styles.offre}`}>
                <div className="col-md-8">
                  <OffreDetailsCard
                    key={idx}
                    offre={o}
                    showSubtitle={false}
                    typeProduit={typesProduits[produits[produitSelected].typeProduitId]}
                  />
                </div>
                <div className="col-md-1">
                  <Toggle
                    label={o.active ? 'active' : 'inactive'}
                    className={styles.toggle}
                    toggled={o.active}
                  />
                </div>
              </div>
            )
          }
          {produitSelected && offresProduit.length === 0 &&
            <div className="row center-md">
              <div className="col-md-6">
                <RaisedButton
                  primary
                  label="Importer l'offre"
                  fullWidth
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseurs(),
  produits: selectProduits(),
  typesProduits: selectTypesProduitsByIds(),
  offres: selectOffres(),
});

const mapDispatchToProps = (dispatch) => ({
  load: (relaisId) => dispatch(loadFournisseurs(relaisId)),
  loadF: (id) => dispatch(loadFournisseur(id)),
  loadT: () => dispatch(loadTypesProduits()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FournisseursRelais);