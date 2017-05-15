import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { format } from 'utils/dates';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.css';

const commandePanel = ({ nom, dateCommande, clickHandler, label, url }) => (
  <Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={url ? <Link to={url} className={styles.link}>{nom}</Link> : nom}
      subtitle={format(dateCommande, '[Date limite ] DD/MM/YYYY HH:mm')}
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
  /* url si admin, pour consulter détail commande*/
  url: PropTypes.string,
};

export default commandePanel;
