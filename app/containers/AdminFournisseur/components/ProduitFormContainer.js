import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { isPristine } from 'redux-form';

// import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { selectPending } from 'containers/App/selectors';
import ProduitForm from './ProduitForm';

const isProfilePristine = () => (state) => isPristine('produit')(state);

// import submit from './submit';

class ProduitFormContainer extends React.Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    // saveAccount: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
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
    const { pending, produit, pristine } = this.props;
    return (
      <ProduitForm
        initialValues={produit}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProduitFormContainer);
