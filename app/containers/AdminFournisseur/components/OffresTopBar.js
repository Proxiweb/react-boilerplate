import React, { Component } from 'react'; import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import styles from './styles.css';

export default class OffresTopBar extends Component {
  // eslint-disable-line
  static propTypes = {
    onNewOffer: PropTypes.func.isRequired,
  };

  render() {
    const { onNewOffer } = this.props;
    return (
      <div className="row top-md">
        <div className={`col-md-3 col-md-offset-9 ${styles.panelAction}`}>
          <FloatingActionButton tooltip="Nouvelle offre" onClick={onNewOffer} mini>
            <AddIcon />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}
