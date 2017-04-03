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
    setMessage: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
    nbreDest: PropTypes.number.isRequired,
    smsOk: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const { html, sms, objet } = this.props.message;
    this.state = { sms, html, objet, error: null, rawHtml: this.getInitialHTML(html) };
  }

  componentWillUnmount() {
    const { html, sms, objet } = this.state;
    this.props.setMessage({ html, sms, objet });
  }

  onEditorChange = (editorContent) => this.setState({ html: draftToHtml(editorContent) })

  getInitialHTML(html) {
    const contentBlocks = convertFromHTML(html);
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
    if (!this.props.nbreDest) return false;
    return true;
  }

  render() {
    const { sms, objet, html, rawHtml, smsOk } = this.state;
    if (!html) return null;
    return (
      <div className={`row ${styles.form}`}>
        <div className="col-md-12">
          {smsOk === false && <p className={styles.msgSmsKo}>{'L\'envoi d\'sms est désactivé.'}</p>}
          {smsOk && <TextField
            hintText="Texte du sms"
            floatingLabelText={`Texte du sms (${140 - this.state.sms.length} car. restant)`}
            multiLine
            fullWidth
            rows={3}
            onChange={this.handleSmsChange}
            value={this.state.sms}
          />}
          <TextField
            hintText="objet du mail"
            floatingLabelText="Objet du mail"
            fullWidth
            onChange={this.handleObjetChange}
            value={this.state.objet}
          />
        </div>
        <div className="col-md-12">
          <Editor
            editorClassName={styles.editorClass}
            toolbar={options}
            onChange={this.onEditorChange}
            initialContentState={rawHtml}
          />
        </div>
        <div className="col-md-12">
          <div className="row center-md">
            <div className="col-md" style={{ marginTop: '2rem' }}>
              <RaisedButton
                label="envoyer"
                disabled={!this.isValid()}
                primary
                onClick={() => this.props.onSubmit({ message: this.state.html, objet, sms })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommunicationForm;
