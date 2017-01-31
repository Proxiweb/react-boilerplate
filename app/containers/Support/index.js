import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { saveMessage } from 'containers/App/actions';
import { selectPending } from 'containers/App/selectors';

import {
  selectCompteUtilisateur,
} from 'containers/CompteUtilisateur/selectors';

const options = {
  options: [
    'inline', 'link',
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
};

import styles from './styles.css';

class Support extends Component { // eslint-disable-line
  static propTypes = {
    user: PropTypes.object.isRequired,
    envoyer: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  }

  state = {
    objet: null,
    message: null,
  }

  onEditorChange = (editorContent) =>
    this.setState({ ...this.state, message: draftToHtml(editorContent) })

  handleObjetChange = (event, index, objet) => this.setState({ objet });

  handleEnvoyer = () =>
    this.props.envoyer({
      ...this.state,
      de: this.props.user.id,
      a: '3c3fff89-9604-4729-b794-69dd60005dfe',
      identiteExpediteur:
        `${capitalize(this.props.user.prenom)} ${this.props.user.nom.toUpperCase()}`,
    });

  render() {
    const { pending } = this.props;
    const { objet, message } = this.state;
    const valide = objet && message;
    return (
      <div className="row center-md">
        <div className="col-md-6">
          <Paper style={{ padding: '1em' }}>
            <div className="row center-md">
              <div className="col-md-8">
                <h2>Contacter le support</h2>
                <SelectField
                  floatingLabelText="Objet du message"
                  value={objet}
                  fullWidth
                  onChange={this.handleObjetChange}
                >
                  <MenuItem value="bug" primaryText="Bug / Signaler un problème" />
                  <MenuItem value="suggestion" primaryText="Suggérer un produit" />
                  <MenuItem value="autre" primaryText="Autre" />
                </SelectField>
                <Editor
                  toolbarClassName={styles.toolbarClass}
                  editorClassName={styles.editorClass}
                  toolbar={options}
                  onChange={this.onEditorChange}
                />
              </div>
              <div className="col-md-6">
                <RaisedButton
                  disabled={!valide && !pending}
                  type="submit"
                  label={pending ? 'Envoi...' : 'Envoyer'}
                  primary
                  fullWidth
                  onClick={this.handleEnvoyer}
                />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectCompteUtilisateur(),
  pending: selectPending(),
});

const mapDispatchToProps = (dispatch) => ({
  envoyer: (message) => dispatch(saveMessage(message, '/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
