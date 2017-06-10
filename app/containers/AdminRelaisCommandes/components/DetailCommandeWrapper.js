import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { selectCommandeId } from 'containers/Commande/selectors';

import styles from './styles.css';
import classnames from 'classnames';

class DetailCommandeWrapper extends Component {
  static propTypes = {
    commandeId: PropTypes.string.isRequired,
    relais: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    commandes: PropTypes.array.isRequired,
  };

  render() {
    const { commandes, commandeId, params, relais } = this.props;
    return (
      <div
        className={classnames(
          'col-md-10',
          styles.panel,
          { [styles.nouvelleCommande]: !commandeId },
          {
            [styles.noScroll]: !commandeId,
          }
        )}
      >
        {React.cloneElement(this.props.children, {
          commandes,
          commandeId,
          params,
          relais,
        })}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeId: selectCommandeId(),
});

export default connect(mapStateToProps)(DetailCommandeWrapper);
