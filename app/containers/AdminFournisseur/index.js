import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import classnames from 'classnames';

import { loadFournisseur } from 'containers/AdminFournisseur/actions';
import { selectFournisseurProduits } from 'containers/Commande/selectors';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class CatalogueFournisseur extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
    produits: PropTypes.array,
  }

  componentDidMount() {
    this.props.load(this.props.params.fournisseurId);
  }

  handleChangeList = (event, produitId) =>
    this.props.pushState(
      `/fournisseurs/${this.props.params.fournisseurId}/catalogue/${produitId}`
    );

  crop = (args) =>
    console.log(args);

  render() {
    const { produits, params } = this.props;
    if (!produits) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-3', styles.panel)}>
          <SelectableList value={params.produitId} onChange={this.handleChangeList}>
            {produits
              .sort((pdt1, pdt2) => pdt1.nom > pdt2.nom)
              .map((pdt, idx) =>
                <ListItem
                  key={idx}
                  primaryText={pdt.nom.toUpperCase()}
                  value={pdt.id}
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
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueFournisseur);
