import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconButton from 'material-ui/IconButton';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import Toggle from 'material-ui/Toggle';

import { saveOffre, deleteOffre } from 'containers/Commande/actions';

import ArchiveIcon from 'material-ui/svg-icons/action/assignment-returned';
import styles from './styles.css';

import OffreDetails from 'components/OffreDetails';
import { get } from 'utils/apiClient';

class OffreProduit extends Component {
  static propTypes = {
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
    saveOffre: PropTypes.func.isRequired,
    deleteOffre: PropTypes.func.isRequired,
    handleStore: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteable: false,
    };
    this.checkDelete();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.offre.id !== nextProps.offre.id) {
      this.checkDelete(nextProps.offre);
    }
  }

  checkDelete = offre => {
    const id = offre ? offre.id : this.props.offre.id;
    get(`/api/offre_produits/${id}/check`).then(res => {
      this.setState({
        deletable: res.datas.deletable,
      });
    });
  };

  handleDelete = id => {
    if (confirm('Supprimer cette offre')) {
      this.props.deleteOffre(id);
    }
  };

  render() {
    const { typeProduit, offre, handleStore, idx } = this.props;
    return (
      <div className={`row ${styles.offre}`}>
        <div className="col-md-8">
          <OffreDetails
            key={idx}
            offre={offre}
            qteCommande={0}
            typeProduit={typeProduit}
          />
        </div>
        <div className="col-md-2">
          <Toggle
            label={offre.active ? 'active' : 'inactive'}
            className={styles.toggle}
            toggled={offre.active}
          />
        </div>
        <div className="col-md-2">
          <IconButton
            onClick={() => handleStore(offre)}
            tooltip="Archiver"
            tooltipPosition="top-center"
          >
            <ArchiveIcon color="black" />
          </IconButton>
          <IconButton
            onClick={() => this.handleDelete(offre.id)}
            tooltip="Supprimer"
            tooltipPosition="top-center"
          >
            <TrashIcon color={`${this.state.deletable ? 'black' : 'gray'}`} />
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveOffre: (offre, msg) => saveOffre(offre, msg),
      deleteOffre: id => deleteOffre(id),
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(OffreProduit);
