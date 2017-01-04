import React, { PropTypes } from 'react';
import CommandePanel from './CommandePanel';
import uniq from 'lodash/uniq';
import Panel from 'components/Panel';

const Semainier = ({
  commandesIds,
  commandes,
  relaiId,
  titreCol,
  getCommandeInfos,
  pushState,
  commandeUtilisateurExiste,
  utilisateurId,
  pending,
}) =>
  <div className="col-xs">
    <Panel>{titreCol}</Panel>
    <div>
      {commandesIds.map((key, idx) => {
        const infos = getCommandeInfos(key);
        return (
          <CommandePanel
            nom={infos ? uniq(infos).join(', ') : null}
            dateCommande={commandes[key].dateCommande}
            label={commandeUtilisateurExiste(key) ? 'Modifier ma commande' : 'Commander'}
            prct={100}
            fav={false}
            key={idx}
            commandeId={`${key}`}
            disabled={pending}
            clickHandler={() => pushState(
              `/relais/${relaiId}/commandes/${key}?utilisateurId=${utilisateurId}`
            )}
          />
        );
      }
        )}
    </div>
  </div>;

Semainier.propTypes = {
  getCommandeInfos: PropTypes.func.isRequired,
  commandeUtilisateurExiste: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  commandes: PropTypes.object.isRequired,
  commandesIds: PropTypes.array.isRequired,
  relaiId: PropTypes.string.isRequired,
  utilisateurId: PropTypes.string.isRequired,
  titreCol: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
};

export default Semainier;
