import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {
  TextField,
} from 'redux-form-material-ui';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';

const options = {
  options: [
    'inline', 'list', 'textAlign', 'link', 'remove', 'history',
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
};

const renderSelectField = (datas) =>
  ({ input, label, meta: { touched, error }, ...custom }) => // eslint-disable-line
    <SelectField
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      {...custom}
    >
      {datas.map((data) =>
        <MenuItem key={data.value} value={data.value} primaryText={data.label} />
      )}
    </SelectField>;

const renderUnitesConservation = renderSelectField([
  {
    value: 'jours',
    label: 'jours',
  },
  {
    value: 'semaines',
    label: 'semaines',
  },
  {
    value: 'mois',
    label: 'mois',
  },
]);

const renderTva = renderSelectField([
  {
    value: 5.5,
    label: '5.5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '5.5',
  },
]);

const renderTypesProduits = (typesProduits) => renderSelectField(
  Object.keys(typesProduits).map((value) => ({
    value: typesProduits[value].id,
    label: typesProduits[value].nom,
  }))
);

const renderClassementComplementaire = (categoriesSecondaires) =>
  renderSelectField(
    categoriesSecondaires
      .map((value) => ({
        value,
        label: value,
      }))
  );

class ProduitForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    typesProduits: PropTypes.object.isRequired,
    valeurs: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    const { description } = this.props.initialValues; // eslint-disable-line

    this.state = {
      rawHtml: this.getInitialHTML(description),
    };
  }

  state = {
    rawHtml: null,
  }

  onEditorChange = (editorContent) => {
    const html = draftToHtml(editorContent);
    this.props.changeDescription(html);
    this.setState({ ...this.state, html });
  }

  getInitialHTML(html) {
    const contentBlocks = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return convertToRaw(contentState);
  }

  // handleTypeProduitChange = (event, index, value) => {
  //   this.setState({ ...this.state, typeProduitSelected: value });
  // }

  render() {
    const {
      handleSubmit,
      pending,
      pristine,
      typesProduits,
      valeurs,
    } = this.props;

    const categoriesSecondaires =
      valeurs.produit
      ? typesProduits[valeurs.produit.values.typeProduitId].categoriesSecondaires
      : [];

    return (
      <form onSubmit={handleSubmit}>
        <div className="row" style={{ minHeight: '400px' }}>
          <div className="col-md-12">
            <Field floatingLabelText="Nom" name="nom" component={TextField} fullWidth />
          </div>
          <div className="col-md-12">
            <Field
              style={{ display: 'none' }}
              floatingLabelText="Description"
              name="description"
              component={TextField}
              fullWidth
            />
            <p className={styles.label}>Description</p>
            <Editor
              editorClassName={styles.editorClass}
              toolbar={options}
              onChange={this.onEditorChange}
              initialContentState={this.state.rawHtml}
            />
          </div>
          <div className="col-md-3">
            <Field floatingLabelText="Tva" name="tva" component={renderTva} fullWidth />
          </div>
          <div className="col-md-3">
            <Field floatingLabelText="Stock" name="stock" component={TextField} fullWidth />
          </div>
          <div className="col-md-3">
            <Field
              floatingLabelText="Conservation garantie"
              name="garantieConservation.nombre"
              component={TextField}
              fullWidth
            />
          </div>
          <div className="col-md-3">
            <Field
              floatingLabelText="Unité"
              name="garantieConservation.type"
              component={renderUnitesConservation}
              fullWidth
            />
          </div>
          <div className="col-md-6">
            <Field
              floatingLabelText="Type de produits"
              name="typeProduitId"
              component={renderTypesProduits(typesProduits)}
              fullWidth
            />
          </div>
          {
            categoriesSecondaires.length > 0 &&
              <div className="col-md-6">
                <Field
                  floatingLabelText="Classement complémentaire"
                  name="typeProduitSecondaire"
                  component={renderClassementComplementaire(categoriesSecondaires)}
                  fullWidth
                />
              </div>
          }
        </div>
        {!pristine && <div className="row center-md">
          <div className={`col-md-8 ${styles.formFooter}`} style={{ minHeight: 52 }}>
            <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />
          </div>
        </div>}
      </form>
    );
  }
}

const produitForm = reduxForm({
  form: 'produit',
})(ProduitForm);

export default produitForm;
