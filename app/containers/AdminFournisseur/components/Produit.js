import React, { Component, PropTypes } from 'react';
// import AvatarEditor from 'react-avatar-editor';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DoneIcon from 'material-ui/svg-icons/action/done';

import styles from './styles.css';
import ProduitFormContainer from './ProduitFormContainer';

const options = {
  options: [
    'inline', 'list', 'link', 'remove', 'textAlign',
  ],
  inline: {
    inDropdown: true,
    className: undefined,
    options: ['bold', 'underline'],
  },
  list: {
    inDropdown: true,
    className: undefined,
    options: ['unordered'],
  },
  history: { inDropdown: true },
  textAlign: { inDropdown: true },
};

export default class Produit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
  }

  state = {
    editMode: false,
  }

  onEditorChange = (editorContent) => console.log(editorContent)


  getInitialHTML = () => {
    const contentBlocks = convertFromHTML(this.props.produit.description);
    return convertToRaw(ContentState.createFromBlockArray(contentBlocks));
  }

  toggleState = () => this.setState({ editMode: !this.state.editMode })

  render() {
    const { produit } = this.props;
    const { editMode } = this.state;

    return (
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'right' }}>
          <IconButton
            tooltip={editMode ? 'Sauvegarder les modifications' : 'modifier ce produit'}
            style={{ padding: 0, width: '27px', height: '27px' }}
            onClick={this.toggleState}
          >
            {editMode && <DoneIcon />}
            {!editMode && <EditIcon />}
          </IconButton>
        </div>
        <div className={`col-md-12 ${styles.photo}`}>
          <img
            src={`https://proxiweb.fr/${produit.photo}`}
            alt={produit.nom}
            style={{ width: '100%', height: 'auto', maxWidth: 200, border: 'solid 1px gray' }}
          />
        </div>
        <div className={`col-md-12 ${styles.photo}`}>
          {!editMode && <div dangerouslySetInnerHTML={{ __html: produit.description }} />}
          {false && (
            <Editor
              editorClassName={styles.editorClass}
              toolbar={options}
              onChange={this.onEditorChange}
              initialContentState={this.getInitialHTML()}
            />
          )}
          {editMode && <ProduitFormContainer produit={produit} />}
        </div>
      </div>
    );
  }
}
