import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import classnames from 'classnames';
import shader from 'shader';
import styles from './styles.css';
import {
  selectCommandeTypesProduits,
  selectCommandeProduitsByTypeProduit,
  selectProduits,
} from 'containers/Commande/selectors';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';

const constStyles = {
  iconBlack: {
    fill: 'black',
  },
  fullWidth: {
    width: '100%',
  },
  borderBlack: {
    borderColor: 'black',
  },
};

class ProduitSelector extends React.Component {
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    allProduits: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  getTypesProduitsMenuItems = (typeProduits, produitsFavoris) => {
    const menuItems = typeProduits.map((type, index) =>
      <MenuItem key={index} value={type.id} primaryText={type.nom} />
    );
    if (produitsFavoris && produitsFavoris.length) {
      menuItems.push(<Divider />);
      menuItems.push(<MenuItem key="favoris" value="favoris" primaryText="Produits favoris" />);
    }

    return menuItems;
  }

  handleChange = (event, index, value) => {
    const { commandeId, relaiId } = this.props.params;
    const { pushState, utilisateurId } = this.props;
    pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}?utilisateurId=${utilisateurId}`);
  }

  navigateTo = (productId) => {
    const { commandeId, relaiId } = this.props.params;
    let { typeProduitId } = this.props.params;
    const { utilisateurId, allProduits } = this.props;
    if (typeProduitId === 'favoris') {
      typeProduitId = allProduits[productId].typeProduitId;
    }

    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}?utilisateurId=${utilisateurId}`);
  }

  render() {
    const { typeProduits, produits, params, allProduits, auth } = this.props;
    const { typeProduitId, produitId } = params;
    const muiTheme = this.context.muiTheme;

    if (!produits) return null;
    const listeProduits =
      typeProduitId !== 'favoris'
        ? produits.filter((p) => p.enStock)
        : Object.keys(allProduits)
          .filter((id) => includes(auth.produitsFavoris, id))
          .map((id) => allProduits[id]);

    return (
      <div
        className={classnames('col-sm-4 col-lg-3 col-xs-12 col-md-4', styles.panelproduits)}
      >
        <Paper style={{ padding: '0 5px' }}>
          {typeProduits && (typeProduits.length > 1 || auth.produitsFavoris.length > 0) && <SelectField
            value={typeProduitId}
            onChange={this.handleChange}
            iconStyle={constStyles.iconBlack}
            underlineStyle={constStyles.borderBlack}
            style={constStyles.fullWidth}
          >
            {this.getTypesProduitsMenuItems(typeProduits, auth.produitsFavoris)}
          </SelectField>}
          {listeProduits && (
            <List className={`${styles[`produits${produits && produits.length > 10 ? 'Scr' : ''}`]}`}>
              {listeProduits.map((pdt, idx) => (
                <ListItem
                  key={idx}
                  onClick={() => this.navigateTo(pdt.id)}
                  className={styles.pdtSelected}
                  style={
                    produitId && pdt.id === produitId ?
                    { fontSize: '0.9em', borderLeft: `solid 5px ${muiTheme.appBar.color}`, backgroundColor: shader(muiTheme.appBar.color, +0.6) } :
                    { fontSize: '0.9em', borderLeft: 'none' }}
                >
                  {pdt.nom.toUpperCase()}
                </ListItem>
                ))}
            </List>
            )}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  allProduits: selectProduits(),
  auth: selectCompteUtilisateur(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
