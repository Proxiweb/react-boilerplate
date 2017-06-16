import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine, change } from 'redux-form';
import Paper from 'material-ui/Paper';

import { makeSelectPending } from 'containers/App/selectors';

import { selectFournisseursIds, selectCommandeDomain } from 'containers/Commande/selectors';
import { loadFournisseurs, loadRelais } from 'containers/Commande/actions';

import InfosFormContainer from './containers/InfosFormContainer';
import classnames from 'classnames';
import styles from './styles.css';

class InfosFournisseur extends Component {
  static propTypes = {
    fournisseurs: PropTypes.object.isRequired,
    donnees: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { fournisseurs, params: { fournisseurId }, donnees } = this.props;
    try {
      if (!donnees.datas.entities.relais) this.props.loadRelais();
    } catch (e) {
      this.props.loadRelais();
    }

    if (!fournisseurs || !fournisseurs[fournisseurId]) {
      this.props.loadFournisseurs({ id: fournisseurId, jointures: true });
    }

  }

  render() {
    const { fournisseurs, params: { fournisseurId }, donnees, pending } = this.props;
    let relais = null;
    try {
      relais = donnees.datas.entities.relais;
    } catch (e) {
    }

    return (
      <div className="row center-md">
        <div className="col-md-8">
          <Paper>
            {fournisseurs &&
              fournisseurs[fournisseurId] && relais &&
              <InfosFormContainer params={this.props.params} fournisseur={fournisseurs[fournisseurId]} relais={relais}/>}
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: makeSelectPending(),
  fournisseurs: selectFournisseursIds(),
  donnees: selectCommandeDomain(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadFournisseurs,
      loadRelais
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InfosFournisseur);
