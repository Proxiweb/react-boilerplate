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

class Catalogue extends Component {
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

  handleChangeList = (event, value) =>
    this.props.pushState(value);

  render() {
    const { produits, params } = this.props;
    if (!produits) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <SelectableList value={location.pathname} onChange={this.handleChangeList}>
            {produits.map((pdt, idx) =>
              <ListItem
                key={idx}
                primaryText={pdt.nom}
                value={`/fournisseurs/${params.fournisseurId}/catalogue/${pdt.id}`}
              />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-10', styles.panel)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
