import React, { Component, PropTypes } from 'react';
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
import { selectFournisseurProduits, selectFournisseurs } from 'containers/Commande/selectors';
import { selectPending } from 'containers/App/selectors';
import { loadTypesProduits } from 'containers/Commande/actions';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CatalogueFournisseur extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    loadTypes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    fournisseurs: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
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
    const { produits, params: { fournisseurId, produitId }, pending } = this.props;
    if (!produits) return null;
    return (
      <Paper>
        <div className="row">
          <div className={classnames('col-md-3', styles.panel, styles.listePdt)}>
            {
              (
                <FloatingActionButton
                  mini="true"
                  className={styles.addPdt}
                  tooltip="Nouveau produit"
                  onClick={this.handleNewProduct}
                >
                  <AddIcon />
                </FloatingActionButton>
              )
            }
            {produits.length > 0 &&
              <SelectableList
                value={produitId}
                onChange={this.handleChangeList}
                className={styles.listePdt}
              >
                {produits
                  .slice()
                  .sort((pdt1, pdt2) => pdt1.nom > pdt2.nom)
                  .map((pdt, idx) => (
                    <ListItem
                      key={idx}
                      primaryText={pdt.nom.toUpperCase()}
                      value={pdt.id}
                      style={{ color: pdt.enStock ? 'black' : 'gray' }}
                    />
                  ))}
              </SelectableList>}
          </div>
          <div className={classnames('col-md-9', styles.panel)}>
            {this.props.children &&
              React.cloneElement(this.props.children, {
                produit: produits.find(pdt => pdt.id === produitId),
                params,
                fournisseur: fournisseurs[fournisseurId],
              })}
          </div>
        </div>
      </Paper>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  produits: selectFournisseurProduits(),
  fournisseurs: selectFournisseurs(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    load: loadFournisseur,
    loadTypes: loadTypesProduits,
    pushState: push,
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueFournisseur);
