import React, { Component, PropTypes } from 'react';
import { buildHoursRanges } from 'components/LivraisonSelector';
import moment from 'moment';

export default class DistributionSelected extends Component {  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraison: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    moment.locale('fr');
  }

  render() {
    const { livraison, noPlageHoraire } = this.props;
    const ranges = buildHoursRanges(livraison.debut, livraison.fin)[noPlageHoraire];
    return (<div>RDV le {moment(livraison.debut).format('dddd Do MMMM')} de {ranges.join(' à ')}</div>);
  }
}
