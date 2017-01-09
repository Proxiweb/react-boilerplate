import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import uniq from 'lodash/uniq';
import { List, ListItem } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import classnames from 'classnames';
import shader from 'shader';
import styles from './styles.css';
import {
  selectProduitsRelaisByTypeProduit,
  selectTypesProduitsRelais,
} from 'containers/Commande/selectors';

class ProduitSelector extends React.Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array,
    produits: PropTypes.array,
    params: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    typeProduitSecondaire: null,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.typeProduits === null && nextProps.typeProduits.length) {
      const { typeProduits, params } = nextProps;
      // sélectionner le premier produit du premier type
      const premierTypeProduit = typeProduits && typeProduits.length ? typeProduits[0] : null;
      if (premierTypeProduit) {
        this.props.pushState(
          `/catalogue/${params.relaiId}/typeProduits/${premierTypeProduit.id}`
        );
      }
    }
  }

  navigateTo = (productId) => {
    const { typeProduitId, relaiId } = this.props.params;
    this.props.pushState(`/catalogue/${relaiId}/typeProduits/${typeProduitId}/produits/${productId}`);
  }

  handleChange = (event, index, value) => {
    const { relaiId } = this.props.params;
    const { pushState } = this.props;
    this.setState({ typeProduitSecondaire: null });
    pushState(`/catalogue/${relaiId}/typeProduits/${value}`);
  }

  render() {
    const { typeProduits, produits, params } = this.props;
    const { typeProduitId, produitId } = params;
    const { typeProduitSecondaire } = this.state;
    const muiTheme = this.context.muiTheme;
    let typesProduitsSecondaires = null;

    if (produits) {
      typesProduitsSecondaires = produits.find((p) => p.typeProduitSecondaire !== null)
        ? uniq(produits.map((p) => p.typeProduitSecondaire))
        : null;
    }

    return (
      <div className="row">
        <div
          className={classnames('col-sm-4 col-lg-12 col-xs-12 col-md-4', styles.panelproduits)}
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
          {typesProduitsSecondaires && <SelectField
            value={typeProduitSecondaire}
            onChange={(event, index, value) => this.setState({ typeProduitSecondaire: value })}
            iconStyle={{ fill: 'black' }}
            underlineStyle={{ borderColor: 'black' }}
            style={{ width: '100%' }}
          >
            { typesProduitsSecondaires.map((val, index) =>
              <MenuItem key={index} value={val} primaryText={val} />)
            }
          </SelectField>}
          {produits && (
            <List className={`${styles[`produits${produits && produits.length > 10 ? 'Scr' : ''}`]}`}>
              {produits
                .filter((p) =>
                  p.enStock &&
                  ((!typeProduitSecondaire && !typesProduitsSecondaires) ||
                  p.typeProduitSecondaire === typeProduitSecondaire)
                )
                .map((pdt, idx) => (
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
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectTypesProduitsRelais(),
  produits: selectProduitsRelaisByTypeProduit(),
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProduitSelector);
