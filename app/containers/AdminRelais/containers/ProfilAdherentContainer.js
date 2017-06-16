import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import { isPristine } from 'redux-form';

import { saveUtilisateur } from 'containers/Commande/actions';
import { makemakeSelectPending } from 'containers/App/selectors';
import ProfileForm from 'containers/ProfileFormContainer/components/ProfileForm';

const isProfilePristine = () => state => isPristine('profile')(state);

class ProfileAdherentContainer extends React.Component {
  static propTypes = {
    utilisateur: PropTypes.string,
    relaiId: PropTypes.string.isRequired,
    pristine: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    saveUtilisateur: PropTypes.func.isRequired,
  };

  handleSubmit = values => {
    this.props.saveUtilisateur({
      ...values,
      nom: values.nom.toUpperCase(),
      prenom: capitalize(values.prenom),
      relaiId: this.props.relaiId,
    });
  };

  render() {
    const { pending, pristine, utilisateur } = this.props;
    return (
      <div>
        {!utilisateur && <h2>Créer un nouvel adhérent</h2>}
        <ProfileForm
          onSubmit={this.handleSubmit}
          pending={pending}
          pristine={pristine}
          initialValues={utilisateur || {}}
          enableReinitialize
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: makemakeSelectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveUtilisateur,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAdherentContainer);
