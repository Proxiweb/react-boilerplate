import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import classnames from 'classnames';

import {
  loadCommandes,
  loadFournisseurs,
  loadUtilisateurs,
  loadRelais,
} from 'containers/Commande/actions';
import { selectCommandesRelais, selectCommandeId, selectRelaisSelected } from 'containers/Commande/selectors';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import RemoveIcon from 'material-ui/svg-icons/action/delete-forever';

import moment from 'moment';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

class AdminRelaisCommandes extends Component {
  static propTypes = {
    commandes: PropTypes.object,
    relais: PropTypes.object,
    commandeId: PropTypes.string,
    loadCommandes: PropTypes.func.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    loadUtilisateurs: PropTypes.func.isRequired,
    loadRelais: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    const { relaiId } = this.props.params;
    if (!this.props.relais) {
      this.props.loadRelais();
    }
    this.props.loadCommandes({ relaiId });
    this.props.loadFournisseurs();
    this.props.loadUtilisateurs({ relaiId });
  }

  newCommande = () => {
    this.props.pushState(`/admin/relais/${this.props.params.relaiId}/commandes/nouvelle`);
  }

  editCommande = () => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/edit`);
  }

  removeCommande = () => {

  }

  handleChangeList = (event, value) => {
    const { relaiId, action } = this.props.params;
    this.props.pushState(`/admin/relais/${relaiId}/commandes/${value}${action === 'edit' ? '/edit' : ''}`);
  }

  render() {
    const { commandes, params, relais } = this.props;
    const { action, commandeId } = params;
    if (!commandes) return null;
    const commande = commandes ? commandes[commandeId] : null;
    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <div style={{ textAlign: 'center' }}>
            {!commandeId && !action && <IconButton
              style={{ padding: 0, width: '27px', height: '27px' }}
              tooltip="Nouvelle commande"
              onClick={this.newCommande}
            >
              <AddIcon />
            </IconButton>}
            {commandeId && !action && <IconButton
              style={{ padding: 0, width: '27px', height: '27px' }}
              tooltip="Modifier la commande"
              onClick={this.editCommande}
            >
              <EditIcon />
            </IconButton>}
            {commandeId && action === 'edit' && <IconButton
              style={{ padding: 0, width: '27px', height: '27px' }}
              tooltip="Supprimer la commande"
              onClick={this.removeCommande}
            >
              <RemoveIcon />
            </IconButton>}
          </div>
          <SelectableList value={commandeId} onChange={this.handleChangeList}>
            {Object.keys(commandes)
              .sort((key1, key2) =>
                moment(commandes[key1].dateCommande).unix() < moment(commandes[key2].dateCommande).unix()
              )
              .map((key, idx) =>
                <ListItem
                  key={idx}
                  primaryText={moment(commandes[key].dateCommande).format('DD/MM')}
                  value={key}
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
          {this.props.children &&
            React.cloneElement(
              this.props.children,
              { commande, commandes, commandeId, params, relais }
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
  commandes: selectCommandesRelais(),
  commandeId: selectCommandeId(),
});

const mapDispatchToProps = (dispatch) => ({
  loadCommandes: (query) => dispatch(loadCommandes(query)),
  loadUtilisateurs: (query) => dispatch(loadUtilisateurs(query)),
  loadFournisseurs: () => dispatch(loadFournisseurs()),
  loadRelais: () => dispatch(loadRelais()),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelaisCommandes);
