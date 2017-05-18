import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class DateLimiteDialog extends Component {
  static propTypes = {
    dateLimite: PropTypes.string,
    changeDateLimite: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  render() {
    const { open, dateLimite, changeDateLimite, handleClose } = this.props;
    console.log(dateLimite);
    return (
      <Dialog
        title="Modifier la date limite"
        actions={[
          <FlatButton label="Terminé" primary onTouchTap={handleClose} />,
        ]}
        modal={false}
        open={open}
        onRequestClose={this.handleClose}
      >
        <form>
          <div className={'row center-md'}>
            <div className="col-md-6">
              <DatePicker
                hintText="Date limite"
                floatingLabelText="Date limite"
                fullWidth
                mode="landscape"
                autoOk
                locale="fr"
                okLabel="OK"
                cancelLabel="Annuler"
                DateTimeFormat={Intl.DateTimeFormat}
                onChange={(event, value) =>
                  changeDateLimite('dateLimite', value)}
                value={dateLimite ? new Date(dateLimite) : new Date()}
              />
            </div>
            <div className="col-md-6">
              <TimePicker
                format="24hr"
                floatingLabelText="Heure limite"
                hintText="Heure limite"
                autoOk
                fullWidth
                okLabel="OK"
                cancelLabel="Annuler"
                onChange={(event, value) =>
                  changeDateLimite('heureLimite', value)}
                value={dateLimite ? new Date(dateLimite) : new Date()}
              />
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}

export default DateLimiteDialog;
