import React from 'react'; import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { List, ListItem, makeSelectable } from 'material-ui/List';
const SelectableList = makeSelectable(List);
import isDate from 'date-fns/is_date';
import compareDesc from 'date-fns/compare_desc';
import { distanceInWords } from 'utils/dates';
import Panel from './Panel';

const Utilisateurs = ({
  relais,
  utilisateurs,
  onClick,
  limit = 20,
  utilisateurId,
}) => (
  <Panel title={`Les ${limit} dernières connexions`}>
    <SelectableList value={utilisateurId} onChange={onClick}>
      {Object.keys(utilisateurs)
        .filter(
          id =>
            utilisateurs[id].nom &&
            utilisateurs[id].prenom &&
            isDate(utilisateurs[id].lastLogin)
        )
        .slice(0, limit - 1)
        .sort(compareDesc)
        .map(id => (
          <ListItem
            value={id}
            innerDivStyle={{ padding: '4px 0' }}
            nestedListStyle={{ padding: '5px' }}
          >
            <div className="row">
              <div className="col-md-2">
                {relais[utilisateurs[id].relaiId] &&
                  relais[utilisateurs[id].relaiId].nom}
              </div>
              <div className="col-md-10">
                {`${utilisateurs[id].nom.toUpperCase()} ${capitalize(utilisateurs[id].prenom)} (${distanceInWords(utilisateurs[id].lastLogin, new Date())})`}
              </div>
            </div>
          </ListItem>
        ))}
    </SelectableList>
  </Panel>
);

Utilisateurs.propTypes = {
  utilisateurs: PropTypes.object.isRequired,
  utilisateurId: PropTypes.string,
  limit: PropTypes.number.isRequired,
  relais: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Utilisateurs;
