import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import { selectFournisseurProduits, selectFournisseur } from 'containers/Commande/selectors';
import { makeSelectPending } from 'containers/App/selectors';
import { loadTypesProduits } from 'containers/Commande/actions';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CatalogueFournisseur extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    loadTypes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    fournisseur: PropTypes.object.isRequired,
    children: PropTypes.node,
    produits: PropTypes.array,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.load(this.props.params.fournisseurId);
    this.props.loadTypes();
  }

  handleChangeList = (event, produitId) =>
    this.props.pushState(`/fournisseurs/${this.props.params.fournisseurId}/catalogue/${produitId}`);

  handleNewProduct = () =>
    this.props.pushState(`/fournisseurs/${this.props.params.fournisseurId}/catalogue/new`);

  render() {
    const { produits, params, pending, fournisseur } = this.props;
    if (!produits) return null;
    return (
      <Paper>
        <div className="row">
          <div className={classnames('col-md-3', styles.panel, styles.listePdt)}>
            {
              <FloatingActionButton
                mini="true"
                className={styles.addPdt}
                tooltip="Nouveau produit"
                onClick={this.handleNewProduct}
              >
                <AddIcon />
              </FloatingActionButton>
            }
            {produits.length > 0 &&
              <SelectableList
                value={params.produitId}
                onChange={this.handleChangeList}
                className={styles.listePdt}
              >
                {produits
                  .slice()
                  .sort((pdt1, pdt2) => pdt1.nom > pdt2.nom)
                  .map((pdt, idx) =>
                    <ListItem
                      key={idx}
                      primaryText={pdt.nom.toUpperCase()}
                      value={pdt.id}
                      style={{ color: pdt.enStock ? 'black' : 'gray' }}
                    />
                  )}
              </SelectableList>}
          </div>
          <div className={classnames('col-md-9', styles.panel)}>
            {this.props.children &&
              React.cloneElement(this.props.children, {
                produit: produits.find(pdt => pdt.id === params.produitId),
                params,
                fournisseur,
              })}
          </div>
        </div>
      </Paper>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  produits: selectFournisseurProduits(),
  fournisseur: selectFournisseur(),
  pending: makeSelectPending(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadFournisseur,
      loadTypes: loadTypesProduits,
      pushState: push,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueFournisseur);
