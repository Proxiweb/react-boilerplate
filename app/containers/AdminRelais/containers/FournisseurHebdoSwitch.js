import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import Toggle from 'material-ui/Toggle';
import includes from 'lodash/includes';

import { selectRelais } from 'containers/AdminRelais/selectors';
import { saveRelais } from 'containers/AdminRelais/actions';
import styles from './styles.css';

class FournisseurHebdoSwitch extends Component { // eslint-disable-line
  static propTypes = {
    fournisseurId: PropTypes.string.isRequired,
    fournisseur: PropTypes.string.isRequired,
    relais: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    saveR: PropTypes.func.isRequired,
  }

  handleToggle = () => {
    const { relais, fournisseurId, saveR, params } = this.props;
    const relaisSelected = relais.find((r) => r.id === params.relaiId);
    const fournisseursHebdo =
      this.fournisseurInclus()
        ? relaisSelected.fournisseursHebdo.filter((id) => id !== fournisseurId)
        : [...relaisSelected.fournisseursHebdo, fournisseurId];

    saveR({ ...relaisSelected, fournisseursHebdo }, null);
  }

  fournisseurInclus = () => {
    const relaisSelected = this.props.relais.find((r) =>
      r.id === this.props.params.relaiId
    );
    return includes(relaisSelected.fournisseursHebdo, this.props.fournisseurId);
  }

  render() {
    return (
      <div className="row center-md">
        <div className="col-md-12">
          <h1>{this.props.fournisseur}</h1>
        </div>
        <div className="col-md-12">
          <div className={`row ${styles.fournisseursHebdoSwitch}`}>
            <div className="col-md-6">
              Commande hebdomadaire automatique
            </div>
            <div className="col-md-4">
              <Toggle
                label={this.fournisseurInclus() ? 'Activée' : 'Désactivée'}
                toggled={this.fournisseurInclus()}
                onToggle={this.handleToggle}
              />
            </div>
          </div>
        </div>
      </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  saveR: saveRelais,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FournisseurHebdoSwitch);
