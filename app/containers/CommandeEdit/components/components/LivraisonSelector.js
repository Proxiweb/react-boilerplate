import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectRelaisSelected } from 'containers/Commande/selectors';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';
import shader from 'shader';
import styles from './LivraisonSelector.css';

const greyColor = { color: 'rgb(77, 71, 71)' };

export const buildHoursRanges = (start, end, range = 60) => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  const duree = duration.asMinutes();
  const datas = [];
  for (let cpt = 0; cpt < duree; cpt += range) { // eslint-disable-line
    const debut = moment(start).add(cpt, 'minutes');
    const fin = moment(start).add(cpt + range, 'minutes');
    datas[cpt] = [debut.format('HH:mm'), fin.format('HH:mm')];
  }
  return datas;
};

const getStyles = (props, context) => ({
  selected: {
    borderLeft: `solid 5px ${context.muiTheme.appBar.color}`,
    backgroundColor: shader(muiTheme.appBar.color, +0.6),
  }
});

class LivraisonSelector extends Component { // eslint-disable-line
  static propTypes = {
    livraisons: PropTypes.array.isRequired,
    relais: PropTypes.object.isRequired,
    plageHoraire: PropTypes.number,
    livraisonId: PropTypes.string,
    selectionnePlageHoraire: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { plageHoraire, livraisonId, selectionnePlageHoraire, livraisons, relais } = this.props;

    const muiTheme = this.context.muiTheme;
    const range = relais.rangeDistribMinutes;
    const comptutedStyles = getStyles(this.props, this.context);
    return (
      <div className="row">
        <div className={`col-md-8 col-md-offset-2 ${styles.livraisonSelector}`}>
          <div className={styles.lSTitre}>Sélectionnez un créneau horaire</div>
          {livraisons.map((livr, idx1) => (
            <List key={idx1}>
              <Subheader className={styles.subHeader}>{moment(livr.debut).format('dddd Do MMMM')}</Subheader>
              {buildHoursRanges(livr.debut, livr.fin, range).map((data, idx) => (
                <ListItem
                  onClick={() => selectionnePlageHoraire(idx, livr.id)}
                  key={idx}
                  style={
                    idx === plageHoraire &&
                    livraisonId === livr.id
                      ? comptutedStyles.selected
                      : {}
                  }
                >
                  <span style={greyColor}>De </span><strong>{data[0]}</strong>
                  <span style={greyColor}> à </span><strong>{data[1]}</strong>
                </ListItem>))}
            </List>)
          )}
        </div>
      </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelaisSelected(),
});

export default connect(mapStateToProps)(LivraisonSelector);
