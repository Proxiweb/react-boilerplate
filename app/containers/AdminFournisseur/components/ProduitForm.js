import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import Paper from 'material-ui/Paper';
import {
  TextField,
} from 'redux-form-material-ui';

import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';
// import send from 'utils/send';

// const asyncValidate = (values) => new Promise((resolve, reject) => {
//   // si l'utilisateur est identifié, l'email ne doit pas être testé
//   if (values.id) resolve();
//
//   send({ url: '/api/checkMail', datas: { email: values.email } })
//     .then((res) => {
//       if (res.err) {
//         reject({ email: 'Cet email est déjà utilisé' });
//       }
//       resolve();
//     });
// });

class ProduitForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  }

  render() {
    const { handleSubmit, pending, pristine } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12">
            <Field floatingLabelText="Nom" name="nom" component={TextField} />
            <Field floatingLabelText="Description" name="description" component={TextField} />
            <Field floatingLabelText="Stock" name="stock" component={TextField} />
            <Field floatingLabelText="Tva" name="tva" component={TextField} />
          </div>
          <div className="col-lg-12" style={{ minHeight: 52 }}>
            {!pristine && (<div className="row center-md">
              <div className={`col-md-4 ${styles.formFooter}`}>
                <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />
              </div>
            </div>)}
          </div>
        </div>
      </form>
    );
  }
}

const produitForm = reduxForm({
  form: 'produit',
})(ProduitForm);

export default produitForm;
