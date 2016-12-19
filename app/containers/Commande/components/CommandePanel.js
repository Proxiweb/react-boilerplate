import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

const commandePanel = ({ nom, dateCommande, clickHandler, label }) => (
  <Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={nom}
      subtitle={moment(dateCommande).format('[Date limite ] DD/MM/YYYY HH:mm')}
      textStyle={{ paddingRight: '15px' }}
    />
    <CardActions>
      <RaisedButton
        label={label}
        icon={<ShoppingCartIcon />}
        fullWidth
        primary
        onClick={clickHandler}
      />
    </CardActions>
  </Card>
);

commandePanel.propTypes = {
  nom: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  dateCommande: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

export default commandePanel;
