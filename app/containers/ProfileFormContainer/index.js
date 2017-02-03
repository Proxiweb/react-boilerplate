import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import {
  isPristine,
} from 'redux-form';

import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { selectPending } from 'containers/App/selectors';
import ProfileForm from './components/ProfileForm';

const isProfilePristine = () => (state) => isPristine('profile')(state);

// import submit from './submit';

class ProfileFormContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    relaiId: PropTypes.string.isRequired,
    pristine: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    const sauvegardeInitiale = this.props.profile.nom !== values.nom;

    const saving = saveAccount(
      this.props.profile.id,
      { ...values,
        nom: values.nom.toUpperCase(),
        prenom: capitalize(values.prenom),
      },
      null,
      sauvegardeInitiale
        ? `/relais/${this.props.relaiId}/commandes`
        : null,
    );
    try {
      this.props.dispatch(saving);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

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
  profile: selectCompteUtilisateur(),
  pending: selectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  saveAccount: saveAccount,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFormContainer);
