import { findActionType } from "utils/asyncSagaConstants";
import c from "./constants";

export const loadFournisseur = id => ({
  type: findActionType("load_fournisseur", c, "START"),
  url: `fournisseurs/${id}`,
  msgPending: "Chargement fournisseur"
});
