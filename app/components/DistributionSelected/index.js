import React, { Component, PropTypes } from 'react';
import { buildHoursRanges } from 'components/LivraisonSelector';
import moment from 'moment';

export default class DistributionSelected extends Component {  // eslint-disable-line
  static propTypes = {
    noPlageHoraire: PropTypes.number.isRequired,
    livraison: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    moment.locale('fr');
  }

  render() {
    const { livraison, noPlageHoraire, className } = this.props;
    const ranges = buildHoursRanges(livraison.debut, livraison.fin)[noPlageHoraire];
    return (<div className={className}>
      Le {moment(livraison.debut).format('dddd Do MMMM')} de {ranges.join(' à ')}
    </div>);
  }
}
