import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import moment from 'moment';

export default class NouvelleCommandeDistribution extends Component {  // eslint-disable-line
  static propTypes = {
    delDistrib: PropTypes.func.isRequired,
    addDistrib: PropTypes.func.isRequired,
    distributions: PropTypes.array.isRequired,
  }

  state = {
    dateLimite: null,
    heureDebut: null,
    heureFin: null,
  }


  render() {
    const { addDistrib, delDistrib, distributions } = this.props;
    const { dateLimite, heureDebut, heureFin } = this.state;
    return (
      <div className="row center-md" style={{ paddingTop: '2em' }}>
        <div className="col-md-10">
          <div className="row center-md">
            <div className="col-md">
              <DatePicker
                name="dateLimite"
                hintText="Date limite"
                floatingLabelText="Date limite"
                fullWidth
                mode="landscape"
                autoOk
                locale="fr"
                okLabel="OK"
                cancelLabel="Annuler"
                DateTimeFormat={Intl.DateTimeFormat}
                onChange={(event, value) => this.setState((oldVal) => ({ ...oldVal, dateLimite: value }))}
              />
            </div>
            <div className="col-md">
              <TimePicker
                name="heureDebut"
                format="24hr"
                floatingLabelText="Heure début"
                hintText="Heure début"
                autoOk
                fullWidth
                okLabel="OK"
                cancelLabel="Annuler"
                onChange={(event, value) => this.setState((oldVal) => ({ ...oldVal, heureDebut: value }))}
              />
            </div>
            <div className="col-md">
              <TimePicker
                name="heureFin"
                format="24hr"
                floatingLabelText="Heure fin"
                hintText="Heure fin"
                autoOk
                fullWidth
                okLabel="OK"
                cancelLabel="Annuler"
                onChange={(event, value) => this.setState((oldVal) => ({ ...oldVal, heureFin: value }))}
              />
            </div>
            <div className="col-md">
              <RaisedButton
                label="+"
                primary
                fullWidth
                style={{ marginTop: '1.2em' }}
                onClick={() => addDistrib({
                  debut: `${moment(dateLimite).format('YYYY-MM-DD')}T${moment(heureDebut).format('HH:mm')}`,
                  fin: `${moment(dateLimite).format('YYYY-MM-DD')}T${moment(heureFin).format('HH:mm')}`,
                })}
              />
            </div>
          </div>
          <div className="row center-md">
            <div className="col-md">
              <ul style={{ listStyleType: 'none' }}>
                {distributions.map((dist, idx) => (
                  <li key={idx}>
                    {`Le ${moment(dist.debut).format('dddd DD/MM [de] HH:mm')} à ${moment(dist.fin).format('HH:mm')}`}
                    <IconButton
                      tooltip="Supprimer cette distribution"
                      onClick={() => delDistrib(idx)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
