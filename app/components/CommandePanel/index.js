import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const commandePanel = ({ nom, clickHandler }) => (
  <Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={nom}
      subtitle="Date limite 12/12/2016 12:00"
      textStyle={{ paddingRight: '15px' }}
    />
    <CardActions>
      <RaisedButton
        label="Commander"
        icon={<i className="material-icons" style={{ color: 'white' }}>shopping_cart</i>}
        fullWidth
        primary
        onClick={clickHandler}
      />
    </CardActions>
  </Card>
);

commandePanel.propTypes = {
  nom: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

export default commandePanel;
