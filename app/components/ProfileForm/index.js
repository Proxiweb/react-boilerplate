import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import Paper from 'material-ui/Paper';
import {
  TextField,
} from 'redux-form-material-ui';

import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';
import send from 'utils/send';

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

class ProfileForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  }

  render() {
    const { handleSubmit, pending } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Paper zDepth={2} style={{ padding: '1rem' }}>
          <div className="row">
            <div className="col-md-6">
              <Field cols="6" floatingLabelText="Nom" name="nom" component={TextField} />
              <Field cols="6" floatingLabelText="Adresse" name="adresse" component={TextField} />
              <Field cols="6" floatingLabelText="Code postal" name="codePostal" component={TextField} />
              <Field cols="6" floatingLabelText="Télephone portable" name="telPortable" component={TextField} />
              <Field cols="6" floatingLabelText="Adresse email" name="email" component={TextField} />
            </div>
            <div className="col-md-6">
              <Field cols="6" floatingLabelText="Prénom" name="prenom" component={TextField} label="Prénom" />
              <Field cols="6" floatingLabelText="Adresse complémentaire" name="adressComplementaire" component={TextField} />
              <Field cols="6" floatingLabelText="Ville" name="ville" component={TextField} />
              <Field cols="6" floatingLabelText="Télephone fixe" name="telFixe" component={TextField} />
              <Field cols="6" floatingLabelText="Pseudo (si pas d'email)" name="pseudo" component={TextField} />
            </div>
            <div className="row center-md">
              <div className={`col-md ${styles.formFooter}`}>
                <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />
              </div>
            </div>
          </div>
        </Paper>
      </form>
    );
  }
}

const profileForm = reduxForm({
  form: 'profile',
  // asyncValidate,
  // asyncBlurFields: ['nom'],
  // validate,
})(ProfileForm);

export default profileForm;
