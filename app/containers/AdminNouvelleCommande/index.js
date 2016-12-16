import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tabs, Tab } from 'material-ui/Tabs';
import { loadFournisseurs } from 'containers/Commande/actions';
import { selectFournisseurs } from 'containers/Commande/selectors';
import { List, ListItem, makeSelectable } from 'material-ui/List';
const SelectableList = makeSelectable(List);
import styles from './styles.css';

class NouvelleCommande extends Component { // eslint-disable-line
  static propTypes = {
    commande: PropTypes.object,
    fournisseurs: PropTypes.array.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    cdeFourns: [],
  }

  addFourn = (value) => {
    if (this.state.cdeFourns.includes(value)) return;
    this.setState({ cdeFourns: [...this.state.cdeFourns, value] });
  }

  delFourn = (value) => this.setState({ cdeFourns: this.state.cdeFourns.filter((cde) => cde.id !== value.id) });

  render() {
    const { fournisseurs, params } = this.props;
    const { cdeFourns } = this.state;
    const { muiTheme } = this.context;
    return (
      <div className="row center-md">
        <div className="col-md-10">
          <Tabs
            inkBarStyle={{ height: 7, backgroundColor: muiTheme.appBar.color, marginTop: -7 }}
          >
            <Tab label="Fournisseurs">
              <div className="row">
                <div className="col-md">
                  <h4 style={{ textAlign: 'center' }}>Fournisseurs</h4>
                  <div className={styles.panel}>
                    <SelectableList value={location.pathname}>
                      {fournisseurs.map((fourn, idx) =>
                        <ListItem
                          key={idx}
                          primaryText={fourn.nom.toUpperCase()}
                          value={`${fourn.id}`}
                          onClick={() => this.addFourn(fourn)}
                        />
                      )}
                    </SelectableList>
                  </div>
                </div>
                <div className="col-md">
                  <h4 style={{ textAlign: 'center' }}>Fournisseurs de cette commande</h4>
                  <div className={styles.panel}>
                    <SelectableList value={location.pathname}>
                      {cdeFourns.map((fourn, idx) =>
                        <ListItem
                          key={idx}
                          primaryText={fourn.nom.toUpperCase()}
                          value={`${fourn.id}`}
                          onClick={() => this.delFourn(fourn)}
                        />
                      )}
                    </SelectableList>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab label="Paramètres">

            </Tab>
            <Tab label="Distribution">

            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: selectFournisseurs(),
});

const mapDispatchToProps = (dispatch) => ({
  load: () => dispatch(loadFournisseurs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NouvelleCommande);
