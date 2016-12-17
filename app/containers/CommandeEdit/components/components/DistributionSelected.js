import React, { Component, PropTypes } from 'react';
import { buildHoursRanges } from './LivraisonSelector';
import moment from 'moment';

export default class DistributionSelected extends Component {  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraison: PropTypes.object.isRequired,
  }

  render() {
    const { livraison, noPlageHoraire } = this.props;
    const ranges = buildHoursRanges(livraison.debut, livraison.fin)[noPlageHoraire];
    return <div>{moment(livraison.debut).format('[ RDV le ] dddd Do MMMM [de] ')}{ranges.join(' à ')}</div>;
  }
}
