import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import { addDestinataire } from 'containers/AdminCommunication/actions';
import styles from './styles.css';

class EnvoiMessage extends Component {
  // eslint-disable-line
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    addDest: PropTypes.func.isRequired,
  };

  handleAddDestinataires = type => {
    const { utilisateurs, relaiId } = this.props;
    Object.keys(utilisateurs)
      .filter(id => utilisateurs[id].relaiId === relaiId && utilisateurs[id].notifications[type])
      .forEach(id => {
        const { telPortable, email, nom, prenom } = utilisateurs[id];
        const identite = `${capitalize(prenom)} ${nom.toUpperCase()}`;
        if (type === 'email') {
          this.props.addDest({ email, id, identite });
        } else {
          this.props.addDest({ telPortable, id, identite });
        }
      });
  };

  render() {
    const { utilisateurs, addDest } = this.props;

    return (
      <div className="row center-md">
        <div className="col-md-12">
          <h1>Préparer une communication</h1>
        </div>
        <div className={`col-md-4 ${styles.btn}`}>
          <RaisedButton
            primary
            fullWidth
            label="Ajouter tous les SMS"
            onClick={() => this.handleAddDestinataires('sms')}
          />
        </div>
        <div className={`col-md-4 ${styles.btn}`}>
          <RaisedButton
            primary
            fullWidth
            label="Ajouter tous les email"
            onClick={() => this.handleAddDestinataires('email')}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addDest: addDestinataire,
  },
  dispatch
);

export default connect(null, mapDispatchToProps)(EnvoiMessage);
