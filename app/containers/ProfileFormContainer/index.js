import React, { PropTypes } from 'react';
import ProfileForm from 'components/ProfileForm';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import submit from './submit';

class ProfileFormContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    console.log(values);
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

const mapStateToProps = createStructuredSelector({
  profile: selectCompteUtilisateur(),
});

export default connect(mapStateToProps)(ProfileFormContainer);
