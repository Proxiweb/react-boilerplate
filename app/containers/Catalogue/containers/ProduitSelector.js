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
  selectTypesProduits,
  selectCommandeProduitsByTypeProduit,
} from 'containers/Commande/selectors';

class ProduitSelector extends React.Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    params: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  navigateTo = (productId) => {
    const { typeProduitId, relaiId } = this.props.params;
    this.props.pushState(`/catalogue/${relaiId}/typeProduits/${typeProduitId}/produits/${productId}`);
  }

  handleChange = (event, index, value) => {
    const { relaiId } = this.props.params;
    const { pushState } = this.props;
    pushState(`/catalogue/${relaiId}/typeProduits/${value}`);
  }

  render() {
    const { typeProduits, produits, params } = this.props;
    const { typeProduitId, produitId } = params;
    const muiTheme = this.context.muiTheme;

    return (
      <div
        className={classnames('col-sm-4 col-lg-3 col-xs-12 col-md-4', styles.panelproduits)}
      >
        {typeProduits && Object.keys(typeProduits).length > 1 && <SelectField
          value={typeProduitId}
          onChange={this.handleChange}
          iconStyle={{ fill: 'black' }}
          underlineStyle={{ borderColor: 'black' }}
          style={{ width: '100%' }}
        >
          { typeProduits && Object.keys(typeProduits).map((key, index) => <MenuItem key={index} value={typeProduits[key].id} primaryText={typeProduits[key].nom} />)}
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
  typeProduits: selectTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
