import { createSelector } from "reselect";

/**
 * Direct selector to the compteUtilisateur state domain
 */
export const selectCommunicationDomain = () => state => state.admin.communication;

export const selectCommunications = () => createSelector(selectCommunicationDomain(), domain => domain.datas);
