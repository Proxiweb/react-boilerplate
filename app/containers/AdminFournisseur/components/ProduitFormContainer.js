import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { isPristine, change } from 'redux-form';

// import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { selectPending } from 'containers/App/selectors';
import { selectTypesProduitsByIds } from 'containers/Commande/selectors';
import { saveProduit } from 'containers/Commande/actions';
import ProduitForm from './ProduitForm';

const isProfilePristine = () => (state) => isPristine('produit')(state);
const getValues = () => (state) => state.form;

// import submit from './submit';

class ProduitFormContainer extends React.Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    typesProduits: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    changeValue: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  }

  handleSubmit = (values) => {
    const { produit, save } = this.props;
    const newProd = { ...produit, ...values };
    console.log(newProd, this.props);
    try {
      save(newProd);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { pending, produit, pristine, typesProduits, changeValue, values } = this.props;
    return (
      <ProduitForm
        initialValues={produit}
        valeurs={values}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        changeDescription={(val) => changeValue('produit', 'description', val)}
        typesProduits={typesProduits}
      />
      );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isProfilePristine(),
  typesProduits: selectTypesProduitsByIds(),
  values: getValues(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  changeValue: (form, field, val) => dispatch(change(form, field, val)),
  save: (datas) => dispatch(saveProduit(datas)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProduitFormContainer);
