/*
 *
 * CommandeEdit actions
 *
 */

import {
  AJOUTER,
  SUPPRIMER,
} from './constants';

export function ajouter(offre) {
  return {
    type: AJOUTER,
    payload: { offre },
  };
}

export function supprimer(offreId) {
  return {
    type: SUPPRIMER,
    payload: { offreId },
  };
}
