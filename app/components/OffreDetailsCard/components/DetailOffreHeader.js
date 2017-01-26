import React, { Component, PropTypes } from 'react';
import { CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
// import styles from './styles.css';

export default class DetailOffreHeader extends Component { // eslint-disable-line
  static propTypes = {
    paddingRight: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    fontSize: PropTypes.string.isRequired,
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

    // return (
    //   <CardHeader
    //     actAsExpander
    //     showExpandableButton
    //     title="test"
    //   />
    // );

        // textStyle={{
        //   textAlign: 'left',
        //   fontSize: this.props.fontSize || '1.2em',
        //   color: '#1565c0',
        //   paddingRight,
        //   width,
        // }}
        // style={{ padding: '1px' }}
        // titleStyle={{ color: '#1565c0', fontSize: '1.2em' }}
    return (
      <CardHeader
        actAsExpander
        showExpandableButton
        textStyle={{ textAlign: 'left', paddingRight: 215 }}
        title={<span>Test</span>}
        subtitle={'Tarif dégressif (En savoir plus...)'}
      />

    );
  }
}
