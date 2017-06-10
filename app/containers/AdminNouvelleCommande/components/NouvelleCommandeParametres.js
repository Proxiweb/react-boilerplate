import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import DatePicker from "material-ui/DatePicker";
import TimePicker from "material-ui/TimePicker";

export default class NouvelleCommandeParametres extends Component {
  // eslint-disable-line
  static propTypes = {
    changeParam: PropTypes.func.isRequired,
    parametres: PropTypes.object.isRequired
  };
  render() {
    const { changeParam, parametres } = this.props;
    return (
      <div className="row center-md" style={{ paddingTop: "2em" }}>
        <div className="col-md-6">
          <TextField
            name="resume"
            fullWidth
            floatingLabelText="Texte résumant la commande (facultatif)"
            onChange={(event, value) => changeParam("resume", value)}
            value={parametres.resume}
          />
          <div className="row center-md">
            <div className="col-md">
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
                onChange={(event, value) => changeParam("dateLimite", value)}
                value={parametres.dateLimite}
              />
            </div>
            <div className="col-md">
              <TimePicker
                format="24hr"
                floatingLabelText="Heure limite"
                hintText="Heure limite"
                autoOk
                fullWidth
                okLabel="OK"
                cancelLabel="Annuler"
                onChange={(event, value) => changeParam("heureLimite", value)}
                value={parametres.heureLimite}
              />
            </div>
          </div>
          <div className="row center-md">
            <div className="col-md-6">
              <TextField
                name="montantMin"
                fullWidth
                floatingLabelText="montant min. global"
                onChange={(event, value) => changeParam("montantMin", value)}
                value={parametres.montantMin}
              />
            </div>
            <div className="col-md-6">
              <TextField
                name="montantMinRelai"
                fullWidth
                floatingLabelText="montant min / relais"
                onChange={(event, value) => changeParam("montantMinRelai", value)}
                value={parametres.montantMinRelai}
              />
            </div>
            <div className="col-md-6">
              <TextField
                name="qteMin"
                fullWidth
                floatingLabelText="quantité min. globale"
                onChange={(event, value) => changeParam("qteMin", value)}
                value={parametres.montantMin}
              />
            </div>
            <div className="col-md-6">
              <TextField
                name="qteMinRelais"
                fullWidth
                floatingLabelText="quantité min. / relais"
                onChange={(event, value) => changeParam("qteMinRelai", value)}
                value={parametres.montantMinRelai}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
