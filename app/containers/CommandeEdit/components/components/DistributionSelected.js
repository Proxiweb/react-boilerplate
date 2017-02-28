import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { buildHoursRanges } from './LivraisonSelector';

import { selectRelaisSelected } from 'containers/Commande/selectors';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

class DistributionSelected extends Component {
  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraison: PropTypes.object.isRequired,
    relais: PropTypes.object.isRequired,
  };

  render() {
    const { livraison, noPlageHoraire, relais } = this.props;
    const ranges = buildHoursRanges(livraison.debut, livraison.fin, relais.rangeDistribMinutes)[
      noPlageHoraire
    ];
    return (
      <div>
        {moment(livraison.debut).format('[ Distribution le ] dddd Do MMMM [de] ')}{ranges.join(' à ')}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
});

export default connect(mapStateToProps)(DistributionSelected);
