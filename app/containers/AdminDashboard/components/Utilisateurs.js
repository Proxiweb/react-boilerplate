import React, { PropTypes } from 'react';
import capitalize from 'lodash/capitalize';
import moment from 'moment';
import Panel from './Panel';
import styles from './styles.css';

const Utilisateurs = ({ relais, utilisateurs, limit = 20 }) =>
  <Panel title={`Les ${limit} dernières connexions`}>
    <table>
      {Object.keys(utilisateurs)
        .filter((id) =>
          utilisateurs[id].nom &&
          utilisateurs[id].prenom &&
          moment(utilisateurs[id].lastLogin).isValid()
        )
        .slice(0, limit - 1)
        .sort((u1, u2) =>
          moment(utilisateurs[u1].lastLogin).unix() < moment(utilisateurs[u2].lastLogin).unix()
        )
        .map((id) =>
          <tr>
            <td className={styles.row}>{relais[utilisateurs[id].relaiId] && relais[utilisateurs[id].relaiId].nom}</td>
            <td className={styles.row}>{utilisateurs[id].nom.toUpperCase()} {capitalize(utilisateurs[id].prenom)}</td>
            <td className={styles.row}>{moment(utilisateurs[id].lastLogin).fromNow()}</td>
          </tr>)
      }
    </table>
  </Panel>;

Utilisateurs.propTypes = {
  utilisateurs: PropTypes.object.isRequired,
  relais: PropTypes.object.isRequired,
};

export default Utilisateurs;
