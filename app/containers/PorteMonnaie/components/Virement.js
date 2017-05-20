import React, { Component } from 'react'; import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import moment from 'moment';

export default class Virement extends Component { // eslint-disable-line
  static propTypes = {
    virement: PropTypes.object.isRequired,
    annulerVirement: PropTypes.func.isRequired,
  }
  render() {
    const { virement, annulerVirement } = this.props;
    return (
      <Paper style={{ padding: '0.5em' }}>
        <div>
          Virement de <strong>{virement.montant} €</strong>, programmé {moment(virement.createdAt).fromNow()}<br /><br />
          Effectuez votre virement comme suit :<br />
          <ul style={{ listStyleType: 'none' }}>
            <li>{'L\'IBAN de notre compte : '}<br /><strong>{'FR76 3000 3008 7300 0372 6302 382'}</strong><br /><br /></li>
            <li>{'Comme motif du virement, indiquez '}<br /><strong>{virement.infosSupplement.ref}</strong></li>
          </ul>
        </div>
        <RaisedButton
          label="Annuler ce virement"
          secondary
          style={{ marginTop: 20 }}
          icon={<TrashIcon />}
          onClick={() => annulerVirement(virement.id)}
        />
      </Paper>
    );
  }
}
