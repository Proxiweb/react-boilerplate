import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import round from 'lodash/round';
import includes from 'lodash/includes';
import shader from 'shader';
import IconButton from 'material-ui/IconButton';
import ActionDoneIcon from 'material-ui/svg-icons/action/done';
import KeyboardDownIcon
  from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import LigneFondsWarning
  from 'containers/CommandeEdit/components/LigneFondsWarning';
import LigneFondsOk from 'containers/CommandeEdit/components/LigneFondsOk';

import { sauvegarder } from 'containers/CommandeEdit/actions';

import {
  selectOffres,
  selectCommandeContenus,
} from 'containers/Commande/selectors';

import { selectPending } from 'containers/App/selectors';

import OrderValidate from './OrderValidate';

import { calculeTotauxCommande } from 'containers/Commande/utils';
import styles from './styles.css';

const constStyles = {
  paddingTop0: {
    paddingTop: 0,
  },
  iconExpandableButton: {
    width: '100%',
    textAlign: 'right',
  },
};

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
    livraisonNotSelected: PropTypes.bool.isRequired,
    sauvegarder: PropTypes.func.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    qteCommande: 0,
    expandable: true,
  };

  state = {
    expanded: false,
    first: true,
  };

  componentDidMount = () => this.setState({ ...this.state, first: false });

  shouldComponentUpdate = nextProps => {
    return true;
  };

  buildTitle = (nbreProduits, panierExpanded) => {
    const { commandeUtilisateur, autreUtilisateur } = this.props;

    if (commandeUtilisateur && commandeUtilisateur.createdAt) {
      return autreUtilisateur ? `Commande de ${autreUtilisateur}` : '';
    }

    if (!panierExpanded) {
      const formule = nbreProduits > 0
        ? 'Cliquez ici pour valider votre commande'
        : '';
      return autreUtilisateur ? `${formule} de ${autreUtilisateur}` : formule;
    }

    return '';
  };

  toggleState = () => {
    this.props.toggleState();
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const {
      params,
      offres,
      contenus,
      commandeContenus,
      panierExpanded,
      commandeId,
      utilisateurId,
      balance,
      expandable,
      modifiee,
      nouvelle,
      pending,
      livraisonNotSelected,
      commande,
    } = this.props;

    const { muiTheme } = this.context;
    const { expanded } = this.state;

    const totaux = calculeTotauxCommande({
      filter: cc => cc.utilisateurId === utilisateurId,
      commandeId,
      offres,
      commandeContenus,
    });

    const nbreProduits = Object.keys(commandeContenus)
      .filter(
        id =>
          commandeContenus[id].commandeId === commandeId &&
          commandeContenus[id].utilisateurId === utilisateurId
      )
      .reduce((mem, id) => mem + commandeContenus[id].quantite, 0);

    let msgPaiement = null;
    if (!expanded) {
      msgPaiement = round(totaux.prix + totaux.recolteFond, 2) <= balance
        ? <LigneFondsOk color={muiTheme.appBar.color} />
        : <LigneFondsWarning color={muiTheme.palette.warningColor} />;
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
          <div
            className={styles.text}
            onClick={expandable ? this.toggleState : null}
          >
            <div className={styles.title}>
              <span>
                Panier :
                {' '}
                <strong>
                  {round(totaux.prix + totaux.recolteFond, 2).toFixed(2) || 0} €
                </strong>
                {panierExpanded // eslint-disable-line
                  ? <span>
                      {' '}
                      (dont
                      {' '}
                      <strong>
                        {round(totaux.recolteFond, 2).toFixed(2)} €
                      </strong>
                      {' '}
                      pour la prestation de distribution)
                    </span>
                  : nbreProduits > 0
                      ? ` - ${nbreProduits} produit${nbreProduits > 1 ? 's' : ''}`
                      : ''}
                {typeof balance === 'number' && totaux.prix > 0 && msgPaiement}
              </span>
            </div>
            <div className={styles.subTitle}>
              {this.buildTitle(nbreProduits, expanded)}
            </div>
          </div>
          <div className={styles.action}>
            {!expanded &&
              (modifiee || nouvelle) &&
              nbreProduits > 0 &&
              !livraisonNotSelected &&
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
                onClick={() =>
                  this.props.sauvegarder({
                    ...commande,
                    commandeId,
                    utilisateurId,
                  })}
              />}
          </div>
          {expandable &&
            <div className={styles.expand}>
              <IconButton
                onClick={this.toggleState}
                style={constStyles.iconExpandableButton}
              >
                {!expanded && <KeyboardDownIcon />}
                {expanded && <KeyboardUpIcon />}
              </IconButton>
            </div>}
        </div>
        {expanded &&
          <div style={constStyles.paddingTop0}>
            <OrderValidate
              params={params}
              commande={commande}
              utilisateurId={utilisateurId}
              panierExpanded={this.state.expanded}
              balance={balance}
            />
          </div>}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  offres: selectOffres(),
  commandeContenus: selectCommandeContenus(),
  pending: selectPending(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      sauvegarder: datas => dispatch(sauvegarder(datas)),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PanierCollapsable);
