import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { List, ListItem } from 'material-ui/List';
import CheckIcon from 'material-ui/svg-icons/action/done';
import RaisedButton from 'material-ui/RaisedButton';

import { selectRelais } from 'containers/Commande/selectors';
import { selectCompteUtilisateur } from 'containers/CompteUtilisateur/selectors';
import { saveAccount } from 'containers/CompteUtilisateur/actions';
import { loadRelais } from 'containers/Commande/actions';
import Panel from 'components/Panel';
const styles = require('./styles.css');


class ChoixRelais extends Component { // eslint-disable-line
  static propTypes = {
    relais: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    utilisateur: PropTypes.object.isRequired,
  }

  state = {
    relaiId: null,
  }

  componentDidMount = () => {
    const { relais, load } = this.props;
    if (!relais || relais.length === 1) {
      load();
    }
  }

  sauvegarder = () => {
    const { utilisateur, save, relais } = this.props;
    const { relaiId } = this.state;
    save(
      utilisateur.id,
      { ...utilisateur, relaiId },
      `Bienvenu sur le relais ${relais[relaiId].nom} !`,
      `users/${utilisateur.id}/profile?tab=profil`
    );
  }

  render() {
    const { relais, utilisateur } = this.props;
    const { relaiId } = this.state;

    if (!relais) return null;
    return (
      <div className="row center-md">
        <div className={`col-md-4 ${styles.panel}`}>
          <Panel>Choississez un relais</Panel>
          <List>
            {Object.keys(relais).map((key, idx) =>
              <ListItem
                key={idx}
                leftIcon={key === relaiId ? <CheckIcon /> : null}
                primaryText={relais[key].nom.toUpperCase()}
                onClick={() => this.setState({ relaiId: relais[key].id })}
              />
            )}
          </List>
          {relaiId && relaiId !== utilisateur.relaiId && (
            <div className="with-margin-top" style={{ textAlign: 'center' }}>
              <RaisedButton
                primary
                label="Sélectionner ce relais"
                onClick={this.sauvegarder}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
  utilisateur: selectCompteUtilisateur(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  save: saveAccount,
  load: loadRelais,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChoixRelais);
