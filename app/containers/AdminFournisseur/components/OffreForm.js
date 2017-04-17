import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import CustomSelectField from 'components/CustomSelectField';
import { reduxForm, Field, FieldArray } from 'redux-form';
import round from 'lodash/round';
import { TextField } from 'redux-form-material-ui';

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

const renderSelectField = datas =>
  (
    { input, label, meta: { touched, error }, ...custom } // eslint-disable-line
  ) => (
    <CustomSelectField
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      {...custom}
    >
      {datas.map(data => <MenuItem key={data.value} value={data.value} primaryText={data.label} />)}
    </CustomSelectField>
  );


const renderTypeColisage = renderSelectField([
  {
    value: 'unite',
    label: 'Unitaire',
  },
  {
    value: 'poids',
    label: 'Poids',
  }
]);

const renderTarifications = (
  { fields, meta: { error }, tarifications } // eslint-disable-line
) => (
  <div className="row">
    <div className="col-md-12" style={{ textAlign: 'right', marginBottom: '1em', marginTop: '2em' }}>
      <RaisedButton primary label=" + Nouvelle tarification" onTouchTap={() => fields.push()} />
    </div>
    <div className="col-md-12">
      {fields.map((tarification, index) => (
        <div
          className="row"
          key={index}
          style={{ marginBottom: '0.5em', padding: '0 1em 0.5em 1em 1em', border: 'solid 1px silver' }}
        >
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-3">
                <Field
                  name={`${tarification}.qteMinRelais`}
                  floatingLabelText="Qté min relais"
                  component={TextField}
                  fullWidth
                  disabled={false}
                  style={{ lineHeight: '30px', fontSize: 14 }}
                  />
              </div>
              <div className="col-md-3">
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
                {tarifications &&
                  tarifications[index] &&
                  tarifications[index].prix &&
                  <TextField
                    disabled
                    floatingLabelText="prix distributeur (indicatif)"
                    fullWidth
                    value={round(tarifications[index].prix * 0.110, 2)}
                  />}
              </div>
            </div>
          </div>
          <div className="col-md-2" style={{ marginTop: '1.5em' }}>
            <RaisedButton
              label="supprimer"
              onTouchTap={() => fields.remove(index)}
              backgroundColor="red"
              labelStyle={{ color: 'white' }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

class offreForm extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    quantiteUnite: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleToggeState: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    avecColisage: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    valeurs: PropTypes.object.isRequired,
  };

  render() {
    const {
      handleSubmit,
      pending,
      pristine,
      handleToggeState,
      avecColisage,
      valeurs,
      quantiteUnite,
    } = this.props;

    // tarifications modifiées pour
    // calcul automatique part distributeur
    let tarifications;
    let type;
    try {
      tarifications = valeurs.offre.values.tarifications;
      type = valeurs.offre.values.colisageType;
    } catch (e) {
      tarifications = null;
      type = null;
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
                <Field
                  floatingLabelText={`${quantiteUnite === 'mg' ? 'poids' : 'volume'} (${quantiteUnite})`}
                  name="poids"
                  fullWidth
                  component={TextField}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Field
                  floatingLabelText="Référence catalogue fournisseur"
                  name="referenceFourn"
                  fullWidth
                  component={TextField}
                />
              </div>
              <div className="col-xs-6">
                <Field floatingLabelText="type" fullWidth name="colisageType" component={renderTypeColisage} />
              </div>
              <div className="col-xs-6">
                <Field floatingLabelText={`quantite ${type === 'poids' ? '(Kg)' : ''}`} fullWidth name="colisageQuantite" component={TextField} />
              </div>
            </div>
           <FieldArray name="tarifications" component={renderTarifications} props={{ tarifications }} />
          </div>
        </div>
        <div className="row center-md">
          {!pristine &&
            <div className={`col-md-6 ${styles.formFooter}`} style={{ minHeight: 52 }}>
              <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />
            </div>}
          <div className={`col-md-6 ${styles.formFooter}`} style={{ minHeight: 52 }}>
            <RaisedButton label="Annuler" secondary fullWidth disabled={pending} onClick={handleToggeState} />
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
const mapStateToProps = state => ({
  formvals: state.form.wizard_contrat ? state.form.wizard_contrat.values : null,
});

export default connect(mapStateToProps)(OffreForm);
