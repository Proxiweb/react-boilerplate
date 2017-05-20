import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';

import { livreCommandeUtilisateur } from 'containers/Commande/actions';
import styles from './styles.css';

class LivraisonCommande extends Component {
  static propTypes = {
    commandeUtilisateur: PropTypes.object.isRequired,
    livre: PropTypes.func.isRequired,
  };

  handleSave = event => {
    const { commandeUtilisateur, livre } = this.props;
    event.preventDefault();
    livre(commandeUtilisateur.id);
  };

  render() {
    return (
      <div className={`col-md-8 ${styles.livraison}`}>
        <RaisedButton fullWidth primary label="Livraison OK" onClick={this.handleSave} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    livre: livreCommandeUtilisateur,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(LivraisonCommande);
