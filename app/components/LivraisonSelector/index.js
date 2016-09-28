import React, { Component, PropTypes } from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';

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
    return (<div className="row"><div className="col-md-8 col-md-offset-2">{livraisons.map((livr) => {
      const duration = moment.duration(moment(livr.fin).diff(moment(livr.debut)));
      const datas = [];
      for (let cpt = 0; cpt < duration.asHours(); cpt++ ) { // eslint-disable-line
        const debut = moment(livr.debut).add(cpt, 'hours');
        const fin = moment(livr.debut).add(cpt + 1, 'hours');
        datas[cpt] = [debut.format('HH:mm'), fin.format('HH:mm')];
      }

      return (
        <List>
          <Subheader>{moment(livr.debut).format('dddd Do MMMM')}</Subheader>
          {datas.map((data, idx) => (
            <ListItem onClick={() => selectionnePlageHoraire(idx, livr.id)} key={idx} >
              {idx === plageHoraire && livraisonId === livr.id && <span>X </span>}
              <span style={{ color: 'rgb(77, 71, 71)' }}>De </span>{ data[0] }
              <span style={{ color: 'rgb(77, 71, 71)' }}> à </span>{data[1]}
            </ListItem>))}
        </List>);
    })}</div></div>);
  }
}
