import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import DoneIcon from 'material-ui/svg-icons/action/done';
import WaitIcon from 'material-ui/svg-icons/action/query-builder';
import TouchIcon from 'material-ui/svg-icons/action/touch-app';

import EyeIcon from 'material-ui/svg-icons/action/visibility';
import FailIcon from 'material-ui/svg-icons/action/report-problem';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import classnames from 'classnames';

import { loadCommunications, deleteCommunication } from 'containers/AdminCommunication/actions';
import Panel from 'components/Panel';
import styles from './styles.css';
const bigIcon = { height: 100, width: 100 };

const etatIcons = {
  attente: () => <WaitIcon />,
  succes: () => <DoneIcon />,
  echec: () => <FailIcon />,
  open: () => <EyeIcon />,
  click: () => <TouchIcon />,
};

class CommunicationHistorique extends Component {
  static propTypes = {
    communications: PropTypes.array.isRequired,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
  };

  state = {
    idSelected: null,
  };

  componentDidMount() {
    const { communications, load } = this.props;
    if (!communications.length) {
      load();
    }
  }

  handleSuppression = id => {
    if (confirm('Supprimer cette communication ?')) {
      this.props.del(id);
    }
  };

  render() {
    const { communications } = this.props;
    const { idSelected } = this.state;
    const communication = idSelected ? communications.find(d => d.id === idSelected) : null;

    return (
      <Paper className={styles.panel}>
        <div className="row">
          <div className={`col-md-2 ${styles.scroll}`}>
            <List>
              {communications.map((com, idx) => (
                <ListItem
                  key={idx}
                  primaryText={com.objet}
                  onClick={() => this.setState({ idSelected: com.id })}
                />
              ))}
            </List>
          </div>
          <div className={classnames('col-md-4', styles.scroll)}>
            {!idSelected && <p style={{ textAlign: 'center' }}>Sélectionnez une communication</p>}
            {idSelected &&
              communication &&
              <List>
                {communication.destinataires.map((d, idx) => (
                  <ListItem
                    key={idx}
                    primaryText={d.identite}
                    leftIcon={d.telPortable ? <MessageIcon /> : <EmailIcon />}
                    rightIcon={etatIcons[d.etat]()}
                  />
                ))}
              </List>}
          </div>
          <div className={classnames('col-md-6', 'textCenter')}>
            {idSelected && communication && <h1>{communication.objet}</h1>}
            {idSelected &&
              communication &&
              communication.messageCourt &&
              <Panel>
                <div className="row">
                  <div className="col-md-4">
                    <MessageIcon style={bigIcon} />
                  </div>
                  <div className="col-md-8">
                    {communication.messageCourt}
                  </div>
                </div>
              </Panel>}
            {communication &&
              communication.messageLong &&
              <Panel>
                <div className="row">
                  <div className="col-md-4">
                    <EmailIcon style={bigIcon} />
                  </div>
                  <div className="col-md-8">
                    <p
                      dangerouslySetInnerHTML={{ __html: communication.messageLong }} // eslint-disable-line
                    />
                  </div>
                </div>
              </Panel>}
            {communication &&
              <div className="row center-md">
                <div className="col-md">
                  <RaisedButton
                    label="Supprimer"
                    secondary
                    style={{ marginTop: 20 }}
                    onClick={() => this.handleSuppression(communication.id)}
                    icon={<TrashIcon />}
                  />
                </div>
              </div>}
          </div>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  communications: state.admin ? state.admin.communication.datas : [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      load: loadCommunications,
      del: deleteCommunication,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationHistorique);
