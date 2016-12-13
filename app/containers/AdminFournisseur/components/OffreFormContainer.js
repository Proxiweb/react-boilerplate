import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { isPristine } from 'redux-form';

// import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { selectPending } from 'containers/App/selectors';
import OffreForm from './OffreForm';

const isProfilePristine = () => (state) => isPristine('offre')(state);

// import submit from './submit';

class OffreFormContainer extends React.Component {
  static propTypes = {
    offre: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    // saveAccount: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    handleToggeState: PropTypes.func.isRequired,
    tva: PropTypes.number.isRequired,
  }

  handleSubmit = (values) => {
    console.log(values);
    // const saving = saveAccount(this.props.profile.id, values);
    // try {
    //   this.props.dispatch(saving);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  render() {
    const { pending, offre, pristine, tva, handleToggeState } = this.props;
    return (
      <OffreForm
        initialValues={offre}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        tva={tva}
        handleToggeState={handleToggeState}
      />
      );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OffreFormContainer);
