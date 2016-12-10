import React, { Component, PropTypes } from 'react';
import Panel from 'components/Panel';
import FlatButton from 'material-ui/FlatButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import styles from './styles.css';
export default class Produit extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
  }

  state = {
    editMode: false,
  }

  render() {
    const { produit } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <Panel>
            <div className="row">
              <div className={`col-md-8 ${styles.panelTitre}`}>{produit.nom}</div>
              <div className={`col-md-4 ${styles.panelAction}`}>
                <FlatButton
                  style={{ textAlign: 'right' }}
                  icon={<EditIcon />}
                />
              </div>
            </div>
          </Panel>
        </div>
        <div className={`col-md-12 ${styles.photo}`}>
          <img
            src={`https://proxiweb.fr/${produit.photo}`}
            alt={produit.nom}
            style={{ width: '100%', height: 'auto', maxWidth: 200, border: 'solid 1px gray' }}
          />
        </div>
        <div className={`col-md-12 ${styles.photo}`}>
          <div dangerouslySetInnerHTML={{ __html: produit.description }} />
        </div>
      </div>
    );
  }
}
