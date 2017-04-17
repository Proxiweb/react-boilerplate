import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import CustomSelectField from 'components/CustomSelectField';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import classnames from 'classnames';
import shader from 'shader';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import styles from './styles.css';

import {
  selectCommandeTypesProduitsVisibles,
  selectCommandeProduitsByTypeProduit,
  selectProduits,
  selectFournisseursIds,
} from 'containers/Commande/selectors';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

class ProduitSelector extends React.Component {
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    allProduits: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    fournisseursIds: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    typeProduitSecondaire: null,
  };

  getTypesProduitsMenuItems = (typeProduits, produitsFavoris) => {
    const menuItems = typeProduits.map((type, index) => (
      <MenuItem key={index} value={type.id} primaryText={type.nom} />
    ));
    if (produitsFavoris && produitsFavoris.length) {
      menuItems.push(<Divider />);
      menuItems.push(<MenuItem key="favoris" value="favoris" primaryText="Produits favoris" />);
    }

    return menuItems;
  };

  handleChange = (event, index, value) => {
    const { commandeId, relaiId } = this.props.params;
    const { pushState, utilisateurId } = this.props;
    this.setState({ typeProduitSecondaire: null });
    pushState(
      `/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}?utilisateurId=${utilisateurId}`
    );
  };

  navigateTo = productId => {
    const { commandeId, relaiId } = this.props.params;
    let { typeProduitId } = this.props.params;
    const { utilisateurId, allProduits } = this.props;

    if (typeProduitId === 'favoris') {
      typeProduitId = allProduits[productId].typeProduitId;
    }

    this.props.pushState(
      `/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}?utilisateurId=${utilisateurId}`
    );
  };

  render() {
    const { typeProduits, produits, params, allProduits, auth, fournisseursIds } = this.props;
    const { typeProduitSecondaire } = this.state;
    const { typeProduitId, produitId } = params;
    const muiTheme = this.context.muiTheme;

    if (!produits) return null;
    let typesProduitsSecondaires = null;

    typesProduitsSecondaires = produits.find(p => p.typeProduitSecondaire !== null)
      ? uniq(produits.map(p => p.typeProduitSecondaire))
      : null;

    const listeProduits = typeProduitId !== 'favoris'
      ? produits.filter(p => p.enStock && fournisseursIds[p.fournisseurId].visible)
      : Object.keys(allProduits).filter(id => includes(auth.produitsFavoris, id)).map(id => allProduits[id]);

    const listeProduitsFiltred = listeProduits.filter(
      p =>
        p.enStock &&
        ((!typeProduitSecondaire && !typesProduitsSecondaires) ||
          p.typeProduitSecondaire === typeProduitSecondaire)
    );
    const listeProduitsFiltredGrp = groupBy(listeProduitsFiltred, 'typeProduitTernaire');

    return (
      <div className={classnames('col-sm-4 col-lg-3 col-xs-12 col-md-4', styles.panelproduits)}>
        <Paper style={{ padding: '0 5px' }}>
          {typeProduits &&
            (typeProduits.length > 1 || auth.produitsFavoris.length > 0) &&
            <CustomSelectField value={typeProduitId} onChange={this.handleChange} fullWidth>
              {this.getTypesProduitsMenuItems(typeProduits, auth.produitsFavoris)}
            </CustomSelectField>}
          {typesProduitsSecondaires &&
            <CustomSelectField
              value={typeProduitSecondaire}
              onChange={(event, index, value) => this.setState({ typeProduitSecondaire: value })}
              fullWidth
            >
              {typesProduitsSecondaires.map((val, index) => (
                <MenuItem key={index} value={val} primaryText={val} />
              ))}
            </CustomSelectField>}
          {listeProduits &&
            (!typesProduitsSecondaires || typesProduitsSecondaires.length === 0 || typeProduitSecondaire) &&
            <List className={`${styles[`produits${produits && produits.length > 10 ? 'Scr' : ''}`]}`}>
              {Object.keys(listeProduitsFiltredGrp).map((key, idx) => (
                <div key={idx}>
                  {Object.keys(listeProduitsFiltredGrp).length > 1 &&
                    <Subheader className={styles.subHeader}>{key}</Subheader>}
                  {listeProduitsFiltredGrp[key].map((pdt, idx2) => (
                    <ListItem
                      key={idx2}
                      onClick={() => this.navigateTo(pdt.id)}
                      className={styles.pdtSelected}
                      style={
                        produitId && pdt.id === produitId
                          ? {
                              fontSize: '0.9em',
                              borderLeft: `solid 5px ${muiTheme.appBar.color}`,
                              backgroundColor: shader(muiTheme.appBar.color, +0.6),
                            }
                          : { fontSize: '0.9em', borderLeft: 'none' }
                      }
                    >
                      {pdt.nom.toUpperCase()}
                    </ListItem>
                  ))}
                </div>
              ))}
            </List>}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduitsVisibles(),
  produits: selectCommandeProduitsByTypeProduit(),
  fournisseursIds: selectFournisseursIds(),
  allProduits: selectProduits(),
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
