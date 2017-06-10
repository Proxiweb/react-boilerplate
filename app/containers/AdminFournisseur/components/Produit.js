import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Editor } from 'react-draft-wysiwyg';

// import draftToHtml from 'draftjs-to-html';
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import PhotoIcon from 'material-ui/svg-icons/image/photo';
// import DoneIcon from 'material-ui/svg-icons/action/done';

import styles from './styles.css';

export default class Produit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    setEditView: PropTypes.func.isRequired,
  };

  state = {
    editMode: false,
  };

  getInitialHTML = () => {
    const contentBlocks = convertFromHTML(this.props.produit.description);
    return convertToRaw(ContentState.createFromBlockArray(contentBlocks));
  };

  render() {
    const { produit } = this.props;

    return (
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'right' }}>
          <IconButton
            tooltip="modifier ce produit"
            style={{ padding: 0, width: '27px', height: '27px' }}
            onClick={() => this.props.setEditView('produit')}
          >
            <EditIcon />
          </IconButton>
        </div>
        <div className={`col-md-12 ${styles.photo}`}>
          {!produit.photo &&
            <div className={styles.sansPhoto}>
              <PhotoIcon color="gray" style={{ height: '200px', width: '200px' }} />
            </div>}
          {produit.photo &&
            <img
              src={
                produit.photo.search('http') !== -1 ? produit.photo : `https://proxiweb.fr/${produit.photo}`
              }
              alt={produit.nom}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: 200,
                border: 'solid 1px gray',
              }}
            />}
          <div
            className={styles.textLeft}
            dangerouslySetInnerHTML={{ __html: produit.description }} // eslint-disable-line
          />
        </div>
      </div>
    );
  }
}
