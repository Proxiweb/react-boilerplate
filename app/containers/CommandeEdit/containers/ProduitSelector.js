import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import classnames from 'classnames';
import shader from 'shader';
import styles from './styles.css';
import {
  selectCommandeTypesProduits,
  selectCommandeProduitsByTypeProduit,
} from 'containers/Commande/selectors';

class ProduitSelector extends React.Component {
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    pushState: PropTypes.func.isRequired,
    setPanierState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    params: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  navigateTo = (productId) => {
    const { commandeId, typeProduitId, relaiId } = this.props.params;
    const { utilisateurId } = this.props;
    this.props.setPanierState(false);
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${productId}?utilisateurId=${utilisateurId}`);
  }

  handleChange = (event, index, value) => {
    const { commandeId, relaiId } = this.props.params;
    const { setPanierState, pushState } = this.props;
    setPanierState(true);
    pushState(`/relais/${relaiId}/commandes/${commandeId}/typeProduits/${value}`);
  }

  render() {
    const { typeProduits, produits, params } = this.props;
    const { typeProduitId, produitId } = params;
    const muiTheme = this.context.muiTheme;

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
        </SelectField>}
        {produits && (
          <List className={`${styles[`produits${produits && produits.length > 10 ? 'Scr' : ''}`]}`}>
            {produits.map((pdt, idx) => (
              <ListItem
                key={idx}
                onClick={() => this.navigateTo(pdt.id)}
                className={styles.pdtSelected}
                style={
                  produitId && pdt.id === produitId ?
                  { borderLeft: `solid 5px ${muiTheme.appBar.color}`, backgroundColor: shader(muiTheme.appBar.color, +0.6) } :
                  { borderLeft: 'none' }}
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
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
