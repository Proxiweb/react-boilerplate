import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import HelpIcon from 'material-ui/svg-icons/action/help';
import DescriptionIcon from 'material-ui/svg-icons/action/description';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';

import { selectRelais } from 'containers/Commande/selectors';
import { loadRelais } from 'containers/Commande/actions';

import { selectionneRelais } from 'containers/App/actions';
import { selectRelaiId } from 'containers/App/selectors';

import styles from './styles.css';
import cabas from './cabas.jpg';

class HomePageAnon extends Component {
  static propTypes = {
    relais: PropTypes.object,
    relaiId: PropTypes.string,
    load: PropTypes.func.isRequired,
    choisirRelais: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    selectionRelais: false,
    justChanged: false,
  }

  componentDidMount = () => {
    const { relais, load } = this.props;
    if (!relais || !Object.keys(relais).length < 1) {
      load();
    }
  }

  handleChoisirRelais = (relaiId) => {
    this.props.choisirRelais(relaiId);
    this.setState({ selectionRelais: false, justChanged: true });
  }

  buildHelmet = () =>
    <Helmet
      title="Association ProxiWeb"
      meta={[
        { name: 'description', content: 'Organisation d\'achats groupés pour villages petits et gros' },
      ]}
    />

  render() {
    const { relais, relaiId, pushState } = this.props;
    if (!relais) return null;

    const { muiTheme: { palette: { warningColor, primary1Color } } } = this.context;
    const buttonRelaisOuCatalogueColor = this.state.justChanged ? warningColor : primary1Color;

    if (this.state.selectionRelais) {
      return (
        <div className="row center-md">
          <div className="col-md-10">
            <Paper className={styles.homepage}>
              <List>
                {Object.keys(relais).map((key, idx) =>
                  <ListItem
                    key={idx}
                    primaryText={relais[key].nom.toUpperCase()}
                    onClick={() => this.handleChoisirRelais(relais[key].id)}
                  />
                )}
              </List>
            </Paper>
          </div>
        </div>
      );
    }

    return (
      <div className="row center-md">
        {this.buildHelmet()}
        <div className="col-md-10">
          <Paper className={styles.homepage}>
            <div className="row start-md" style={{ padding: '1em' }}>
              <div className={`col-md-12 ${styles.encart}`}>
                <div className="row">
                  <div className="col-md-6">
                    <img src={cabas} alt="cabas" height="100%" width="auto" />
                  </div>
                  <div className={`col-md-6 ${styles.texteEncart}`}>
                    <h1>Relais ProxiWeb</h1>
                    <h3>{'Un groupement d\'achat et des relais locaux'}</h3>
                    <h3>{'pour villages'} <small>petits</small> et <span>Gros</span></h3>
                    <div className={`row ${styles.boutonsEncart}`}>
                      <div className="col-md-6">
                        <RaisedButton label="Présentation rapide" primary fullWidth />
                        <p>Chrome & Firefox seulement</p>
                      </div>
                      <div className="col-md-6">
                        {!relaiId &&
                          <RaisedButton
                            icon={<SearchIcon />}
                            label="Votre relais"
                            primary
                            fullWidth
                            onClick={() => this.setState({ selectionRelais: true, justChanged: false })}
                          />
                        }
                        {relaiId &&
                          <RaisedButton
                            icon={<ShoppingCartIcon />}
                            label="Catalogue"
                            primary={!this.state.justChanged}
                            backgroundColor={buttonRelaisOuCatalogueColor}
                            fullWidth
                            href={`/catalogue/${relaiId}`}
                          />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ textAlign: 'left' }}>
              <div className="col-md-4">
                <h1>{'L\'association'}</h1>
                <p>{'L\'association ProxWeb crée un site internet permettant d\'organiser des achats groupés'}</p>
                <ul>
                  <li>Catalogue des produits</li>
                  <li>{'Espace fournisseur (réception commandes, facturation...)Espace fournisseur (réception commandes, facturation...)'}</li>
                  <li>Paiement sécurisé en lignePaiement sécurisé en ligne</li>
                  <li>...</li>
                </ul>
                <p>{'Ce peut être des achats de produits locaux, mais aussi des achats collectifs massifs sur de nombreuses villes et villages.'}</p>
                <p>{'Le montant de l\'adhésion à l\'association a été fixé à seulement 3 €, pour que chacun soit assuré de rentabiliser sa dépense.'}</p>
              </div>
              <div className="col-md-4">
                <h1>Les relais locaux</h1>
                <p>
                  Localement, des travailleurs indépendants créent des relais pour distribuer les produits, ils sont rémunérés pour ce service.
                  <strong>{"L'association ne prend pas de commission"}</strong>.
                </p>
                <p>{'Ils définissent le montant qu\'ils veulent percevoir pour effectuer la distribution.'}</p>
                <p>
                  {'ProxiWeb ne prend pas de commission : l\'association est financée uniquement par les cotisations.'}
                  <strong>{'Le réseau bénéficie entièrement à ceux qui, chaque jour, le font fonctionner.'}</strong>
                </p>
              </div>
              <div className="col-md-3" style={{ padding: '1em' }}>
                <Menu>
                  <MenuItem
                    primaryText="Inscrivez-vous gratuitement"
                    leftIcon={<PersonAdd />}
                    onTouchTap={() => pushState('/login?action=register')}
                  />
                  {/* <MenuItem primaryText="Forum de discussion" leftIcon={<CommunicationChatBubble />} /> */}
                  <MenuItem primaryText="Contactez-nous" disabled leftIcon={<CommunicationEmail />} />
                  <MenuItem primaryText="Questions fréquentes" disabled leftIcon={<HelpIcon />} />
                  <Divider />
                  <MenuItem primaryText="Documentation" disabled leftIcon={<DescriptionIcon />} />
                </Menu>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
  relaiId: selectRelaiId(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pushState: push,
  load: loadRelais,
  choisirRelais: selectionneRelais,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomePageAnon);
