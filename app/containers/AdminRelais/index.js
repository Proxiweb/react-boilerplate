import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import EuroIcon from 'material-ui/svg-icons/action/euro-symbol';

import styles from './styles.css';
import classnames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { selectRelais } from 'containers/AdminDepot/selectors';

import DepotsRelais from './containers/DepotsRelais';
// import { loadDepotsRelais } from 'containers/AdminDepot/actions';
import { push } from 'react-router-redux';
import { loadRelais } from './actions';
import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';

const SelectableList = makeSelectable(List);

class AdminRelais extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    relais: PropTypes.array.isRequired,
    load: PropTypes.func.isRequired,
    loadUtil: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  state = {
    viewSelected: null,
  }

  componentDidMount() {
    const { relais, load } = this.props;
    if (relais && relais.length === 0) {
      load();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.relaiId !== nextProps.params.relaiId) {
      this.setState({ viewSelected: null });
      this.props.loadUtil({ relaiId: nextProps.params.relaiId });
    }
  }

  handleChangeList = (event, value) =>
    this.props.pushState(`/relais/${value}`)

  render() {
    const { relais, params, pushState } = this.props;
    const { relaiId } = params;
    const { viewSelected } = this.state;
    const relaisSelected = relais.find((r) => r.id === relaiId);
    return (<div className="row">
      <div className={classnames('col-md-3', styles.panel)}>
        <SelectableList value={relaiId} onChange={this.handleChangeList}>
          {Object.keys(relais)
            .map((key, idx) =>
              <ListItem
                key={idx}
                primaryText={relais[key].nom.toUpperCase()}
                value={relais[key].id}
              />
          )}
        </SelectableList>
      </div>
      <div className={classnames('col-md-9', styles.panel)}>
        <div className="row end-md">
          <div classnames="col-md-2">
            {relaisSelected &&
              <FlatButton
                label="Commandes"
                icon={<ShoppingCartIcon />}
                onClick={() => pushState(`/relais/${relaiId}/commandes`)}
              />
            }
            {relaisSelected &&
              <FlatButton
                label="Depots"
                icon={<EuroIcon />}
                onClick={() => this.setState({ viewSelected: 'depot' })}
              />
            }
          </div>
        </div>
        {viewSelected === 'depot' && <DepotsRelais relaiId={relaiId} />}
      </div>
    </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadRelais()),
  loadUtil: (relaiId) => dispatch(loadUtilisateurs(relaiId)),
  // loadDepots: (relaisId) => dispatch(loadDepotsRelais(relaisId)),
  pushState: (url) => dispatch(push(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRelais);
