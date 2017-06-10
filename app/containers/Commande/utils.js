import { trouveTarification } from "containers/CommandeEdit/components/components/AffichePrix";
import round from "lodash/round";
import memoize from "lodash/memoize";
import groupBy from "lodash/groupBy";

/* calcule les totaux de la commande
* @utilisateurId commande contenus de(s) l'utilisateur(s)
* @commandeContenus tous les commandeContenus de la commande
* @offres offres de la commande
* @commandeId No commande
*/
const calculeTotauxCommandeFn = ({ utilisateurId, commandeContenus, offres, commandeId, filter }) => {
  // le filtre par commandeId est toujours appliqué
  const allCommandeContenus = Object.keys(commandeContenus)
    .filter(id => commandeContenus[id].commandeId === commandeId)
    .map(id => commandeContenus[id]);

  // si filter est fournit l'appliquer
  const filteredCommandeContenus = allCommandeContenus.filter(
    commandeContenu => !filter || filter(commandeContenu)
  );

  const grouped = groupBy(filteredCommandeContenus, "offreId");

  // Pourquoi ??? normalement il ne peut y avoir qu'un offreId utilisateur par commande ...
  // un map devrait suffir
  const contenusAgg = Object.keys(grouped).map(offreId =>
    grouped[offreId].reduce(
      (m, c) => ({
        offreId,
        quantite: m.quantite + c.quantite,
        qteRegul: m.qteRegul + c.qteRegul
      }),
      { offreId, quantite: 0, qteRegul: 0 }
    )
  );

  const totaux = contenusAgg.reduce(
    (memo, contenu) => {
      const offre = offres[contenu.offreId];

      const qteTotalOffre = allCommandeContenus
        .filter(cc => cc.offreId === offre.id)
        .reduce((mem, item) => mem + item.quantite, 0);

      const tarif = trouveTarification(offre.tarifications, qteTotalOffre);
      const qte = contenu.quantite + (contenu.qteRegul || 0);
      return {
        prixBase: memo.prixBase + round(offre.tarifications[0].prix * qte / 100, 2),
        recolteFondBase: memo.recolteFondBase + round(offre.tarifications[0].recolteFond * qte / 100, 2),
        prix: memo.prix + round(tarif.prix * qte / 100, 2),
        recolteFond: memo.recolteFond + round(tarif.recolteFond * qte / 100, 2)
      };
    },
    { prix: 0, recolteFond: 0, prixBase: 0, recolteFondBase: 0 }
  );

  totaux.recolteFond = round(totaux.recolteFond, 2);
  totaux.recolteFondBase = round(totaux.recolteFondBase, 2);

  return totaux;
};

export const calculeTotauxCommande = memoize(calculeTotauxCommandeFn);
