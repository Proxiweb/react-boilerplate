import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';

export const buildHoursRanges = (start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  const datas = [];
  for (let cpt = 0; cpt < duration.asHours(); cpt++ ) { // eslint-disable-line
    const debut = moment(start).add(cpt, 'hours');
    const fin = moment(start).add(cpt + 1, 'hours');
    datas[cpt] = [debut.format('HH:mm'), fin.format('HH:mm')];
  }

  return datas;
};

export default class LivraisonSelector extends Component {
  static propTypes = {
    livraisons: PropTypes.array.isRequired,
    plageHoraire: PropTypes.number,
    livraisonId: PropTypes.string,
    selectionnePlageHoraire: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    moment.locale('fr');
  }

  render() {
    const { plageHoraire, livraisonId, selectionnePlageHoraire, livraisons } = this.props;
    return (<div className="row"><div className="col-md-8 col-md-offset-2">{livraisons.map((livr) => (
      <List>
        <Subheader>{moment(livr.debut).format('dddd Do MMMM')}</Subheader>
        {buildHoursRanges(livr.debut, livr.fin).map((data, idx) => (
          <ListItem onClick={() => selectionnePlageHoraire(idx, livr.id)} key={idx} >
            {idx === plageHoraire && livraisonId === livr.id && <span>X </span>}
            <span style={{ color: 'rgb(77, 71, 71)' }}>De </span>{ data[0] }
            <span style={{ color: 'rgb(77, 71, 71)' }}> à </span>{data[1]}
          </ListItem>))}
      </List>)
    )}</div></div>);
  }
}
