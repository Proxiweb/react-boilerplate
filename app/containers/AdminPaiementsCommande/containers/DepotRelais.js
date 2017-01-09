import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import { connect } from 'react-redux';
import { ajouterDepot } from 'containers/AdminDepot/actions';
import shader from 'shader';
import styles from './styles.css';

class DepotRelais extends Component { // eslint-disable-line
  static propTypes = {
    utilisateurId: PropTypes.string.isRequired,
    balance: PropTypes.object.isRequired,
    deposer: PropTypes.func.isRequired,
    totalCommande: PropTypes.number.isRequired,
    relaiId: PropTypes.string.isRequired,
    depot: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    montant: null,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.utilisateurId !== nextProps.utilisateurId) {
      this.setState({
        montant: null,
      });
    }
  }

  handleDeposer = () => {
    const { deposer, utilisateurId, relaiId } = this.props;
    const { montant } = this.state;
    const type = 'depot_relais';

    const depot = {
      utilisateurId,
      infosSupplement: { relaiId },
      montant,
      type,
    };

    deposer(depot);
  }

  render() {
    const { depot } = this.props;
    const { muiTheme } = this.context;
    if (depot) {
      return (
        <div
          className={`row ${styles.depot}`}
          style={{ border: `solid 5px ${shader(muiTheme.appBar.color, -0.4)}` }}
        >
          <div className="col-md-4">
            <ActionDoneIcon
              style={{
                height: 40,
                width: 40,
                color: shader(muiTheme.appBar.color, -0.4),
                paddingLeft: '1em',
              }}
            />
          </div>
          <div className="col-md-8">
            {`Dépot de ${parseFloat(depot.montant).toFixed(2)} € en cours...`}
          </div>
        </div>);
    }
    return (
      <div className={`row center-md ${styles.form}`}>
        <div className="col-md-12">
          <TextField
            type="number"
            floatingLabelText="Montant reçu"
            onChange={(event, montant) => this.setState({ montant })}
          />
        </div>
        <div className={`col-md-12 ${styles.submit}`}>
          <RaisedButton
            label="Ajouter au bordereau"
            onClick={this.handleDeposer}
            primary
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  deposer: (montant) => dispatch(ajouterDepot(montant)),
});

export default connect(null, mapDispatchToProps)(DepotRelais);
