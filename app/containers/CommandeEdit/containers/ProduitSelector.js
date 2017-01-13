import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
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

  navigateTo = (productId) => {
    const { commandeId, relaiId } = this.props.params;
    let { typeProduitId } = this.props.params;
    const { utilisateurId, allProduits } = this.props;
    if (typeProduitId === 'favoris') {
      typeProduitId = allProduits[productId].typeProduitId;
    }

    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}?utilisateurId=${utilisateurId}`);
  }

  handleChange = (event, index, value) => {
    const { commandeId, relaiId } = this.props.params;
    const { pushState, utilisateurId } = this.props;
    pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}?utilisateurId=${utilisateurId}`);
  }

  render() {
    const { typeProduits, produits, params, allProduits, auth } = this.props;
    const { typeProduitId, produitId } = params;
    const muiTheme = this.context.muiTheme;

    const listeProduits =
      typeProduitId !== 'favoris'
        ? produits
        : Object.keys(allProduits)
          .filter((id) => includes(auth.produitsFavoris, id))
          .map((id) => allProduits[id]);

    return (
      <div
        className={classnames('col-sm-4 col-lg-3 col-xs-12 col-md-4', styles.panelproduits)}
      >
        {typeProduits && typeProduits.length > 1 && <SelectField
          value={typeProduitId}
          onChange={this.handleChange}
          iconStyle={{ fill: 'black' }}
          underlineStyle={{ borderColor: 'black' }}
          style={{ width: '100%' }}
        >
          { typeProduits && typeProduits.map((type, index) => <MenuItem key={index} value={type.id} primaryText={type.nom} />)}
          {auth.produitsFavoris && auth.produitsFavoris.length > 0 && <Divider />}
          {auth.produitsFavoris && auth.produitsFavoris.length > 0 && <MenuItem key="favoris" value="favoris" primaryText="Produits favoris" />}
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

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
