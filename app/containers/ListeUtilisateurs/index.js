import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import { createStructuredSelector } from 'reselect';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import capitalize from 'lodash/capitalize';
import styles from './styles.css';

import { loadUtilisateurs } from 'containers/Commande/actions';
import { selectUtilisateurs } from 'containers/Commande/selectors';

const SelectableList = makeSelectable(List);

class ListeUtilisateursRelais extends Component {
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
    utilisateurs: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    customFilter: PropTypes.func,
  }

  static defaultProps = {
    customFilter: () => true,
  }

  state = {
    value: null,
    searchItem: null,
  }

  componentDidMount() {
    const { relaiId, utilisateurs } = this.props;

    const utilisateursRelais =
      utilisateurs
        ? Object.keys(utilisateurs)
                .filter((key) => utilisateurs[key].relaiId === relaiId)
        : null;

    if (!utilisateursRelais || !utilisateursRelais.length) {
      this.loadUtilisateursRelais(relaiId);
    }
  }

  loadUtilisateursRelais = (relaiId) =>
    this.props.load({ relaiId });

  handleChangeList = (event, value) => {
    this.setState({ value });
    this.props.onChangeList(event, value);
  }

  render() {
    const { utilisateurs, relaiId, customFilter } = this.props;
    const { value, searchItem } = this.state;
    if (!utilisateurs) {
      return (
        <RefreshIndicator
          size={70}
          left={0}
          top={20}
          status="loading"
          style={{ display: 'inline-block', position: 'relative' }}
        />
      );
    }

    const utilisateursArray = Object.keys(utilisateurs)
      .filter((key) => {
        const util = utilisateurs[key];
        return util.relaiId === relaiId &&
               util.nom &&
               (
                 !searchItem ||
                 searchItem.length < 3 ||
                 util.nom.toUpperCase().search(searchItem.toUpperCase()) !== -1
               ) &&
               customFilter(util);
      })
      .map((id) => utilisateurs[id])
      .slice().sort((a, b) => a.nom > b.nom);

    return (
      <div>
        <TextField
          hintText="Nom à chercher"
          fullWidth
          onChange={(event) => this.setState({ ...this.state, searchItem: event.currentTarget.value })}
          value={this.state.searchItem}
        />
        <SelectableList value={value} onChange={this.handleChangeList} className={styles.list}>
          { utilisateursArray.map((ut, idx) =>
            <ListItem
              key={idx}
              primaryText={
                `${ut.nom.toUpperCase()} ${capitalize(ut.prenom)}`
              }
              value={ut.id}
            />)
          }
        </SelectableList>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  utilisateurs: selectUtilisateurs(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  load: loadUtilisateurs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ListeUtilisateursRelais);
