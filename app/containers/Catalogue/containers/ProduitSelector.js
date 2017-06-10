import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import uniq from "lodash/uniq";
import { List, ListItem } from "material-ui/List";
import CustomSelectField from "components/CustomSelectField";
import Paper from "material-ui/Paper";
import MenuItem from "material-ui/MenuItem";
import classnames from "classnames";
import shader from "shader";
import styles from "./styles.css";

class ProduitSelector extends React.Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  };

  state = {
    typeProduitSecondaire: null
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.typeProduits === null && nextProps.typeProduits.length) {
      const { typeProduits, params } = nextProps;
      // sélectionner le premier produit du premier type
      const premierTypeProduit = typeProduits && typeProduits.length ? typeProduits[0] : null;
      if (premierTypeProduit) {
        this.props.pushState(`/catalogue/${params.relaiId}/typeProduits/${premierTypeProduit.id}`);
      }
    }
  };

  navigateTo = productId => {
    const { typeProduitId, relaiId } = this.props.params;
    this.props.pushState(`/catalogue/${relaiId}/typeProduits/${typeProduitId}/produits/${productId}`);
  };

  handleChange = (event, index, value) => {
    const { relaiId } = this.props.params;
    const { pushState } = this.props;
    this.setState({ typeProduitSecondaire: null });
    pushState(`/catalogue/${relaiId}/typeProduits/${value}`);
  };

  render() {
    const { typeProduits, produits, params } = this.props;
    const { typeProduitId, produitId } = params;
    const { typeProduitSecondaire } = this.state;
    const muiTheme = this.context.muiTheme;
    let typesProduitsSecondaires = null;

    if (produits) {
      typesProduitsSecondaires = produits.find(p => p.typeProduitSecondaire !== null)
        ? uniq(produits.map(p => p.typeProduitSecondaire))
        : null;
    }

    return (
      <Paper className={styles.panelproduitso}>
        {typeProduits &&
          Object.keys(typeProduits).length > 1 &&
          <CustomSelectField value={typeProduitId} onChange={this.handleChange} fullWidth>
            {typeProduits &&
              Object.keys(typeProduits).map((key, index) =>
                <MenuItem key={index} value={typeProduits[key].id} primaryText={typeProduits[key].nom} />
              )}
          </CustomSelectField>}
        {typesProduitsSecondaires &&
          <CustomSelectField
            value={typeProduitSecondaire}
            onChange={(event, index, value) => this.setState({ typeProduitSecondaire: value })}
            fullWidth
          >
            {typesProduitsSecondaires.map((val, index) =>
              <MenuItem key={index} value={val} primaryText={val} />
            )}
          </CustomSelectField>}
        {produits &&
          <List className={styles.produits}>
            {produits
              .filter(
                p =>
                  p.enStock &&
                  ((!typeProduitSecondaire && !typesProduitsSecondaires) ||
                    p.typeProduitSecondaire === typeProduitSecondaire)
              )
              .map((pdt, idx) =>
                <ListItem
                  key={idx}
                  onClick={() => this.navigateTo(pdt.id)}
                  className={styles.pdtSelected}
                  style={
                    produitId && pdt.id === produitId
                      ? {
                          borderLeft: `solid 5px ${muiTheme.appBar.color}`,
                          backgroundColor: shader(muiTheme.appBar.color, +0.6)
                        }
                      : { borderLeft: "none" }
                  }
                >
                  {pdt.nom.toUpperCase()}
                </ListItem>
              )}
          </List>}
      </Paper>
    );
  }
}

// const mapStateToProps = createStructuredSelector({
//   typeProduits: selectTypesProduitsRelais(),
//   produits: selectProduitsRelaisByTypeProduit(),
// });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ProduitSelector);
