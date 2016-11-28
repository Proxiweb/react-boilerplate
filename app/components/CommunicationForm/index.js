import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './styles.css';

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

class CommunicationForm extends Component { // eslint-disable-line
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const { html, sms, objet } = this.props.message;
    this.state = { sms, html, objet, error: null, rawHtml: this.getInitialHTML(html) };
  }

  onEditorChange = (editorContent) => this.setState({ html: draftToHtml(editorContent) })

  getInitialHTML(html) {
    const contentBlocks = convertFromHTML('<p>oooo</p>');
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return convertToRaw(contentState);
  }

  handleObjetChange = (event) => this.setState({ objet: event.target.value })

  handleSmsChange = (event) => this.setState({ sms: event.target.value })


  isValid = () => {
    const { html, objet } = this.state;
    if (html.length > 0 && objet.length === 0) {
      return false;
    }
    return true;
  }

  render() {
    const { sms, message, objet, html, rawHtml } = this.state;
    console.log('r', rawHtml);
    if (!html) return null;
    return (
      <div className="row">
        <div className="col-md-12">
          <TextField
            hintText="Texte du sms"
            floatingLabelText={`Texte du sms (${140 - this.state.sms.length} car. restant)`}
            multiLine
            fullWidth
            rows={3}
            onChange={this.handleSmsChange}
          />
        </div>
        <div className="col-md-12">
          <TextField
            hintText="objet du mail"
            floatingLabelText="Objet du mail"
            fullWidth
            onChange={this.handleObjetChange}
          />
        </div>
        <div className="col-md-12">
          <Editor
            editorClassName={styles.editorClass}
            toolbar={options}
            onChange={this.onEditorChange}
            rawContentState={rawHtml}
          />
        </div>
        <div className="col-md-12">
          <div className="row center-md">
            <div className="col-md" style={{ marginTop: '2rem' }}>
              <RaisedButton
                label="envoyer"
                disabled={!this.isValid()}
                primary
                onClick={() => this.props.onSubmit({ message, objet, sms })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommunicationForm;
