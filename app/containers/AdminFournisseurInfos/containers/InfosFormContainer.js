import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine, change } from 'redux-form';

import { selectPending } from 'containers/App/selectors';
import { saveFournisseur } from 'containers/Commande/actions';
import InfosForm from './InfosForm';

const isFormPristine = () => state => isPristine('info_fournisseur')(state);

class fournisseurFormContainer extends React.Component {
  static propTypes = {
    fournisseur: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    changeValue: PropTypes.func.isRequired,
    saveFournisseur: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  handleSubmit = values => {
    this.props.saveFournisseur({ ...this.props.fournisseur, ...values });
  };

  render() {
    const { pending, fournisseur, pristine, changeValue, values } = this.props;

    return (
      <InfosForm
        initialValues={fournisseur}
        valeurs={values}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        changePresentation={val => changeValue('info_fournisseur', 'presentation', val)}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isFormPristine(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    changeValue: change,
    saveFournisseur,
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(fournisseurFormContainer);