import React from 'react';
import ProfileForm from 'components/ProfileForm';
import { connect } from 'react-redux';
// import { extractProfile } from 'containers/CompteUtilisateur/selectors';

const ProfileFormConnected = connect()(ProfileForm);

export default class ProfileFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(datas) {
    console.log(datas);
  }

  render() {
    return <ProfileFormConnected onSubmit={this.handleSubmit} />;
  }
}
