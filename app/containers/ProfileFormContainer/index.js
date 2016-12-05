import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
    pristine: PropTypes.bool.isRequired,
    // saveAccount: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    const saving = saveAccount(this.props.profile.id, values);
    try {
      this.props.dispatch(saving);
    } catch (e) {
      console.log(e);
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

const mapDispatchToProps = (dispatch) => ({
  saveAccount: (datas) => dispatch(saveAccount(datas)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFormContainer);
