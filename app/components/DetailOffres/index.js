import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import styles from './styles.css';

export default class DetailOffres extends Component {
  static propTypes = {
    offres: PropTypes.array.isRequired,
    produits: PropTypes.array.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    fournisseur: PropTypes.object.isRequired,
    commandeId: PropTypes.string.isRequired,
    ajouter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      viewOffre: true,
    };
  }

  render() {
    const { viewOffre } = this.state;
    const { offres, ajouter, fournisseur, utilisateurId, commandeId, produits } = this.props;
    return (
      <div className={styles.offres}>
        <div style={{ textAlign: 'right' }}>
          <FlatButton
            onClick={() => this.setState((oldState) => ({ viewOffre: !oldState.viewOffre }))}
            primary
            label={viewOffre ? fournisseur.nom : 'Afficher les offres'}
          />
        </div>
        { !viewOffre && <p>Vue fournisseur</p>}
        { viewOffre &&
          <ul>
            {offres.map((offre, idx) => {
              const produit = produits.find((pdt) => pdt.id === offre.produitId);
              const etatStock = offre.stock !== null && offre.stock === 0 ? 'horsStock' : 'enStock';
              return (
                <li key={idx}>
                  <span className={styles[etatStock]}>
                    {produit.nom}{offre.stock !== null ? `(${offre.stock})` : ''} {offre.description} ({parseInt(offre.poids / 1000, 10)}g) : {offre.quantiteTotal}
                    <RaisedButton
                      onClick={() => ajouter({ offreId: offre.id, quantite: 1, commandeId, utilisateurId })}
                      label="Ajouter"
                    />
                  </span>
                </li>);
            })}
          </ul>
          }
        </div>
    );
  }
}
