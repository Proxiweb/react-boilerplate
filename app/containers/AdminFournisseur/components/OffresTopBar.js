import React, { Component, PropTypes } from 'react';
import Panel from 'components/Panel';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import AddIcon from 'material-ui/svg-icons/content/add';

import styles from './styles.css';

const radioStyle = {
  display: 'inline-block',
  width: '150px',
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
      <Panel>
        <div className="row">
          <div className={`col-md-8 ${styles.panelTitre}`}>
            <div style={radioStyle}>Offres</div>
            <RadioButtonGroup
              valueSelected={type}
              style={{ display: 'inline-block' }}
              onChange={onChangeType}
            >
              <RadioButton
                value="actives"
                label="actives"
                style={radioStyle}
              />
              <RadioButton
                value="inactives"
                label="inactives"
                style={radioStyle}
              />
            </RadioButtonGroup>
          </div>
          <div className={`col-md-4 ${styles.panelAction}`}>
            <FlatButton
              label="Nouvelle offre"
              style={{ textAlign: 'right' }}
              icon={<AddIcon />}
              onClick={onNewOffer}
            />
          </div>
        </div>
      </Panel>
    );
  }
}
