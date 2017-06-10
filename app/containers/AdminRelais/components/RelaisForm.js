import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { Editor } from 'react-draft-wysiwyg';
import { TextField } from 'redux-form-material-ui';
import CustomSelectField from 'components/CustomSelectField';
import MenuItem from 'material-ui/MenuItem';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './styles.css';
import RaisedButton from 'material-ui/RaisedButton';

const renderJours = (
  { input, label, meta: { touched, error }, ...custom } // eslint-disable-line
) =>
  <CustomSelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    {...custom}
  >
    <MenuItem value={0} primaryText="Lundi" />
    <MenuItem value={1} primaryText="Mardi" />
    <MenuItem value={2} primaryText="Mercredi" />
    <MenuItem value={3} primaryText="Jeudi" />
    <MenuItem value={4} primaryText="Vendredi" />
    <MenuItem value={5} primaryText="Samedi" />
    <MenuItem value={6} primaryText="Dimanche" />
  </CustomSelectField>;

const renderDistributionJours = (
  { fields, meta: { error } } // eslint-disable-line
) =>
  <div className="row">
    <div className="col-md-12" style={{ textAlign: 'right', marginBottom: '1em', marginTop: '2em' }}>
      <RaisedButton primary label=" + Nouvelle distribution" onTouchTap={() => fields.push()} />
    </div>
    <div className="col-md-12">
      {fields.map((distribution, index) =>
        <div
          className="row"
          key={index}
          style={{ marginBottom: '0.5em', padding: '0 1em 0.5em 1em 1em', border: 'solid 1px silver' }}
        >
          <div className="col-md-3">
            <Field
              name={`${distribution}.jour`}
              floatingLabelText="Jour"
              component={renderJours}
              fullWidth
              disabled={false}
              style={{ lineHeight: '30px', fontSize: 14 }}
            />
          </div>
          <div className="col-md-3">
            <Field
              name={`${distribution}.heureDebut`}
              floatingLabelText="Début"
              component={TextField}
              fullWidth
              disabled={false}
              style={{ lineHeight: '30px', fontSize: 14 }}
            />
          </div>
          <div className="col-md-3">
            <Field
              name={`${distribution}.heureFin`}
              floatingLabelText="Fin"
              component={TextField}
              fullWidth
              disabled={false}
              style={{ lineHeight: '30px', fontSize: 14 }}
            />
          </div>
          <div className="col-md-3" style={{ marginTop: '1em' }}>
            <RaisedButton
              label="supprimer"
              onTouchTap={() => fields.remove(index)}
              backgroundColor="red"
              labelStyle={{ color: 'white' }}
            />
          </div>
        </div>
      )}
    </div>
  </div>;

const options = {
  options: ['inline', 'textAlign', 'link', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline'],
  },
  list: {
    inDropdown: false,
    className: undefined,
    options: ['unordered', 'ordered'],
  },
};

class RelaisForm extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    changePresentation: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { presentation } = this.props.initialValues; // eslint-disable-line

    this.state = {
      rawHtml: this.getInitialHTML(presentation),
    };
  }

  state = {
    rawHtml: null,
  };

  componentDidMount = () => {
    // this.nom.focus();
  };

  onEditorChange = editorContent => {
    const html = draftToHtml(editorContent);
    this.props.changePresentation(html);
    this.setState({ ...this.state, html });
  };

  getInitialHTML(html) {
    const contentBlocks = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return convertToRaw(contentState);
  }

  render() {
    const { handleSubmit, pending, pristine } = this.props;
    return (
      <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
        <div className="row">
          <div className="col-md-6">
            <Editor
              editorClassName={styles.editorClass}
              toolbar={options}
              onChange={this.onEditorChange}
              initialContentState={this.state.rawHtml}
            />
            <FieldArray name="distributionJours" component={renderDistributionJours} />
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <Field
                  cols="6"
                  inputStyle={{ textTransform: 'uppercase' }}
                  floatingLabelText="Nom du relais"
                  name="nom"
                  fullWidth
                  component={TextField}
                  ref={node => (this.nom = node)}
                />
              </div>
              <div className="col-md-6">
                <Field cols="6" floatingLabelText="Adresse" name="adresse" component={TextField} />
              </div>
              <div className="col-md-6">
                <Field
                  cols="6"
                  floatingLabelText="Adresse complémentaire"
                  name="adressComplementaire"
                  component={TextField}
                />
              </div>
              <div className="col-md-6">
                <Field cols="6" floatingLabelText="Code postal" name="codePostal" component={TextField} />
              </div>
              <div className="col-md-6">
                <Field
                  cols="6"
                  inputStyle={{ textTransform: 'uppercase' }}
                  floatingLabelText="Ville"
                  name="ville"
                  component={TextField}
                />
              </div>
              <div className="col-md-6">
                <Field
                  cols="6"
                  floatingLabelText="Télephone portable"
                  name="telPortable"
                  component={TextField}
                />
              </div>
              <div className="col-md-6">
                <Field cols="6" floatingLabelText="Télephone fixe" name="telFixe" component={TextField} />
              </div>
              <div className="col-md-6">
                <Field cols="6" floatingLabelText="Adresse email" name="email" component={TextField} />
              </div>
              <div className="col-md-6">
                <Field
                  cols="6"
                  floatingLabelText="Durée Période Distrib (minutes)"
                  name="rangeDistribMinutes"
                  component={TextField}
                />
              </div>
            </div>
          </div>

          <div className="col-md-12" style={{ minHeight: 52 }}>
            {!pristine &&
              <div className="row center-md">
                <div className={`col-md-4 ${styles.formFooter}`}>
                  <RaisedButton type="submit" label="Valider" primary fullWidth disabled={pending} />
                </div>
              </div>}
          </div>
        </div>
      </form>
    );
  }
}

const relaisForm = reduxForm({
  form: 'relais',
})(RelaisForm);

export default relaisForm;
