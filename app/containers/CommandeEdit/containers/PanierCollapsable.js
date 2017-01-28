import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import AlertWarningIcon from 'material-ui/svg-icons/alert/warning';
import round from 'lodash/round';
import shader from 'shader';
import IconButton from 'material-ui/IconButton';
import KeyboardDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

import {
  selectOffres,
  selectCommandeContenus,
} from 'containers/Commande/selectors';

import {
  selectPending,
} from 'containers/App/selectors';

import OrderValidate from './OrderValidate';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import styles from './styles.css';

class PanierCollapsable extends Component {
  static propTypes = {
    toggleState: PropTypes.func.isRequired,
    balance: PropTypes.number,
    commandeUtilisateur: PropTypes.object,
    commandeContenus: PropTypes.object.isRequired,
    offres: PropTypes.object.isRequired,
    contenus: PropTypes.array.isRequired,
    autreUtilisateur: PropTypes.string,
    params: PropTypes.object.isRequired,
    nbreProduits: PropTypes.number.isRequired,
    commandeId: PropTypes.string.isRequired,
    utilisateurId: PropTypes.string.isRequired,
    expandable: PropTypes.bool.isRequired,
    modifiee: PropTypes.bool.isRequired,
    nouvelle: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    panierExpanded: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    qteCommande: 0,
    expandable: true,
  }

  state = {
    expanded: false,
  }

  buildTitle = (nbreProduits, panierExpanded) => {
    const { commandeUtilisateur, autreUtilisateur } = this.props;
    if (commandeUtilisateur && commandeUtilisateur.id) {
      return autreUtilisateur ? `Commande de ${autreUtilisateur}` : '';
    }

    if (!panierExpanded) {
      const formule =
        nbreProduits > 0
          ? 'Cliquez ici pour valider votre commande'
          : '';
      return autreUtilisateur
        ? `${formule} de ${autreUtilisateur}`
        : formule;
    }

    return '';
  }

  toggleState = () => {
    this.props.toggleState();
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const {
      params,
      offres,
      contenus,
      commandeContenus,
      panierExpanded,
      commandeId,
      utilisateurId,
      nbreProduits,
      balance,
      expandable,
      modifiee,
      nouvelle,
      pending,
    } = this.props;

    const { muiTheme } = this.context;
    const { expanded } = this.state;

    const contenusCommande = contenus.map((contenu) =>
      // quand le contenu vient d'être ajouté, contenu est un objet sans id
      // quand il s'agit d'une commande depuis Bd, il n'y a que l'id -> commandeContenus[id]
      (typeof contenu === 'object' ? contenu : commandeContenus[contenu])
    );

    const totaux = calculeTotauxCommande({
      contenus: contenusCommande,
      commandeId,
      offres,
      commandeContenus,
    });

    let msgPaiement = null;
    if (!expanded) {
      msgPaiement =
        round(totaux.prix + totaux.recolteFond, 2) <= balance
          ? (<small style={{ color: shader(muiTheme.appBar.color, -0.4) }}>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<ActionDoneIcon style={{ verticalAlign: 'middle', color: shader(muiTheme.appBar.color, -0.4) }} />
            {'\u00A0'}Fonds porte-monnaie suffisants
          </small>)
          : (<small style={{ color: muiTheme.palette.warningColor }}>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
            <AlertWarningIcon style={{ verticalAlign: 'middle', color: muiTheme.palette.warningColor }} />
            {'\u00A0'}Fonds porte-monnaie insuffisants
          </small>);
    }
    let label;
    if (modifiee) {
      label = pending ? 'Modification...' : 'Modifier';
    } else {
      label = pending ? 'Validation' : 'Valider';
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.text} onClick={expandable ? this.toggleState : null}>
            <div className={styles.title}>
              <span>
                Panier : <strong>{round(totaux.prix + totaux.recolteFond, 2).toFixed(2) || 0} €</strong>
                {panierExpanded // eslint-disable-line
                  ? <span> (dont <strong>{round(totaux.recolteFond, 2).toFixed(2)} €</strong> pour la prestation de distribution)</span>
                  : nbreProduits > 0
                    ? ` - ${nbreProduits} produit${nbreProduits > 1 ? 's' : ''}`
                    : ''
                }
                {typeof balance === 'number' && totaux.prix > 0 && msgPaiement}
              </span>
            </div>
            <div className={styles.subTitle}>
              { this.buildTitle(nbreProduits, expanded) }
            </div>
          </div>
          <div className={styles.action}>
            { !expanded && (modifiee || nouvelle) &&
              <RaisedButton
                fullWidth
                label={label}
                labelColor={modifiee ? 'black' : 'white'}
                backgroundColor={
                  modifiee
                  ? muiTheme.palette.warningColor
                  : muiTheme.palette.primary1Color
                }
                icon={<ActionDoneIcon />}
              />
            }
          </div>
          {expandable &&
            <div className={styles.expand}>
              <IconButton
                onClick={this.toggleState}
                style={{ width: '100%', textAlign: 'right' }}
              >
                {!expanded && <KeyboardDownIcon />}
                {expanded && <KeyboardUpIcon />}
              </IconButton>
            </div>
          }
        </div>
        {expanded &&
          <div style={{ paddingTop: 0 }}>
            <OrderValidate
              params={params}
              utilisateurId={utilisateurId}
              panierExpanded={this.state.expanded}
              balance={balance}
            />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: selectOffres(),
  commandeContenus: selectCommandeContenus(),
  pending: selectPending(),
});

export default connect(mapStateToProps)(PanierCollapsable);
