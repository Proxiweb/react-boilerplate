import React, { Component, PropTypes } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import capitalize from 'lodash/capitalize';
import styles from './styles.css';

const SelectableList = makeSelectable(List);

export default class ListeUtilisateurs extends Component {
  static propTypes = {
    utilisateurs: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
  }

  state = {
    value: null,
  }

  handleChangeList = (event, value) => {
    this.setState({ value });
    this.props.onChangeList(event, value);
  }

  render() {
    const { utilisateurs } = this.props;
    const utilisateursArray = Object.keys(utilisateurs)
      .map((id) => utilisateurs[id])
      .filter((u) => u.nom)
      .sort((a, b) => a.nom > b.nom);

    return (
      <SelectableList value={this.state.value} onChange={this.handleChangeList} className={styles.list}>
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
    );
  }
}
