import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine, change } from 'redux-form';

import { makeSelectPending } from 'containers/App/selectors';
import { makeSelectRelais } from 'containers/Commande/selectors';
import { saveFournisseur } from 'containers/Commande/actions';
import InfosForm from './InfosForm';

const isFormPristine = () => state => isPristine('info_fournisseur')(state);

class fournisseurFormContainer extends React.Component {
  static propTypes = {
    fournisseur: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    changeValue: PropTypes.func.isRequired,
    saveFournisseur: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  handleSubmit = values => {
    this.props.saveFournisseur({ ...this.props.fournisseur, ...values });
  };

  handleAjouteRelais = id =>
    this.props.saveFournisseur(
      {
        ...this.props.fournisseur,
        relais: this.props.fournisseur.relais.concat({ id, actif: true }),
      },
      'Relai ajouté (F5 pour mettre à jour la liste)',
      null // pas de redirection
    );

  handleRetireRelais = id =>
    this.props.saveFournisseur(
      {
        ...this.props.fournisseur,
        relais: this.props.fournisseur.relais.filter(relai => relai.id !== id),
      },
      'Relai retiré (F5 pour mettre à jour la liste)',
      null // pas de redirection
    );

  render() {
    const {
      pending,
      fournisseur,
      pristine,
      changeValue,
      values,
      relais,
    } = this.props;

    return (
      <InfosForm
        initialValues={fournisseur}
        valeurs={values}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        changePresentation={val =>
          changeValue('info_fournisseur', 'presentation', val)}
        relais={relais}
        fournisseur={fournisseur}
        ajouteRelais={this.handleAjouteRelais}
        retireRelais={this.handleRetireRelais}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: makeSelectPending(),
  pristine: isFormPristine(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeValue: change,
      saveFournisseur,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  fournisseurFormContainer
);
