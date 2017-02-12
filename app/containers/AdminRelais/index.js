import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import includes from 'lodash/includes';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import EuroIcon from 'material-ui/svg-icons/action/euro-symbol';
import InfoIcon from 'material-ui/svg-icons/action/info';
import PeopleIcon from 'material-ui/svg-icons/social/person';
import FournisseursIcon from 'material-ui/svg-icons/maps/local-shipping';
// import assign from 'lodash/assign';

import styles from './styles.css';
import classnames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { selectRelais } from 'containers/AdminDepot/selectors';

import DepotsRelais from './containers/DepotsRelais';
import Utilisateur from './containers/Utilisateur';
import FournisseursRelais from './containers/FournisseursRelais';
import ListeUtilisateurs from 'containers/ListeUtilisateurs';
import InfosRelais from './containers/InfosRelais';
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
      <div className={classnames('col-md-2', styles.panel)}>
        <SelectableList value={relaiId} onChange={this.handleChangeList}>
          {relais
            .filter((r) => admin || r.id === authRelaiId)
            .map((rel, idx) =>
              <ListItem
                key={idx}
                primaryText={rel.nom.toUpperCase()}
                value={rel.id}
              />
          )}
        </SelectableList>
      </div>
      <div className={classnames('col-md-10', styles.panel)}>
        <div className="row end-md">
          <div className="col-md-12">
            {relaisSelected &&
              <FlatButton
                label="Commandes en cours"
                icon={<ShoppingCartIcon />}
                onClick={() => pushState(`/relais/${relaiId}/commandes`)}
              />
            }
            {relaisSelected &&
              [
                <FlatButton
                  label="Depots"
                  icon={<EuroIcon />}
                  onClick={() => this.setState({ viewSelected: 'depot' })}
                />,
                <FlatButton
                  label="Adhérents"
                  icon={<PeopleIcon />}
                  onClick={() => this.setState({ viewSelected: 'adherents' })}
                />,
                <FlatButton
                  label="Fournisseurs"
                  icon={<FournisseursIcon />}
                  onClick={() => this.setState({ viewSelected: 'fournisseurs' })}
                />,
                <FlatButton
                  label="Infos"
                  icon={<InfoIcon />}
                  onClick={() => this.setState({ viewSelected: 'infos' })}
                />,
              ]
            }
          </div>
        </div>
        {viewSelected === 'depot' && utilisateurs &&
          <DepotsRelais
            relaiId={relaiId}
            utilisateurs={utilisateurs}
          />}
        {viewSelected === 'fournisseurs' &&
          <FournisseursRelais
            relaiId={relaiId}
            params={params}
          />}
        {viewSelected === 'infos' &&
          <InfosRelais
            relais={relaisSelected}
            params={params}
            test="5"
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadRelais,
  loadUtil: loadUtilisateurs,
  // loadDepots: (relaisId) => dispatch(loadDepotsRelais(relaisId)),
  pushState: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelais);
