import React, { PropTypes } from 'react';
import CommandePanel from './CommandePanel';
import uniq from 'lodash.uniq';
import Panel from 'components/Panel';

const Semainier = ({ commandesIds, commandes, relaiId, titreCol, getCommandeInfos, pushState }) =>
  <div className="col-xs">
    <Panel>{titreCol}</Panel>
    <div>
      {commandesIds.map((key, idx) => {
        const infos = getCommandeInfos(key);
        return (
          <CommandePanel
            nom={infos ? uniq(infos).join(', ') : null}
            dateCommande={commandes[key].dateCommande}
            prct={100}
            fav={false}
            key={idx}
            commandeId={`${key}`}
            clickHandler={() => pushState(`/relais/${relaiId}/commandes/${key}`)}
          />
        );
      }
        )}
    </div>
  </div>;

Semainier.propTypes = {
  getCommandeInfos: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  commandes: PropTypes.object.isRequired,
  commandesIds: PropTypes.array.isRequired,
  relaiId: PropTypes.string.isRequired,
  titreCol: PropTypes.string.isRequired,
};

export default Semainier;
