import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import groupBy from 'lodash/groupBy';
import { createStructuredSelector } from 'reselect';
import { selectDepots } from 'containers/AdminDepot/selectors';
import { loadDepotsRelais } from 'containers/AdminDepot/actions';

import Borderau from './Bordereau';

const SelectableList = makeSelectable(List);

class DepotsRelais extends Component {
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
    loadDepots: PropTypes.func.isRequired,
    depots: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
  }

  state = {
    bordereauSelected: null,
  }

  componentDidMount = () => {
    const { relaiId } = this.props;
    this.props.loadDepots(relaiId);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.relaiId !== this.props.relaiId) {
      this.setState({ bordereauSelected: null });
      this.props.loadDepots(nextProps.relaiId);
    }
  }

  handleChangeList = (event, value) =>
    this.setState({ bordereauSelected: value });

  render() {
    const { depots, utilisateurs } = this.props;
    const { bordereauSelected } = this.state;
    const depotsAvecInfos = depots.filter((d) => d.type === 'depot_relais' && d.infosSupplement && d.infosSupplement.ref);
    const actuels = depots.filter((d) => d.type === 'depot_relais' && d.infosSupplement && !d.infosSupplement.ref);
    const borderauxG = groupBy(depotsAvecInfos, (d) => d.infosSupplement.ref);

    if (actuels.length > 0) borderauxG.actuel = actuels;

    const bordereaux = bordereauSelected
                        ? borderauxG[bordereauSelected]
                            .map((b) => ({
                              utilisateur: utilisateurs.find((u) => u.id === b.utilisateurId),
                              montant: b.montant,
                              fait: b.transfertEffectue,
                            }))
                        : null;
    return (
      <div className="row">
        <div className="col-md-2">
          {depots && utilisateurs.length > 0 &&
            <SelectableList value={bordereauSelected} onChange={this.handleChangeList}>
              {Object.keys(borderauxG)
                .sort((a, b) => a < b || a === 'actuel')
                .map((key, idx) =>
                  <ListItem
                    key={idx}
                    primaryText={key}
                    value={key}
                  />
              )}
            </SelectableList>}
        </div>
        <div className="col-md-10">
          { bordereauSelected && <Borderau depots={bordereaux} />}
        </div>
        { bordereauSelected === 'actuel' &&
          <div className="col-md-4 col-md-offset-4">
            <RaisedButton
              primary
              label="Valider le bordereau"
              fullWidth
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  depots: selectDepots(),
});

const mapDispatchToProps = (dispatch) => ({
  loadDepots: (relaisId) => dispatch(loadDepotsRelais(relaisId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepotsRelais);
