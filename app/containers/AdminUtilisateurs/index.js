import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { loadUtilisateurs } from './actions';
import { Column, Table } from 'react-virtualized';
import moment from 'moment';
import styles from './styles.css';

class AdminUtilisateurs extends Component { // eslint-disable-line
  static propTypes = {
    utilisateurs: PropTypes.array.isRequired,
    loadUtilisateursDatas: PropTypes.func.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  }

  state = {
    datas: [],
  }

  componentDidMount() {
    const { utilisateurs, loadUtilisateursDatas } = this.props;

    if (!utilisateurs.length) {
      loadUtilisateursDatas();
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ datas: newProps.utilisateurs });
  }

  handleChange = (event) => {
    if (!event.target.value) {
      this.setState({
        datas: this.props.utilisateurs,
      });
    } else {
      this.setState({
        datas: this.state.datas.filter(
          (u) => u.nom && u.nom.toLowerCase().indexOf(event.target.value) !== -1
        ),
      });
    }
  }

  render() {
    const { datas } = this.state;
    if (!datas.length) return null;
    const palette = this.context.muiTheme.palette;
    return (
      <div className="row">
        <div className={`col-md-12 ${styles.panel}`}>
          <TextField hintText="Nom recherché" onChange={this.handleChange} />
        </div>
        <div className={`col-md-12 ${styles.panel}`}>
          <Paper zDepth={1}>
            <Table
              width={1200}
              height={500}
              headerHeight={30}
              rowHeight={30}
              rowCount={datas.length}
              rowGetter={({ index }) => datas[index]}
              rowStyle={(obj) => ({
                borderBottom: 'solid 1epx silver',
                backgroundColor: obj.index % 2 === 0 || obj.index === -1 ? 'white' : palette.oddColor,
              })}
            >
              <Column label="Nom" dataKey="nom" width="150" />
              <Column label="Prénom" dataKey="prenom" width="150" />
              <Column
                label="Date création"
                dataKey="createdAt"
                cellDataGetter={
                  ({ columnData, dataKey, rowData }) => moment(rowData.createdAt).format('DD/MM/YYYY HH:mm')
                }
                width="200"
              />
              <Column
                label="Cotisation payée le"
                dataKey="datePaiementCotisation"
                cellDataGetter={
                  ({ columnData, dataKey, rowData }) => moment(rowData.createdAt).format('DD/MM/YYYY HH:mm')
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
});

const mapDispatchToProps = (dispatch) => ({
  loadUtilisateursDatas: (query) => dispatch(loadUtilisateurs(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUtilisateurs);
