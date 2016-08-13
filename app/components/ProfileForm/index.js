import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import styles from './styles.css';
// import validate from './validate';
import PureInput from 'components/PureInput';
import send from 'utils/send';

const asyncValidate = (values) => new Promise((resolve, reject) => {
  // si l'utilisateur est identifié, l'email ne doit pas être testé
  if (values.id) resolve();

  send({ url: '/api/checkMail', datas: { email: values.email } })
    .then((res) => {
      if (res.err) {
        reject({ email: 'Cet email est déjà utilisé' });
      }
      resolve();
    });
});

class ProfileForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  render() {
    const {
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="row">
          <div className={'col-md-6 col-md-offset-3'}>
            <h3 className={styles.formHeader}>Vos coordonnées</h3>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <Field name="id" type="hidden" component={PureInput} />
              <Field cols="6" name="nom" type="text" component={PureInput} label="Nom" className={`form-control ${styles.upper}`} />
              <Field cols="6" name="prenom" type="text" component={PureInput} label="Prénom" className={`form-control ${styles.capit}`} />
            </div>
          </div>
        </div>
        <div className={`${styles.formFooter} row`}>
          <div className="col-md-4 col-md-offset-4">
            <button type="submit" className="btn btn-submit btn-block btn-lg btn-primary"><i className="fa fa-check"></i> Valider</button>
          </div>
        </div>
      </form>
    );
  }
}

const mainForm = reduxForm({
  form: 'main',
  asyncValidate,
  asyncBlurFields: ['nom'],
  // validate,
})(ProfileForm);

export default mainForm;
