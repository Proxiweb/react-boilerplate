import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buildHoursRanges } from './DistributionSelector';

import {
  selectRelaisSelected,
  selectCommande,
} from 'containers/Commande/selectors';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

class DistributionSelected extends Component {
  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraisonId: PropTypes.string.isRequired,
    relais: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
  };

  render() {
    const { commande, noPlageHoraire, relais, livraisonId } = this.props;
    const distribution = commande.distributions.find(d => d.id === livraisonId);

    if (!distribution) return <p>Livraison manquante</p>;

    const { debut, fin } = distribution;
    const ranges = buildHoursRanges(debut, fin, relais.rangeDistribMinutes)[
      noPlageHoraire
    ];
    return (
      <div>
        {moment(debut).format('[ Distribution le ] dddd Do MMMM [de] ')}
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
