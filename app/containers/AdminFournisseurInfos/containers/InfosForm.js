import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import Paper from 'material-ui/Paper';
import { TextField } from 'redux-form-material-ui';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const options = {
  options: ['inline', 'list', 'textAlign', 'link', 'remove', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  list: {
    inDropdown: false,
    className: undefined,
    options: ['unordered', 'ordered'],
  },
};

import classnames from 'classnames';
import styles from './styles.css';

class InfosForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    valeurs: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    const { description } = this.props.initialValues; // eslint-disable-line

    this.state = {
      rawHtml: this.getInitialHTML(description || '<p>description</p>'),
    };
  }

  state = {
    rawHtml: null,
  };

  onEditorChange = editorContent => {
    const html = draftToHtml(editorContent);
    this.props.changeDescription(html);
    this.setState({ ...this.state, html });
  };

  getInitialHTML(html) {
    const contentBlocks = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return convertToRaw(contentState);
  }

  render() {
    return (
      <form className={classnames(styles.infoForm)}>
        <div className="row">
          <div className="col-md-6">
            <Field floatingLabelText="Nom" name="nom" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Adresse" name="adresse" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field
              floatingLabelText="Adresse complémentaire"
              name="adresseComplementaire"
              component={TextField}
              fullWidth
            />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="email" name="email" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Tél. portable" name="telPortable" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Tél. fixe" name="telFixe" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Code postal" name="codePostal" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Ville" name="ville" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Tva" name="tva" component={TextField} fullWidth />
          </div>
          <div className="col-md-6">
            <Field floatingLabelText="Siret" name="siret" component={TextField} fullWidth />
          </div>
          <div className="col-md-12" style={{ textAlign: 'left' }}>
            <Editor
              editorClassName={styles.editorClass}
              toolbar={options}
              onChange={this.onEditorChange}
              initialContentState={this.state.rawHtml}
            />
          </div>
        </div>
      </form>
    );
  }
}

const infosForm = reduxForm({
  form: 'info_fournisseur',
})(InfosForm);

export default infosForm;
