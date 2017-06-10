import React from 'react';
import PropTypes from 'prop-types';
import CommandePanel from './CommandePanel';
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
  buttonClicked,
  withLink,
}) =>
  <div className="col-xs">
    <Panel>{titreCol}</Panel>
    <div>
      {commandesIds &&
        commandesIds.map((key, idx) => {
          const infos = getCommandeInfos(key);

          // si aucun typeProduit ( datesLimites passées )
          // ne rien afficher
          if (infos && !infos.length) return null;

          return (
            <CommandePanel
              nom={infos ? infos.join(', ') : null}
              dateCommande={commandes[key].dateCommande}
              label={commandeUtilisateurExiste(key) ? 'Modifier ma commande' : 'Commander'}
              prct={100}
              fav={false}
              key={idx}
              commandeId={`${key}`}
              disabled={pending}
              clickHandler={() => {
                buttonClicked();
                pushState(`/relais/${relaiId}/commandes/${key}?utilisateurId=${utilisateurId}`);
              }}
              url={withLink ? `/admin/relais/${relaiId}/commandes/${key}` : null}
            />
          );
        })}
    </div>
  </div>;

Semainier.propTypes = {
  getCommandeInfos: PropTypes.func.isRequired,
  commandeUtilisateurExiste: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  buttonClicked: PropTypes.func.isRequired,
  commandes: PropTypes.object.isRequired,
  commandesIds: PropTypes.array.isRequired,
  relaiId: PropTypes.string.isRequired,
  utilisateurId: PropTypes.string.isRequired,
  titreCol: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,
  withLink: PropTypes.bool.isRequired,
};

export default Semainier;
