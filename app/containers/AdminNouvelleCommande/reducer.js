
const commandeVide = {
  dateCommande: null,
  montantMinRelai: null,
  resume: null,
  note: null,
  illustration: null,
  publiee: null,
  diffusee: null,
};

export const nouvelleCommandeReducer = (state = commandeVide, action) => {
  switch (action.type) {
    case 'TEST':
      return state;
    default:
      return state;
  }
};
