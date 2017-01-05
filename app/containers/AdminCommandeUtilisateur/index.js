import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';

import { selectUtilisateurs } from 'containers/Commande/selectors';
import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import styles from './styles.css';
import classnames from 'classnames';
import ListeUtilisateurs from 'components/ListeUtilisateurs';

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
        <Helmet
          title="Passer une commande"
        />
        <div className={classnames('col-md-12', styles.panel)}>
          <div className="row">
            <div className="col-md-4 col-md-offset-1">
              <ListeUtilisateurs onChangeList={this.handleChangeList} utilisateurs={utilisateurs} />
            </div>
            <div className="col-md-7">
              Passer une commande pour un adhérent
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
  load: (relaiId) => dispatch(loadUtilisateurs(relaiId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCommandeUtilisateurs);
