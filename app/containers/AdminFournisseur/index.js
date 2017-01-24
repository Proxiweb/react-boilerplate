import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import { selectFournisseurProduits } from 'containers/Commande/selectors';
import { loadTypesProduits } from 'containers/Commande/actions';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CatalogueFournisseur extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    loadTypes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
    produits: PropTypes.array,
  }

  componentDidMount() {
    this.props.load(this.props.params.fournisseurId);
    this.props.loadTypes();
  }

  handleChangeList = (event, produitId) =>
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/catalogue/${produitId}`
    );

  handleNewProduct = () =>
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/catalogue/new`
    );

  render() {
    const { produits, params } = this.props;
    if (!produits) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <div className="row end-md">
            <div className="col-md-1" style={{ marginRight: '1em' }}>
              <IconButton
                style={{ padding: 0, width: '27px', height: '27px' }}
                tooltip="Nouveau produit"
                onClick={this.handleNewProduct}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
          <SelectableList value={params.produitId} onChange={this.handleChangeList}>
            {produits
              .sort((pdt1, pdt2) => pdt1.nom > pdt2.nom)
              .map((pdt, idx) =>
                <ListItem
                  key={idx}
                  primaryText={pdt.nom.toUpperCase()}
                  value={pdt.id}
                  style={{ color: pdt.enStock ? 'black' : 'gray' }}
                />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-9', styles.panel)}>
          {this.props.children && React.cloneElement(this.props.children, { produit: produits.find((pdt) => pdt.id === params.produitId), params })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  produits: selectFournisseurProduits(),
});

const mapDispatchToProps = (dispatch) => ({
  load: (id) => dispatch(loadFournisseur(id)),
  loadTypes: (id) => dispatch(loadTypesProduits(id)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueFournisseur);
