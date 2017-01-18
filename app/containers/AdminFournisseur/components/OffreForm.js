import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray } from 'redux-form';
import round from 'lodash/round';
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

const renderTarifications =
  ({ fields, meta: { error }, tarifications }) => // eslint-disable-line
    <div className="row">
      <div className="col-md-12" style={{ textAlign: 'right', marginBottom: '1em', marginTop: '2em' }}>
        <RaisedButton primary label=" + Nouvelle tarification" onTouchTap={() => fields.push()} />
      </div>
      <div className="col-md-12">
        {fields.map((tarification, index) =>
          <div className="row" key={index} style={{ marginBottom: '0.5em', padding: '0 1em 0.5em 1em 1em', border: 'solid 1px silver' }}>
            <div className="col-md-2">
              <Field
                name={`${tarification}.qteMinRelais`}
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
                floatingLabelText="Qté min glob."
                component={TextField}
                fullWidth
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-2">
              <Field
                name={`${tarification}.prix`}
                floatingLabelText="prix fourn."
                fullWidth
                component={TextField}
                disabled={false}
                style={{ lineHeight: '30px', fontSize: 14 }}
              />
            </div>
            <div className="col-md-4">
              {tarifications && tarifications[index] && tarifications[index].prix &&
                <TextField
                  disabled
                  floatingLabelText="prix distributeur (indicatif)"
                  fullWidth
                  value={round(tarifications[index].prix * 0.110, 2)}
                />}
            </div>
            <div className="col-md-2" style={{ marginTop: '1.5em' }}>
              <RaisedButton
                label="supprimer"
                onTouchTap={() => fields.remove(index)}
                backgroundColor="red"
                labelStyle={{ color: 'white' }}
              />
            </div>
            <div className="col-md-6" style={{ marginBottom: '0.5em' }}>
            </div>
          </div>
        )}
      </div>
    </div>;


class offreForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleToggeState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valeurs: PropTypes.object.isRequired,
  }

  render() {
    const {
      handleSubmit,
      pending,
      pristine,
      handleToggeState,
      valeurs,
    } = this.props;

    // tarifications modifiées pour
    // calcul automatique part distributeur
    let tarifications;
    try {
      tarifications = valeurs.offre.values.tarifications;
    } catch (e) {
      tarifications = null;
    }

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
            <FieldArray name="tarifications" component={renderTarifications} props={{ tarifications }} />
          </div>
          <div className={`col-md-6 ${styles.formFooter}`} style={{ minHeight: 52 }}>
            {!pristine && <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />}
          </div>
          <div className={`col-md-6 ${styles.formFooter}`} style={{ minHeight: 52 }}>
            <RaisedButton
              label="Annuler"
              secondary
              fullWidth
              disabled={pending}
              onClick={handleToggeState}
            />
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
