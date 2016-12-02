import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import CommandePanel from 'components/CommandePanel';
import uniq from 'lodash.uniq';
import Offre from 'components/Offre';
import {
  selectAsyncState,
  selectRelaisId,
  selectCommandesRelais,
  selectTypesProduits,
  selectFournisseurs,
  selectProduits } from './selectors';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import styles from './styles.css';
import choux from './choux.jpg';

import { loadCommandes, loadCommande as loadCommandeAction, ajouter } from './actions';

export class Commande extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    commandes: PropTypes.object,
    relaiId: PropTypes.string,
    produits: PropTypes.object,
    fournisseurs: PropTypes.array,
    typesProduits: PropTypes.object,
    asyncState: PropTypes.object.isRequired,
    loadCommandes: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectCommande = this.selectCommande.bind(this);
    this.getCommandeInfos = this.getCommandeInfos.bind(this);
    this.state = {
      commandeSelected: null,
    };
  }

  componentDidMount() {
    const { commandes, loadCommandes } = this.props; // eslint-disable-line
    if (!commandes) {
      loadCommandes();
    }
  }

  getCommandeInfos(id) {
    const { produits, commandes, typesProduits, fournisseurs } = this.props;
    const commande = commandes[id];
    return commande.fournisseurs
      .filter((frnId) => fournisseurs.find((frn) => frn.id === frnId))
      .map((frnId) =>
          Object.keys(produits)
            .filter((pdtId) => produits[pdtId].visible)
            .find(
              (pdtId) => produits[pdtId].fournisseurId === frnId && produits[pdtId].visible
            ))
            .map((pdtId) => produits[pdtId].typeProduitId)
              .map((typePdtId) => typesProduits[typePdtId].nom);
  }

  selectCommande(id) {
    this.setState({ commandeSelected: id });
  }

  render() {
    const { asyncState, commandes, relaiId } = this.props;
    const self = this;
    const palette = this.context.muiTheme.palette;
    const styleTitle = {
      backgroundColor: palette.groupColor,
      border: `solid 1px ${palette.groupColorBorder}`,
      padding: 10,
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.2em',
    };
    console.log('cmde', commandes);
    if (commandes && Object.keys(commandes).length > 0) {
      return (
        <div className="row">
          <div className="col-xs">
            <div style={styleTitle}>Cette semaine</div>
            <div>
              {Object.keys(commandes).filter((key) => !commandes[key].terminee).sort((key) => !commandes[key].noCommande).map(
                (key, idx) => {
                  const infos = self.getCommandeInfos(key);
                  return (
                    <CommandePanel
                      nom={infos ? uniq(infos).join(', ') : null}
                      tarif="1.05 € au lieu de 1.25 €"
                      prct={100}
                      fav={false}
                      key={idx}
                      commandeId={`${key}`}
                      clickHandler={() => this.props.pushState(`/relais/${relaiId}/commandes/${key}`)}
                    />
                  );
                }
                )}
            </div>
          </div>
          <div className="col-xs">
            <div style={styleTitle}>La semaine prochaine</div>
            <div>
              {Object.keys(commandes).filter((key) => !commandes[key].terminee).sort((key) => !commandes[key].noCommande).map(
                (key, idx) => {
                  const infos = self.getCommandeInfos(key);
                  return (
                    <CommandePanel
                      nom={infos ? uniq(infos).join(', ') : null}
                      tarif="1.05 € au lieu de 1.25 €"
                      prct={100}
                      fav={false}
                      key={idx}
                      commandeId={`${key}`}
                      clickHandler={() => this.props.pushState(`/relais/${relaiId}/commandes/${key}`)}
                    />
                  );
                }
                )}
            </div>
          </div>
          <div className="col-xs">
            <div style={styleTitle}>Dans quinze jours</div>
              <div>
                {Object.keys(commandes).filter((key) => !commandes[key].terminee).sort((key) => !commandes[key].noCommande).map(
                  (key, idx) => {
                    const infos = self.getCommandeInfos(key);
                    return (
                      <CommandePanel
                        nom={infos ? uniq(infos).join(', ') : null}
                        tarif="1.05 € au lieu de 1.25 €"
                        prct={100}
                        fav={false}
                        key={idx}
                        commandeId={`${key}`}
                        clickHandler={() => this.props.pushState(`/relais/${relaiId}/commandes/${key}`)}
                      />
                    );
                  }
                  )}
              </div>
          </div>
          <div className="col-xs">
            <div style={styleTitle}>Dans 3 semaines</div>
            <Offre
              nom="Fromages & charcuterie"
              tarif="1.05 € au lieu de 1.25 €"
              imageSrc={choux}
              prct={40}
              fav
            />
          </div>
        </div>
      );
    }

    if (!commandes) {
      return (
        <div className={`${styles.commandeEdit} row`}>
          <div className="col-md-12">
            <div style={{ margin: 'auto', width: '40px' }}>
              <RefreshIndicator
                size={40}
                left={0}
                top={10}
                status="loading"
                style={{ display: 'inline-block', position: 'relative' }}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
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
  commandes: selectCommandesRelais(),
  relaiId: selectRelaisId(),
  produits: selectProduits(),
  fournisseurs: selectFournisseurs(),
  typesProduits: selectTypesProduits(),
  asyncState: selectAsyncState(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadCommandes: (page) => dispatch(loadCommandes(page)),
    loadCommande: (id) => dispatch(loadCommandeAction(id)),
    pushState: (url) => dispatch(push(url)),
    ajouter: (contenuId, qte) => dispatch(ajouter(contenuId, qte)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commande);
