import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import classnames from 'classnames';
import moment from 'moment';

import { loadCommandes } from 'containers/Commande/actions';
import { selectCommandesRelais, selectCommandeId } from 'containers/Commande/selectors';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object.isRequired,
    loadCommandes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    this.props.loadCommandes({ relaiId: this.props.params.relaiId });
  }

  render() {
    const { commandes, pushState, params } = this.props;
    if (!commandes) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <SelectableList value={location.pathname}>
            {Object.keys(commandes).map((key, idx) =>
              <ListItem
                key={idx}
                primaryText={commandes[key].noCommande}
                value={`/admin/relais/${params.relaiId}/commandes/${key}`}
                onClick={() => pushState(`/admin/relais/${params.relaiId}/commandes/${key}`)}
              />
            )}
          </SelectableList>
        </div>
        <div className={classnames('col-md-10', styles.panel)}>
          {this.props.children && React.cloneElement(this.props.children, { ...this.props })}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  commandes: selectCommandesRelais(),
  commandeId: selectCommandeId(),
});

const mapDispatchToProps = (dispatch) => ({
  loadCommandes: (query) => dispatch(loadCommandes(query)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelaisCommandes);
