/*
 *
 * CommandeEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {
  selectCommandeProduitsByTypeProduit,
  selectCommandeTypesProduits,
  computeNombreCommandeContenus,
  selectOffresByProduit,
  selectNombreAcheteurs,
  selectParams,
  selectQuantiteOffresAchetees,
} from 'containers/Commande/selectors';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styles from './styles.css';

export class CommandeEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    typeProduits: PropTypes.array.isRequired,
    produits: PropTypes.array,
    contenus: PropTypes.number,
    quantiteOffresAchetees: PropTypes.array,
    offres: PropTypes.array,
    acheteurs: PropTypes.number,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { params } = this.props;
    this.props.pushState(`/commandes/${params.commandeId}/typeProduits/${this.select.value}`);
  }

  render() {
    const { typeProduits, produits, acheteurs, quantiteOffresAchetees, params, contenus } = this.props;
    const { commandeId, typeProduitId } = params;
    return (
      <div className={styles.commandeEdit}>
        <Helmet
          title="CommandeEdit"
          meta={[
            { name: 'description', content: 'Description of CommandeEdit' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <select className="form-control" onChange={this.handleChange} ref={(node) => { this.select = node; }}>
          { typeProduits && typeProduits.map((type, index) => <option key={index} value={type.id}>{type.nom}</option>)}
        </select>
        {produits && (
          <div>
            <ul>
              {
                produits.map((pdt, idx) => (
                  <li key={idx}>
                    <Link to={`/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${pdt.id}`}>{pdt.nom}</Link>
                  </li>))
              }
            </ul>
          </div>
        )}
        {quantiteOffresAchetees && (
          <div>
            <ul>
              {quantiteOffresAchetees.map((offre, idx) => <li key={idx}>{offre.id} : {offre.quantiteTotal}</li>)}
            </ul>
          </div>
        )}
        { acheteurs && <h1>{acheteurs} - { contenus }</h1>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  offres: selectOffresByProduit(),
  acheteurs: selectNombreAcheteurs(),
  quantiteOffresAchetees: selectQuantiteOffresAchetees(),
  contenus: computeNombreCommandeContenus(),
  params: selectParams(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
