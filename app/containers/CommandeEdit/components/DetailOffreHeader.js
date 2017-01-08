import React, { Component, PropTypes } from 'react';
import { CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import styles from './styles.css';

export default class DetailOffreHeader extends Component { // eslint-disable-line
  static propTypes = {
    paddingRight: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    title: PropTypes.node.isRequired,
    enStock: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
    showExp: PropTypes.bool.isRequired,
  }

  render() {
    const {
      paddingRight,
      width,
      label,
      title,
      enStock,
      handleClick,
      showExp,
    } = this.props;

    return (
      <CardHeader
        actAsExpander={false}
        showExpandableButton={showExp}
        style={{ padding: '5px' }}
        textStyle={{ textAlign: 'left', paddingRight, width }}
        title={title}
      >
        {
          enStock
          ? <RaisedButton
            onClick={handleClick}
            primary
            label={label}
            icon={<AddShoppingCart />}
          />
          : <span className={styles.nonDispo}>Non disponible</span>
        }
      </CardHeader>
    );
  }
}
