import React, { PropTypes, Component } from 'react';
import Panel from 'components/Panel';
import AffichePrix from 'containers/CommandeEdit/components/components/AffichePrix';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

export default class Offre extends Component { // eslint-disable-line
  static propTypes = {
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
  }

  render() {
    const { offre, typeProduit } = this.props;
    return (
      <Panel>
        <div className="row">
          <div className="col-md-8">
            <AffichePrix offre={offre} typeProduit={typeProduit} style={{ lineHeight: '36px' }} />
          </div>
          <div className="col-md-4">
            <IconButton>
              <EditIcon />
            </IconButton>
          </div>
        </div>
      </Panel>
    );
  }
}
