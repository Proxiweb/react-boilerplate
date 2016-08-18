import React, { PropTypes } from 'react';
import ProfileForm from 'components/ProfileForm';
import submit from './submit';

export default class ProfileFormContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    afterSubmit: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(datas) {
    console.log(datas);
    this.props.afterSubmit();
  }

  render() {
    return <ProfileForm onSubmit={submit} initialValues={this.props.profile} />;
  }
}
