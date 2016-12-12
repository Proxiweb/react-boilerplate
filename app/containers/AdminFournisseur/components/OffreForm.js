import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray } from 'redux-form';
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

const renderTarifications = ({ fields, meta: { error }, formvals, tva }) => {
  return (
    <div className="row">
      <div className="col-md-12" style={{ textAlign: 'right', marginBottom: '2rem' }}>
        <RaisedButton label=" + Ajouter une tarification" onTouchTap={() => fields.push()} />
      </div>
      <div className="col-md-12">
        {fields.map((tarification, index) =>
          <div className="row" key={index}>
            <div className="col-md-2">
              <Field
                name={`${tarification}.qteMinRelai`}
                floatingLabelText="Qté min relais"
                component={TextField}
                fullWidth
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-2">
              <Field
                name={`${tarification}.qteMinProxiweb`}
                floatingLabelText="Qté min globale"
                component={TextField}
                fullWidth
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-2">
              <Field
                name={`${tarification}.prix`}
                floatingLabelText="prix fournisseur"
                fullWidth
                component={TextField}
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-2">
              <Field
                name={`${tarification}.recolteFond`}
                floatingLabelText="Prix distributeur"
                component={TextField}
                fullWidth
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-1">
              <RaisedButton
                label="suppr"
                onTouchTap={() => fields.remove(index)}
                backgroundColor="red"
                labelStyle={{ color: 'white' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>);
};

class offreForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    formvals: PropTypes.object,
    tva: PropTypes.number.isRequired,
  }

  render() {
    const { handleSubmit, pending, pristine, formvals, tva } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-6">
                <Field floatingLabelText="Description" fullWidth name="description" component={TextField} />
              </div>
              <div className="col-xs-6">
                <Field floatingLabelText="poids" name="poids" fullWidth component={TextField} />
              </div>
            </div>
            <Field
              floatingLabelText="Référence catalogue fournisseur"
              name="referenceFourn"
              fullWidth
              component={TextField}
            />
            <FieldArray name="tarifications" component={renderTarifications} props={{ formvals, tva }} />
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

const OffreForm = reduxForm({
  form: 'offre',
})(offreForm);

// @TODO passer par des selectors
const mapStateToProps = (state) => ({
  formvals: (state.form.wizard_contrat ? state.form.wizard_contrat.values : null),
});


export default connect(mapStateToProps)(OffreForm);
