import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buildHoursRanges } from './DistributionSelector';

import {
  selectRelaisSelected,
  selectCommande,
} from 'containers/Commande/selectors';
import { createStructuredSelector } from 'reselect';
import { format } from 'utils/dates';

class DistributionSelected extends Component {
  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraisonId: PropTypes.string.isRequired,
    relais: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
  };

  render() {
    const { livraison, noPlageHoraire, relais } = this.props;
    const ranges = buildHoursRanges(
      livraison.debut,
      livraison.fin,
      relais.rangeDistribMinutes
    )[noPlageHoraire];
    return (
      <div>
        {format(livraison.debut, '[ Distribution le ] dddd Do MMMM [de] ')}
        {ranges.join(' à ')}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
  commande: selectCommande(),
});

export default connect(mapStateToProps)(DistributionSelected);
