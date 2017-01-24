import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AutoComplete from 'material-ui/AutoComplete';
import { loadDepots } from './actions';
import { loadUtilisateurs } from 'containers/AdminUtilisateurs/actions';
import { Column, Table } from 'react-virtualized';
import { selectUtilisateurs } from 'containers/AdminUtilisateurs/selectors';
import authorization from 'containers/Authorization';
import { selectDepots, selectTotal } from './selectors';
import moment from 'moment';
import styles from './index.css';

class AdminDepot extends Component { // eslint-disable-line
  static propTypes = {
    depots: PropTypes.array.isRequired,
    utilisateurs: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    loadDepotsDatas: PropTypes.func.isRequired,
    loadUtilisateursDatas: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    filtreNom: null,
  }

  componentDidMount() {
    const { depots, loadDepotsDatas, utilisateurs, loadUtilisateursDatas } = this.props;

    if (!depots.length) {
      loadDepotsDatas();
    }

    if (!utilisateurs.length) {
      loadUtilisateursDatas();
    }
  }

  handleUpdateChange = (recherche) => {
    const { utilisateurs } = this.props;
    const utilisateur = utilisateurs.find((u) => `${u.nom} ${u.prenom}` === recherche);
    if (utilisateur) {
      this.props.loadDepotsDatas({ utilisateurId: utilisateur.id });
    }
  }

  render() {
    const { depots, total, utilisateurs } = this.props;

    if (!depots.length || !utilisateurs.length) return null;

    const palette = this.context.muiTheme.palette;

    return (
      <div className="row">
        <div className={`col-md-12 ${styles.panel}`}>
          <AutoComplete
            hintText="Nom recherché"
            caseInsensitiveFilter={false}
            onNewRequest={this.handleUpdateChange}
            dataSource={utilisateurs.map((u) => (`${u.nom} ${u.prenom}`))}
          />
        </div>
        <div className={`col-md-12 ${styles.panel}`}>
          <div>Total: {total}</div>
          <Table
            width={1200}
            height={400}
            headerHeight={30}
            rowHeight={30}
            rowCount={depots.length}
            rowGetter={({ index }) => depots[index]}
            rowStyle={(obj) => ({
              borderBottom: 'solid 1px silver',
              backgroundColor: obj.index % 2 === 0 || obj.index === -1 ? 'white' : palette.oddColor,
            })}
          >
            <Column label="Type" dataKey="type" width="150" />
            <Column
              label="Effectué"
              dataKey="transfertEffectue"
              width="150"
              cellDataGetter={
                ({ rowData }) => (rowData.transfertEffectue ? 'oui' : 'non')
              }
            />
            <Column label="Montant" dataKey="montant" width="150" />
            <Column
              label="Date"
              dataKey="createdAt"
              width="350"
              cellDataGetter={
                ({ rowData }) => moment(rowData.createdAt).format('LLL')
              }
            />
            <Column
              label="Utilisateur"
              dataKey="utilisateurId"
              width="350"
              cellDataGetter={
                ({ rowData }) => {
                  const ut = utilisateurs.find((u) => u.id === rowData.utilisateurId);
                  return ut ?
                          `${ut.prenom} ${ut.nom}` :
                          '---';
                }
              }
            />
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  depots: selectDepots(),
  total: selectTotal(),
  utilisateurs: selectUtilisateurs(),
});

const mapDispatchToProps = (dispatch) => ({
  loadDepotsDatas: (query) => dispatch(loadDepots(query)),
  loadUtilisateursDatas: () => dispatch(loadUtilisateurs()),
});

export default authorization(
  connect(mapStateToProps, mapDispatchToProps)(AdminDepot),
  ['ADMIN', 'RELAI_ADMIN']
);
