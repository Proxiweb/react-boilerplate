import React, { PropTypes } from 'react';
import ProfileForm from 'components/ProfileForm';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { saveAccount } from 'containers/CompteUtilisateur/actions';

import submit from './submit';

class ProfileFormContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveAccount: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    const saving = saveAccount(this.props.profile.id, values);
    console.log(values);
    console.log(saving);
    try {
      this.props.dispatch(saving);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <ProfileForm
        initialValues={this.props.profile}
        onSubmit={this.handleSubmit}
      />
      );
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveAccount: (datas) => dispatch(saveAccount(datas)),
  dispatch,
});

const mapStateToProps = createStructuredSelector({
  profile: selectCompteUtilisateur(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFormContainer);
