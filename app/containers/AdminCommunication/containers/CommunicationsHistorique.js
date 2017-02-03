import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import classnames from 'classnames';

import { loadCommunications, deleteCommunication } from 'containers/AdminCommunication/actions';
import Panel from 'components/Panel';
import styles from './styles.css';
const bigIcon = { height: 100, width: 100 };

class CommunicationHistorique extends Component {
  static propTypes = {
    communications: PropTypes.array.isRequired,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
  }

  state = {
    idSelected: null,
  }

  componentDidMount() {
    const { communications, load } = this.props;
    if (!communications.length) {
      load();
    }
  }

  render() {
    const { communications, del } = this.props;
    const { idSelected } = this.state;
    const communication = idSelected ? communications.find((d) => d.id === idSelected) : null;

    return (
      <div className="row">
        <div className={classnames('col-md-2', styles.panel)}>
          <List>
            {communications.map((com, idx) =>
              <ListItem key={idx} primaryText={com.objet} onClick={() => this.setState({ idSelected: com.id })} />
            )}
          </List>
        </div>
        <div className={classnames('col-md-4', styles.panel)}>
          { !idSelected && <p style={{ textAlign: 'center' }}>Sélectionnez une communication</p>}
          { idSelected && (
            <List>
              {communication.destinataires.map((d, idx) =>
                <ListItem key={idx} primaryText={d.denomination} />
              )}
            </List>
          )}
        </div>
        { idSelected && (
          <div className={classnames('col-md-6', styles.panel, 'textCenter')}>
            <h1>{communication.objet}</h1>
            {communication.messageCourt && <Panel>
              <div className="row">
                <div className="col-md-4">
                  <MessageIcon style={bigIcon} />
                </div>
                <div className="col-md-8">
                  {communication.messageCourt}
                </div>
              </div>
            </Panel>}
            {communication.messageLong && <Panel>
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
            <div className="row center-md">
              <div className="col-md">
                <RaisedButton
                  label="Supprimer"
                  secondary
                  style={{ marginTop: 20 }}
                  onClick={() => del(communication.id)}
                  icon={<TrashIcon />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  communications: state.admin ? state.admin.communication.datas : [],
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadCommunications,
  del: deleteCommunication,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationHistorique);
