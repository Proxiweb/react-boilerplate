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
  selectOffresByProduit,
  selectParams,
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
    offres: PropTypes.array,
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
    const { typeProduits, produits, offres, params } = this.props;
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
          <ul>
            {
              produits.map((pdt, idx) => (
                <li key={idx}>
                  <Link to={`/commandes/${commandeId}/typeProduits/${typeProduitId}/produits/${pdt.id}`}>{pdt.nom}</Link>
                </li>))
            }
          </ul>
        )}
        {offres && (<ul>
          {offres.map((offre, idx) => <li key={idx}>{offre.id}</li>)}
        </ul>)}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  typeProduits: selectCommandeTypesProduits(),
  produits: selectCommandeProduitsByTypeProduit(),
  offres: selectOffresByProduit(),
  params: selectParams(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandeEdit);
