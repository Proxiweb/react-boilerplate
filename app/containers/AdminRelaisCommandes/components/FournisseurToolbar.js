import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import PersonIcon from 'material-ui/svg-icons/social/person';
import DoneIcon from 'material-ui/svg-icons/action/done';
import includes from 'lodash/includes';
import styles from './styles.css';

const FournisseurToolbar = ({ pushState, roles, relaiId, commandeId }) => (
  <div className={`col-md-12 ${styles.toolbar}`}>
    <FlatButton
      label="Passer une commande"
      icon={<PersonIcon />}
      onClick={() =>
        pushState(
          `/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs`,
        )}
    />
    {includes(roles, 'ADMIN') &&
      <FlatButton
        label="Finaliser la commande"
        icon={<DoneIcon />}
        onClick={() =>
          pushState(
            `/admin/relais/${relaiId}/commandes/${commandeId}/finalisation`,
          )}
      />}
  </div>
);

FournisseurToolbar.propTypes = {
  relaiId: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  pushState: PropTypes.func.isRequired,
};

export default FournisseurToolbar;
