import React, { Component } from 'react'; import PropTypes from 'prop-types';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';

import Virement from './Virement';

import styles from './styles.css';

export default class Virements extends Component {
  static propTypes = {
    max: PropTypes.number.isRequired,
    programmerVirement: PropTypes.func.isRequired,
    annulerVirement: PropTypes.func.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    virements: PropTypes.array.isRequired,
  }

  state = {
    montant: 10,
  }

  render() {
    const { max, programmerVirement, utilisateurId, virements, annulerVirement } = this.props;
    const { montant } = this.state;

    if (virements.length > 0) {
      return (
        <div className="col-md-12">
          {virements.map((vir, idx) => <Virement key={idx} virement={vir} annulerVirement={annulerVirement} />)}
        </div>
      );
    }

    return (
      <div className="col-md-8">
        <p style={{ minHeight: '18px' }}>{montant !== null && montant > 0 && `Montant du virement : ${montant} €`}</p>
        <Slider
          min={0}
          max={max}
          step={1}
          value={this.state.montant}
          onChange={(event, val) => this.setState({ montant: val })}
        />
        <div className={styles.virButton}>
          <RaisedButton
            primary
            label="Programmer ce virement"
            type="number"
            disabled={!this.state.montant}
            onClick={() => programmerVirement({ utilisateurId, montant })}
          />
        </div>
      </div>
    );
  }
}
