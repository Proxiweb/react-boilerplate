import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectRelaisSelected,
  makeSelectCommande,
} from 'containers/Commande/selectors';
import Subheader from 'material-ui/Subheader';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import addMinutes from 'date-fns/add_minutes';
import { format } from 'utils/dates';
import shader from 'shader';
import styles from './DistributionSelector.css';

const greyColor = { color: 'rgb(77, 71, 71)' };

export const buildHoursRanges = (start, end, range) => {
  if (range === null) {
    return [[format(start, 'HH:mm'), format(end, 'HH:mm')]];
  }
  const datas = [];
  for (let cpt = 0; cpt < differenceInMinutes(end, start); cpt += range) {
    // eslint-disable-line
    const debut = addMinutes(start, cpt);
    const fin = addMinutes(start, cpt + range);
    datas[cpt] = [format(debut, 'HH:mm'), format(fin, 'HH:mm')];
  }
  return datas;
};

const getStyles = (props, context) => ({
  selected: {
    borderLeft: `solid 5px ${context.muiTheme.appBar.color}`,
    backgroundColor: shader(context.muiTheme.appBar.color, +0.6),
  },
});

class DistributionSelector extends Component {
  // eslint-disable-line
  static propTypes = {
    distributions: PropTypes.array.isRequired,
    relais: PropTypes.object.isRequired,
    commande: PropTypes.object.isRequired,
    plageHoraire: PropTypes.number,
    livraisonId: PropTypes.string,
    selectionnePlageHoraire: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {
      plageHoraire,
      livraisonId,
      selectionnePlageHoraire,
      commande,
      relais,
    } = this.props;

    const range = relais.rangeDistribMinutes;
    const comptutedStyles = getStyles(this.props, this.context);
    return (
      <div className="row">
        <div
          className={`col-md-8 col-md-offset-2 ${styles.distributionSelector}`}
        >
          <div className={styles.lSTitre}>Sélectionnez un créneau horaire</div>
          {commande.distributions.map((dist, idx1) =>
            (<List key={idx1}>
              <Subheader className={styles.subHeader}>
                {format(dist.debut, 'dddd Do MMMM')}
              </Subheader>
              {buildHoursRanges(dist.debut, dist.fin, range).map((data, idx) =>
                (<ListItem
                  onClick={() => selectionnePlageHoraire(idx, dist.id)}
                  key={idx}
                  style={
                    idx === plageHoraire && livraisonId === dist.id
                      ? comptutedStyles.selected
                      : {}
                  }
                >
                  <span style={greyColor}>De </span><strong>{data[0]}</strong>
                  <span style={greyColor}> à </span><strong>{data[1]}</strong>
                </ListItem>)
              )}
            </List>)
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: makeSelectRelaisSelected(),
  commande: makeSelectCommande(),
});

export default connect(mapStateToProps)(DistributionSelector);
