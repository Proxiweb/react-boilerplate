import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import { isPristine } from 'redux-form';

import { makeSelectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { makeSelectPending } from 'containers/App/selectors';
import ProfileForm from './components/ProfileForm';

const isProfilePristine = () => state => isPristine('profile')(state);

// import submit from './submit';

class ProfileFormContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    relaiId: PropTypes.string.isRequired,
    pristine: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    saveAccount: PropTypes.func.isRequired,
  };

  handleSubmit = values => {
    const sauvegardeInitiale = this.props.profile.nom !== values.nom;

    this.props.saveAccount(
      this.props.profile.id,
      {
        ...values,
        nom: values.nom.toUpperCase(),
        prenom: capitalize(values.prenom),
      },
      null,
      sauvegardeInitiale ? `/relais/${this.props.relaiId}/commandes` : null
    );
  };

  render() {
    const { pending, profile, pristine } = this.props;
    return (
      <ProfileForm
        initialValues={profile}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectCompteUtilisateur(),
  pending: makeSelectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveAccount,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  ProfileFormContainer
);
