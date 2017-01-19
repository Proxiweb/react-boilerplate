import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';
import ArchiveIcon from 'material-ui/svg-icons/action/assignment-returned';
import Toggle from 'material-ui/Toggle';

import styles from './styles.css';
import { saveOffre } from 'containers/Commande/actions';
import OffreDetailsCard from 'components/OffreDetailsCard';


class Offre extends Component { // eslint-disable-line
  static propTypes = {
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
    handleToggeState: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  }

  handleDelete = () => ({})

  handleStore = () => ({})

  handleToggle = () =>
    this.props.save({
      ...this.props.offre,
      active: !this.props.offre.active,
    }, null)

  render() {
    const { offre, typeProduit, handleToggeState } = this.props;
    return (
      <div className="row">
        <div className="col-md-9">
          {
            <div className={`row ${styles.offre}`}>
              <div className="col-md-12">
                <OffreDetailsCard offre={offre} typeProduit={typeProduit} />
              </div>
            </div>
          }
        </div>
        <div className="col-md-3">
          <div className="row">
            <div className="col-md-2">
              <IconButton
                onClick={handleToggeState}
                tooltip="Modifier"
                tooltipPosition="top-center"
              >
                <EditIcon />
              </IconButton>
            </div>
            <div className="col-md-2">
              <IconButton
                onClick={this.handleDelete}
                tooltip="Supprimer (non implémenté)"
                tooltipPosition="top-center"
              >
                <TrashIcon color="gray" />
              </IconButton>
            </div>
            <div className="col-md-2">
              <IconButton
                onClick={this.handleStore}
                tooltip="Archiver (non implémenté)"
                tooltipPosition="top-center"
              >
                <ArchiveIcon color="gray" />
              </IconButton>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <Toggle
                toggled={offre.active}
                label={offre.active ? 'active' : 'désactivée'}
                onToggle={this.handleToggle}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  save: (datas) => dispatch(saveOffre(datas)),
});

export default connect(null, mapDispatchToProps)(Offre);
