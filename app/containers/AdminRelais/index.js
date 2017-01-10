import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import EuroIcon from 'material-ui/svg-icons/action/euro-symbol';
import PeopleIcon from 'material-ui/svg-icons/social/person';
import includes from 'lodash/includes';
// import assign from 'lodash/assign';

import styles from './styles.css';
import classnames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { selectRelais } from 'containers/AdminDepot/selectors';

import DepotsRelais from './containers/DepotsRelais';
import Utilisateur from './containers/Utilisateur';
import ListeUtilisateurs from 'containers/ListeUtilisateurs';
// import { loadDepotsRelais } from 'containers/AdminDepot/actions';
import { push } from 'react-router-redux';
import { loadRelais } from './actions';

import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';

import { selectRoles, selectRelaiId } from 'containers/CompteUtilisateur/selectors';

const SelectableList = makeSelectable(List);

class AdminRelais extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    relais: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    authRelaiId: PropTypes.string.isRequired,
    roles: PropTypes.array.isRequired,
    load: PropTypes.func.isRequired,
    loadUtil: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  state = {
    viewSelected: null,
    utilisateurId: null,
  }

  componentDidMount() {
    const { relais, load } = this.props;
    if (relais && relais.length === 0) {
      load();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { utilisateurs, loadUtil } = this.props;
    if (this.props.params.relaiId !== nextProps.params.relaiId) {
      this.setState({ viewSelected: null });
      if (
        !utilisateurs ||
        !Object.keys(utilisateurs).filter((k) => utilisateurs[k].relaiId === nextProps.params.relaiId).length
      ) {
        loadUtil({ relaiId: nextProps.params.relaiId });
      }
    }
  }

  handleChangeList = (event, value) =>
    this.props.pushState(`/relais/${value}`)

  render() {
    const { relais, params, pushState, roles, authRelaiId, utilisateurs } = this.props;
    const { relaiId } = params;
    const { viewSelected, utilisateurId } = this.state;
    const relaisSelected = relais.find((r) => r.id === relaiId);
    const admin = includes(roles, 'ADMIN');

    return (<div className="row">
      <div className={classnames('col-md-3', styles.panel)}>
        <SelectableList value={relaiId} onChange={this.handleChangeList}>
          {Object.keys(relais)
            .filter((r) => admin || r.id === authRelaiId)
            .map((key, idx) =>
              <ListItem
                key={idx}
                primaryText={relais[key].nom.toUpperCase()}
                value={relais[key].id}
              />
          )}
        </SelectableList>
      </div>
      <div className={classnames('col-md-9', styles.panel)}>
        <div className="row end-md">
          <div classNames="col-md-4">
            {relaisSelected &&
              <FlatButton
                label="Commandes en cours"
                icon={<ShoppingCartIcon />}
                onClick={() => pushState(`/relais/${relaiId}/commandes`)}
              />
            }
            {relaisSelected &&
              <FlatButton
                label="Depots"
                icon={<EuroIcon />}
                onClick={() => this.setState({ viewSelected: 'depot' })}
              />
            }
            {relaisSelected &&
              <FlatButton
                label="Adhérents"
                icon={<PeopleIcon />}
                onClick={() => this.setState({ viewSelected: 'adherents' })}
              />
            }
          </div>
        </div>
        {viewSelected === 'depot' && utilisateurs &&
          <DepotsRelais
            relaiId={relaiId}
            utilisateurs={utilisateurs}
          />}
        {viewSelected === 'adherents' &&
          <div className="row">
            <div className="col-md-4">
              <ListeUtilisateurs
                relaiId={relaiId}
                onChangeList={(event, value) => this.setState({ ...this.state, utilisateurId: value })}
              />
            </div>
            <div className="col-md-8">
              { utilisateurId && <Utilisateur utilisateur={utilisateurs.find((u) => u.id === utilisateurId)} />}
            </div>
          </div>
          }
      </div>
    </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
  roles: selectRoles(),
  authRelaiId: selectRelaiId(),
  utilisateurs: selectUtilisateurs(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadRelais()),
  loadUtil: (relaiId) => dispatch(loadUtilisateurs(relaiId)),
  // loadDepots: (relaisId) => dispatch(loadDepotsRelais(relaisId)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelais);
