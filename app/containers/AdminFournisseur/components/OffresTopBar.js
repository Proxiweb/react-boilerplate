import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';

import styles from './styles.css';

export default class OffresTopBar extends Component { // eslint-disable-line
  static propTypes = {
    onNewOffer: PropTypes.func.isRequired,
  }

  render() {
    const { onNewOffer } = this.props;
    return (
      <div className="row top-md">
        <div className={`col-md-3 col-md-offset-9 ${styles.panelAction}`}>
          <IconButton
            style={{ padding: 0, width: '27px', height: '27px' }}
            tooltip="Nouvelle offre"
            onClick={onNewOffer}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}
