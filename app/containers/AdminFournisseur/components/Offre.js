import React, { PropTypes, Component } from 'react';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';

import styles from './styles.css';
import OffreDetailsCard from 'components/OffreDetailsCard';


export default class Offre extends Component { // eslint-disable-line
  static propTypes = {
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
    handleToggeState: PropTypes.func.isRequired,
  }

  render() {
    const { offre, typeProduit, handleToggeState } = this.props;
    return (
      <div className="row">
        <div className="col-md-10">
          {
            <div className={`row ${styles.offre}`}>
              <div className="col-md-12">
                <OffreDetailsCard offre={offre} typeProduit={typeProduit} />
              </div>
            </div>
          }
        </div>
        <div className="col-md-2">
          <IconButton
            onClick={handleToggeState}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleToggeState}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}
