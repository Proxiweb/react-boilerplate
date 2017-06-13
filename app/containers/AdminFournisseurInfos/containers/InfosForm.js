import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import { reduxForm, Field } from 'redux-form';
import { TextField, Toggle } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FournisseurRelais from 'containers/AdminFournisseurInfos/components/FournisseurRelais';

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
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    ajouteRelais: PropTypes.func.isRequired,
    retireRelais: PropTypes.func.isRequired,
    changePresentation: PropTypes.func.isRequired,
    // valeurs: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    const { presentation } = this.props.initialValues; // eslint-disable-line

    this.state = {
      rawHtml: this.getInitialHTML(presentation || '<p>description</p>'),
    };
  }

  state = {
    rawHtml: null,
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
    const {
      pristine,
      pending,
      handleSubmit,
      relais,
      fournisseur,
      ajouteRelais,
      retireRelais,
    } = this.props;
    return (
      <form className={classnames(styles.infoForm)} onSubmit={handleSubmit}>
        <Tabs
          inkBarStyle={{
            height: 7,
            backgroundColor: this.context.muiTheme.appBar.color,
            marginTop: -7,
          }}
        >
          <Tab label="Identité" value="Identité">
            <div className={`row center-md ${styles.tab}`}>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Nom"
                  name="nom"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Adresse"
                  name="adresse"
                  component={TextField}
                  fullWidth
                />
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
                <Field
                  floatingLabelText="email"
                  name="email"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Tél. portable"
                  name="telPortable"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Tél. fixe"
                  name="telFixe"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Code postal"
                  name="codePostal"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Ville"
                  name="ville"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Tva"
                  name="tva"
                  component={TextField}
                  fullWidth
                />
              </div>
              <div className="col-md-6">
                <Field
                  floatingLabelText="Siret"
                  name="siret"
                  component={TextField}
                  fullWidth
                />
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
          </Tab>
          <Tab label="Relais" value="Relais">
            <div className={`row center-md ${styles.tab}`}>
              <div className="col-md-6">
                <Field
                  label="Livre tous les relais"
                  name="livraisonGlobale"
                  component={Toggle}
                  fullWidth
                />
              </div>
              <div className="col-md-10">
                {relais &&
                  fournisseur &&
                  <FournisseurRelais
                    fournisseur={fournisseur}
                    relais={relais}
                    ajouteRelais={ajouteRelais}
                    retireRelais={retireRelais}
                  />}

              </div>
            </div>
          </Tab>
          <Tab label="Divers" value="Divers">
            <div className={`row center-md ${styles.tab}`}>
              <div className="col-md-6">
                <Field
                  label="Auto-Entrepreneur"
                  name="autoEntrepreneur"
                  component={Toggle}
                  fullWidth
                />
              </div>
            </div>
          </Tab>
        </Tabs>

        {!pristine &&
          <div className="row center-md">
            <div className={`col-md-4 ${styles.formFooter}`}>
              <RaisedButton
                fullWidth
                type="submit"
                label="Valider"
                primary
                disabled={pending}
              />
            </div>
          </div>}
      </form>
    );
  }
}

const infosForm = reduxForm({
  form: 'info_fournisseur',
})(InfosForm);

export default infosForm;
