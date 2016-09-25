import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import Offre from 'components/Offre';
import { selectAsyncState, selectCommandes } from './selectors'; // selectCommandesUtilisateur
import styles from './styles.css';
import choux from './choux.jpg';

import { loadCommandes, loadCommande as loadCommandeAction, ajouter } from './actions';

export class Commande extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    commandes: PropTypes.object.isRequired,
    quantiteAchetee: PropTypes.number.isRequired,
    asyncState: PropTypes.object.isRequired,
    loadCommandes: PropTypes.func.isRequired,
    loadCommande: PropTypes.func.isRequired,
    ajouter: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.selectCommande = this.selectCommande.bind(this);
    this.state = {
      commandeSelected: null,
    };
  }

  selectCommande(id) {
    this.setState({ commandeSelected: id });
  }

  render() {
    const { asyncState, commandes, loadCommande } = this.props;
    if (commandes && Object.keys(commandes).length > 0) {
      return (
        <div className="row">
          <div className="col-md-3">
            <ul>
              {Object.keys(commandes).filter((key) => !commandes[key].terminee).sort((key) => !commandes[key].noCommande).map(
                (key, idx) =>
                  <li key={idx} styles={styles.commande}>
                    <Link to={`/commandes/${key}`}>{commandes[key].noCommande}</Link>
                  {' '}<RaisedButton label="Charger..." onClick={() => loadCommande(commandes[key].id)}></RaisedButton>
                  </li>
                )}
            </ul>
          </div>
          <div className="col-md-9">
            {this.state.commandeSelected && <h1>{commandes[this.state.commandeSelected].noCommande}</h1>}
            {this.props.children}
          </div>
        </div>
      );
    }

    return (selectOffresByProduit
      <div>
        <div className={`${styles.commande} row`}>
          {false && <div className="col-md-4 with-margin-bottom">
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={100}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
          </div>}
          {false && <div className="col-md-4 with-margin-bottom">
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
          </div>}
          {false && <div className="col-md-4 with-margin-bottom">
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
            <Offre
              nom="Choux à la crème 3/12"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav={false}
            />
          </div>}
          <Helmet
            title="Commande"
            meta={[
              { name: 'description', content: 'Description of Commande' },
            ]}
          />
        { true && (
          <div>
            <h1>Commandes</h1>
            <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
              <button
                onClick={() => this.props.loadCommandes(0)}
                className="btn btn-primary"
              >
                <span>{ !asyncState.pending && 'Charger les commandes, page 0'} { asyncState.pending && 'loading...' }</span>
              </button>
            </div>
            <div className={`col-md-8 col-md-offset-2 ${styles.testNotificationZone}`}>
              <button
                onClick={() => this.props.loadCommandes(1)}
                className="btn btn-primary"
              >
                <span>{ !asyncState.pending && 'Charger les commandes, page 1'} { asyncState.pending && 'loading...' }</span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  commandes: selectCommandes(),
  asyncState: selectAsyncState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadCommandes: (page) => dispatch(loadCommandes(page)),
    loadCommande: (id) => dispatch(loadCommandeAction(id)),
    ajouter: (contenuId, qte) => dispatch(ajouter(contenuId, qte)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commande);
