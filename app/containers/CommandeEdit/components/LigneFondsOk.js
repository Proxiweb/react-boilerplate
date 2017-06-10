import React from 'react';
import shader from 'shader';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';

const LigneFondsOkIcon = ({ color }) => {
  const doneColor = shader(color, -0.4);
  const colorStyle = { color: doneColor };
  const iconStyle = {
    verticalAlign: 'middle',
    color: doneColor,
  };
  return (
    <small style={colorStyle}>
      {'\u00A0\u00A0\u00A0\u00A0\u00A0'}
      <ActionDoneIcon style={iconStyle} />
      {'\u00A0'}Fonds porte-monnaie suffisants
    </small>
  );
};

export default LigneFondsOkIcon;
