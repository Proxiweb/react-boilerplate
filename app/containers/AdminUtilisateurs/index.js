import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Column, Table } from 'react-virtualized';
import moment from 'moment';
import capitalize from 'lodash.capitalize';
import { loadUtilisateurs } from './actions';
import SortIndicator from 'components/SortIndicator';
import styles from './styles.css';

class AdminUtilisateurs extends Component { // eslint-disable-line
  static propTypes = {
    utilisateurs: PropTypes.array.isRequired,
    relais: PropTypes.array.isRequired,
    loadUtilisateursDatas: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.initialState = {
      datas: this.props.utilisateurs,
      filtre: {
        relais: null,
        cotisation: 'cotisation_all',
      },
      height: window.innerHeight - 238,
      width: window.innerWidth - 100,
      sortBy: 'nom',
      sortDirection: 'ASC',
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const { utilisateurs, loadUtilisateursDatas } = this.props;

    if (!utilisateurs.length) {
      loadUtilisateursDatas();
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ datas: newProps.utilisateurs });
  }

  componentDidUnmount() { // eslint-disable-line
    this.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ ...this.state, height: window.innerHeight - 238, width: window.innerWidth - 30 });

  handleChange = (event) => {
    if (!event.target.value) {
      this.setState({
        datas: this.props.utilisateurs,
        filtre: { relais: null, cotisation: 'cotisation_all' },
      });
    } else {
      this.setState({
        datas: this.props.utilisateurs.filter(
          (u) => u.nom && u.nom.toLowerCase().indexOf(event.target.value) !== -1
        ),
        filtre: { relais: null, cotisation: 'cotisation_all' },
      });
    }
  }

  headerRenderer = ({ label, sortBy, sortDirection, dataKey }) => <div>{label}{sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}</div>

  getFiltredDatas = () => {
    const { filtre, datas } = this.state;
    return (filtre.relais || filtre.cotisation) ?
      datas
        .filter((d) => {
          let convient = false;
          if (!filtre.relais || filtre.relais === 'indifferent') convient = true;
          if (filtre.relais && filtre.relais === 'pas_de_relais' && !d.relaiId) convient = true;
          if (filtre.relais && d.relaiId === filtre.relais) convient = true;
          if (convient) {
            switch (filtre.cotisation) { // eslint-disable-line
              case 'cotisation_null':
                if (d.datePaiementCotisation) {
                  convient = false;
                }
                break;
              case 'cotisation_ok':
                if (!d.datePaiementCotisation) {
                  convient = false;
                  break;
                }
                if (moment().isAfter(moment(d.datePaiementCotisation).add(1, 'years'))) {
                  convient = false;
                }
                break;
              case 'cotisation_ko':
                if (!d.datePaiementCotisation) {
                  convient = false;
                  break;
                }
                if (moment().isBefore(moment(d.datePaiementCotisation).add(1, 'years'))) {
                  convient = false;
                }
                break;
            }
          }
          return convient;
        })
      : datas;
  }

  handleSort = ({ sortBy, sortDirection }) => {
    this.setState({ ...this.state, sortBy, sortDirection });
  }

  handleRelaiChange = (event, idx, relais) => this.setState({ ...this.state, filtre: { ...this.state.filtre, relais } })

  handleCotisationChange = (event, idx, cotisation) => this.setState({ ...this.state, filtre: { ...this.state.filtre, cotisation } })

  render() {
    const { sortBy, sortDirection } = this.state;
    const { relais } = this.props;
    const palette = this.context.muiTheme.palette;

    const datas = this.getFiltredDatas().sort((a, b) => {
      if (sortBy === 'nom') {
        if (!a.nom || !a.prenom) return false;
        return sortDirection === 'ASC' ?
          a.nom > b.nom :
          a.nom < b.nom;
      }
      return false;
    });
    return (
      <div className="row">
        <div className={`col-md-12 ${styles.panel}`}>
          <div className="row">
            <div className="col-lg">
              <TextField hintText="Nom recherché" onChange={this.handleChange} />
            </div>
            <div className="col-lg">
              <SelectField
                value={this.state.filtre.cotisation}
                onChange={this.handleCotisationChange}
              >
                <MenuItem value="cotisation_all" primaryText="Indifférent" />
                <MenuItem value="cotisation_ok" primaryText="Cotisation à jour" />
                <MenuItem value="cotisation_ko" primaryText="Cotisation pas à jour" />
                <MenuItem value="cotisation_null" primaryText="Jamais cotisé" />
              </SelectField>
            </div>
            {relais.length && (
              <div className="col-lg">
                <SelectField
                  value={this.state.filtre.relais}
                  onChange={this.handleRelaiChange}
                >
                  <MenuItem value="indifferent" primaryText="Indifférent" />
                  <MenuItem value="pas_de_relais" primaryText="Pas de relais" />
                  {relais.map((r) => <MenuItem value={r.id} primaryText={r.nom} />)}
                </SelectField>
              </div>
            )}
            <div className="col-lg">{datas.length} adhérents</div>
          </div>
        </div>
        <div className={`col-md-12 ${styles.panel}`}>
          <Paper zDepth={1}>
            <Table
              width={this.state.width}
              height={this.state.height}
              headerHeight={30}
              rowHeight={30}
              rowCount={datas.length}
              rowGetter={({ index }) => datas[index]}
              rowStyle={(obj) => ({
                borderBottom: 'solid 1epx silver',
                backgroundColor: obj.index % 2 === 0 || obj.index === -1 ? 'white' : palette.oddColor,
              })}
              sort={this.handleSort}
              sortBy={sortBy}
              sortDirection={sortDirection}
            >
              <Column
                label="Nom"
                dataKey="nom"
                width="300"
                headerRenderer={this.headerRenderer}
                cellDataGetter={
                  ({ rowData }) => `${rowData.nom.toUpperCase()} ${capitalize(rowData.prenom)}`
                }
                disableSort={false}
              />
              <Column
                label="Date création"
                dataKey="createdAt"
                cellDataGetter={
                  ({ rowData }) => moment(rowData.createdAt).format('DD/MM/YYYY')
                }
                width="200"
                disableSort={false}
              />
              <Column
                label="Cotisation payée le"
                dataKey="datePaiementCotisation"
                width="250"
                cellDataGetter={
                  ({ rowData }) => (moment(rowData.datePaiementCotisation).isValid() ?
                                    moment(rowData.datePaiementCotisation).format('DD/MM/YYYY') :
                                    '---')
                }
              />
              <Column
                label="Relai"
                dataKey="relaiId"
                width="200"
                cellDataGetter={
                  ({ rowData }) => {
                    if (!rowData.relaiId) return '';
                    const relai = relais.find((r) => r.id === rowData.relaiId);
                    return relai ? relai.nom : rowData.relaiId;
                  }
                }
              />
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  utilisateurs: state.admin.utilisateurs.datas,
  relais: state.admin.relais.datas,
});

const mapDispatchToProps = (dispatch) => ({
  loadUtilisateursDatas: (query) => dispatch(loadUtilisateurs(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUtilisateurs);
