import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { List, ListItem, makeSelectable } from 'material-ui/List';

import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';
import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import styles from './styles.css';
import classnames from 'classnames';
import capitalize from 'lodash/capitalize';

const SelectableList = makeSelectable(List);

class AdminCommandeUtilisateurs extends Component {
  static propTypes = {
    utilisateurs: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    const { load, params } = this.props;
    load({ relaiId: params.relaiId });
  }

  handleChangeList = (event, value) => {
    const { relaiId, commandeId } = this.props.params;
    this.props.pushState(`/relais/${relaiId}/commandes/${commandeId}?utilisateurId=${value}`);
  }

  render() {
    const {
      utilisateurs,
    } = this.props;

    return (
      <div className="row">
        <div className={classnames('col-md-12', styles.panel)}>
          <div className="row">
            <div className="col-md-12" style={{ textAlign: 'right' }}>
              <h2>Passer un commande pour un adhérent</h2>
            </div>
            <div className="col-md-4 col-md-offset-1">
              <SelectableList value={window.location} onChange={this.handleChangeList}>
                {
                  utilisateurs
                  .filter((u) => u.nom)
                  .map((ut, idx) =>
                    <ListItem
                      key={idx}
                      primaryText={
                        `${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}`
                      }
                      value={ut.id}
                    />)
                }
              </SelectableList>
            </div>
            <div className="col-md-4">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  utilisateurs: selectUtilisateurs(),
});

const mapDispatchToProps = (dispatch) => ({
  pushState: (url) => dispatch(push(url)),
  load: (relaiId) => dispatch(loadUtilisateurs(relaiId))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCommandeUtilisateurs);
