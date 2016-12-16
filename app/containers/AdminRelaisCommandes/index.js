import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import classnames from 'classnames';

import { loadCommandes } from 'containers/Commande/actions';
import { selectCommandesRelais, selectCommandeId } from 'containers/Commande/selectors';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AddIcon from 'material-ui/svg-icons/content/add';

import styles from './styles.css';

const SelectableList = makeSelectable(List);

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    loadCommandes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    this.props.loadCommandes({ relaiId: this.props.params.relaiId });
  }

  newCommande = () => {
    this.props.pushState(`/admin/relais/${this.props.params.relaiId}/commandes/nouvelle`);
  }

  render() {
    const { commandes, pushState, params, commandeId } = this.props;
    if (!commandes) return null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <div style={{ textAlign: 'center' }}>
            <IconButton
              style={{ padding: 0, width: '27px', height: '27px' }}
              tooltip="Nouvelle commande"
              onClick={this.newCommande}
            >
              <AddIcon />
            </IconButton>
          </div>
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
        <div
          className={
            classnames(
              'col-md-10',
              styles.panel,
              { [styles.nouvelleCommande]: !commandeId },
              { [styles.noScroll]: !commandeId },
            )
          }
        >
          {this.props.children && React.cloneElement(this.props.children, { commandes, commandeId, params })}
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
