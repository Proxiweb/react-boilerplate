import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine, change } from 'redux-form';

// import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { selectPending } from 'containers/App/selectors';
import { selectFournisseursIds } from 'containers/Commande/selectors';
import { saveFournisseur } from 'containers/Commande/actions';
import InfosForm from './InfosForm';

const isProfilePristine = () => state => isPristine('fournisseur')(state);
const getValues = () => state => state.form;

// import submit from './submit';

class fournisseurFormContainer extends React.Component {
  static propTypes = {
    fournisseurs: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    changeValue: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  handleSubmit = values => {
    const { fournisseurs, save, params: { fournisseurId } } = this.props;
    save({ ...fournisseurs[fournisseurId], ...values });
  };

  render() {
    const { pending, fournisseurs, pristine, changeValue, values, params: { fournisseurId } } = this.props;

    return (
      <InfosForm
        initialValues={fournisseurs[fournisseurId]}
        valeurs={values}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        changeDescription={val => changeValue('fournisseur', 'description', val)}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isProfilePristine(),
  fournisseurs: selectFournisseursIds(),
  values: getValues(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    changeValue: change,
    save: saveFournisseur,
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(fournisseurFormContainer);
