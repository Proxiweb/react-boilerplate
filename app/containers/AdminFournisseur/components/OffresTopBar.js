import React, { Component, PropTypes } from 'react';
import Panel from 'components/Panel';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import AddIcon from 'material-ui/svg-icons/content/add';

import styles from './styles.css';

const radioStyle = {
  display: 'inline-block',
  width: '200px',
};

export default class OffresTopBar extends Component { // eslint-disable-line
  static propTypes = {
    onChangeType: PropTypes.func.isRequired,
    onNewOffer: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  render() {
    const { onChangeType, onNewOffer, type } = this.props;
    return (
        <div className="row top-md">
          <div className={`col-md-9 ${styles.panelTitre}`}>
            <RadioButtonGroup
              valueSelected={type}
              style={{ display: 'inline-block' }}
              onChange={onChangeType}
            >
              <RadioButton
                value="actives"
                label="Offres actives"
                style={radioStyle}
              />
              <RadioButton
                value="inactives"
                label="Offres inactives"
                style={radioStyle}
              />
            </RadioButtonGroup>
          </div>
          <div className={`col-md-3 ${styles.panelAction}`}>
            <IconButton style={{ padding: 0, width: '27px', height: '27px' }}
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
