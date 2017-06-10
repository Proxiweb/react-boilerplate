import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { List, ListItem, makeSelectable } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";
import PastilleIcon from "material-ui/svg-icons/image/brightness-1";
import IconButton from "material-ui/IconButton";
import Toggle from "material-ui/Toggle";
import { createStructuredSelector } from "reselect";
import { loadFournisseur } from "containers/AdminFournisseur/actions";
import {
  selectFournisseurs,
  selectProduits,
  selectOffres,
  selectTypesProduitsByIds
} from "containers/Commande/selectors";

import { loadFournisseurs, loadTypesProduits, importeOffres, saveOffre } from "containers/Commande/actions";

import ArchiveIcon from "material-ui/svg-icons/action/assignment-returned";
import styles from "./styles.css";

import OffreProduit from "./OffreProduit";
import FournisseurHebdoSwitch from "./FournisseurHebdoSwitch";
import ListeFournisseursRelais from "./ListeFournisseursRelais";

const SelectableList = makeSelectable(List);

class FournisseursRelais extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    loadF: PropTypes.func.isRequired,
    loadT: PropTypes.func.isRequired,
    importeOffres: PropTypes.func.isRequired,
    saveOffre: PropTypes.func.isRequired,
    fournisseurs: PropTypes.array,
    produits: PropTypes.object,
    params: PropTypes.object.isRequired,
    typesProduits: PropTypes.object,
    offres: PropTypes.object
  };

  state = {
    fournisseurSelected: null,
    produitSelected: null
  };

  componentDidMount = () => {
    const { relaiId, load, loadT } = this.props;
    load({ relaiId });
    loadT();
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.relaiId !== this.props.relaiId) {
      this.setState({
        fournisseurSelected: null,
        produitSelected: null
      });
      this.props.load(nextProps.relaiId);
    }
  };

  handleChangeFournisseur = (event, index, value) => {
    this.setState({ fournisseurSelected: value, produitSelected: null });
    this.props.loadF(value);
  };

  handleSelectProduit = (event, value) =>
    this.setState({
      ...this.state,
      produitSelected: value
    });

  handleImporterOffres = () => {
    const { produitSelected, fournisseurSelected } = this.state;
    const { relaiId: relaiDestinationId } = this.props.params;
    const msgSuccess = `Offre${!produitSelected ? "s" : ""} importée${!produitSelected ? "s" : ""}`;
    this.props.importeOffres(fournisseurSelected, produitSelected || null, relaiDestinationId, msgSuccess);
  };

  handleStore = offre => {
    if (confirm("Archiver définitivement ?")) {
      this.props.saveOffre({ ...offre, archive: true }, "Offre archivée");
    }
  };

  render() {
    const { fournisseurs, produits, offres: offresById, params, typesProduits } = this.props;
    const { fournisseurSelected, produitSelected } = this.state;
    const fournisseur = fournisseurSelected ? fournisseurs.find(f => f.id === fournisseurSelected) : null;

    const produitsFournisseur = fournisseurSelected && produits
      ? Object.keys(produits).map(k => produits[k]).filter(p => p.fournisseurId === fournisseurSelected)
      : [];

    const offres = offresById ? Object.keys(offresById).map(id => offresById[id]) : [];
    const offresProduit = produitSelected
      ? offres.filter(o => o.produitId === produitSelected && o.relaiId === params.relaiId && !o.archive)
      : [];

    return (
      <div className="row">
        <div className="col-md-4">
          {fournisseurs &&
            <ListeFournisseursRelais onChange={this.handleChangeFournisseur} relaiId={params.relaiId} />}

          {produitsFournisseur.length > 0 &&
            <SelectableList
              value={produitSelected}
              onChange={this.handleSelectProduit}
              className={styles.listePdts}
            >
              {produitsFournisseur.map((pdt, idx) =>
                <ListItem
                  key={idx}
                  primaryText={pdt.nom.toUpperCase()}
                  value={pdt.id}
                  leftIcon={
                    <PastilleIcon
                      color={
                        offres.find(o => o.produitId === pdt.id && o.active && o.relaiId === params.relaiId)
                          ? "green"
                          : "silver"
                      }
                    />
                  }
                />
              )}
            </SelectableList>}
        </div>
        <div className="col-md-8" style={{ marginTop: "2em" }}>
          {produits &&
            produits[produitSelected] &&
            <div className="row">
              <div className="col-md-4">
                <img
                  src={
                    produits[produitSelected].photo.search("http") !== -1
                      ? produits[produitSelected].photo
                      : `https://proxiweb.fr/${produits[produitSelected].photo}`
                  }
                  alt={produits[produitSelected].nom}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: 200,
                    border: "solid 1px gray"
                  }}
                />
              </div>
              <div className="col-md-8">
                <p
                  dangerouslySetInnerHTML={{
                    __html: produits[produitSelected].description
                  }} // eslint-disable-line
                />
              </div>
            </div>}
          {offresProduit.length > 0 &&
            typesProduits &&
            offresProduit
              .slice()
              .sort((o1, o2) => o1.active > o2.active)
              .map((o, idx) =>
                <OffreProduit
                  typeProduit={typesProduits[produits[produitSelected].typeProduitId]}
                  key={idx}
                  handleStore={this.handleStore}
                  offre={o}
                />
              )}
          {produitSelected &&
            (offresProduit.length === 0 || offresProduit.filter(o => o.active).length === 0) &&
            <div className="row center-md">
              <div className="col-md-6">
                <RaisedButton
                  primary
                  label="Importer l'offre"
                  fullWidth
                  onClick={this.handleImporterOffres}
                />
              </div>
            </div>}
          {!produitSelected &&
            fournisseurSelected &&
            <FournisseurHebdoSwitch
              fournisseurId={fournisseurSelected}
              params={params}
              fournisseur={fournisseur.nom.toUpperCase()}
            />}
          {!produitSelected &&
            fournisseurSelected &&
            offresProduit.length === 0 &&
            // offresProduit.filter(o => o.active).length === 0 &&
            <div className="row center-md" style={{ marginTop: "1em" }}>
              <div className="col-md-6">
                <RaisedButton
                  primary
                  label="Importer toutes les offres"
                  fullWidth
                  onClick={this.handleImporterOffres}
                />
              </div>
            </div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseurs(),
  produits: selectProduits(),
  typesProduits: selectTypesProduitsByIds(),
  offres: selectOffres()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadFournisseurs,
      loadF: loadFournisseur,
      loadT: loadTypesProduits,
      importeOffres,
      saveOffre: (offre, msg) => saveOffre(offre, msg)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(FournisseursRelais);
