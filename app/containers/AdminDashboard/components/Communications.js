import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import truncate from 'lodash/truncate';

import CustomSelectField from 'components/CustomSelectField';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import DoneIcon from 'material-ui/svg-icons/action/done';
import WaitIcon from 'material-ui/svg-icons/action/hourglass-empty';
import SpamIcon from 'material-ui/svg-icons/action/bookmark';
import BlockedIcon from 'material-ui/svg-icons/content/block';
import FailedIcon from 'material-ui/svg-icons/alert/error-outline';
import OpenIcon from 'material-ui/svg-icons/action/visibility';
import ClickIcon from 'material-ui/svg-icons/action/touch-app';
import UnknownIcon from 'material-ui/svg-icons/action/help';

import Panel from './Panel';

import { loadCommunications } from 'containers/AdminCommunication/actions';
import { selectCommunications } from 'containers/AdminCommunication/selectors';
import styles from './styles.css';

class Communications extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    communications: PropTypes.array.isRequired,
  };

  state = {
    communicationId: null,
  };

  componentDidMount = () => this.props.load();

  handleComChange = (event, index, communicationId) => this.setState({ communicationId });

  buildLeftIcon = destinataire => {
    const { etat } = destinataire;
    let icon;
    switch (etat) {
      case 'attente':
        icon = <WaitIcon />;
        break;
      case 'click':
        icon = <ClickIcon />;
        break;
      case 'succes':
        icon = <DoneIcon />;
        break;
      case 'echec':
        icon = <FailedIcon />;
        break;
      case 'open':
        icon = <OpenIcon />;
        break;
      case 'spam':
        icon = <SpamIcon />;
        break;
      case 'blocked':
        icon = <BlockedIcon />;
        break;
      default:
        icon = <UnknownIcon />;
    }
    return icon;
  };

  render() {
    const { communications } = this.props;
    const { communicationId } = this.state;

    return (
      <Panel title="Dernières communications">
        {communications.length > 0 &&
          <CustomSelectField
            floatingLabelText="Objet du message"
            value={this.state.communicationId}
            fullWidth
            onChange={this.handleComChange}
          >
            {communications.map((com, idx) =>
              <MenuItem value={com.id} key={idx} primaryText={truncate(com.objet, { length: 40 })} />
            )}
          </CustomSelectField>}
        {communicationId &&
          <div className={styles.listDest}>
            <List>
              {communications
                .find(c => c.id === communicationId)
                .destinataires.map((d, idx) =>
                  <ListItem
                    key={idx}
                    primaryText={d.email || d.telephone}
                    disabled
                    leftIcon={this.buildLeftIcon(d)}
                  />
                )}
            </List>
          </div>}
      </Panel>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  communications: selectCommunications(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadCommunications,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Communications);
