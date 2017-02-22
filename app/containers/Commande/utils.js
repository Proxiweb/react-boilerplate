import { trouveTarification } from 'containers/CommandeEdit/components/components/AffichePrix';
import round from 'lodash/round';
import memoize from 'lodash/memoize';
import groupBy from 'lodash/groupBy';
/* calcule les totaux de la commande
* @contenus commande contenus de(s) l'utilisateur(s)
* @commandeContenus tous les commandeContenus de la commande
* @offres offres de la commande
* @commandeId No commande
*/
const calculeTotauxCommandeFn = (
  {
    contenus,
    commandeContenus,
    offres,
    commandeId,
  },
) => {
  const grouped = groupBy(contenus, 'offreId');
  const contenusAgg = Object.keys(grouped)
    .map(offreId =>
      grouped[offreId].reduce(
        (m, c) => ({ offreId, quantite: m.quantite + c.quantite, qteRegul: m.qteRegul + c.qteRegul }),
        { offreId, quantite: 0, qteRegul: 0 },
      ));

  const totaux = contenusAgg.reduce(
    (memo, contenu) => {
      const offre = offres[contenu.offreId];
      const commandeCommandeContenus = Object.keys(commandeContenus)
        .filter(
          key =>
            commandeContenus[key].commandeId === commandeId && commandeContenus[key].offreId === offre.id,
        )
        .map(key => commandeContenus[key]);

      const qteTotalOffre = commandeCommandeContenus
        .filter(cC => cC.utilisateurId !== commandeContenus[Object.keys(commandeContenus)[0]].utilisateurId)
        .reduce((mem, item) => mem + item.quantite, 0);

      const tarif = trouveTarification(offre.tarifications, qteTotalOffre, contenu.quantite);
      const qte = contenu.quantite + (contenu.qteRegul || 0);

      return {
        prixBase: memo.prixBase + round(offre.tarifications[0].prix * qte / 100, 2),
        recolteFondBase: memo.recolteFondBase + round(offre.tarifications[0].recolteFond * qte / 100, 2),
        totalBase: memo.totalBase +
          round((offre.tarifications[0].prix + offre.tarifications[0].recolteFond) * qte / 100, 2),
        prix: memo.prix + round(tarif.prix * qte / 100, 2),
        recolteFond: memo.recolteFond + round(tarif.recolteFond * qte / 100, 2),
        total: memo.total + round((tarif.prix + tarif.recolteFond) * qte / 100, 2),
      };
    },
    { prix: 0, recolteFond: 0, prixBase: 0, recolteFondBase: 0, totalBase: 0, total: 0 },
  );

  totaux.recolteFond = round(totaux.recolteFond, 2);
  totaux.recolteFondBase = round(totaux.recolteFondBase, 2);

  return totaux;
};

export const calculeTotauxCommande = memoize(calculeTotauxCommandeFn);
