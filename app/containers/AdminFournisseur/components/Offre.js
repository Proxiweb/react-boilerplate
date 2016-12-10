import React, { PropTypes, Components } from 'react';
import Panel from 'components/Panel';
import AffichePrix from 'containers/CommandeEdit/components/components/AffichePrix';
import FlatButton from 'material-ui/FlatButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

export default class Offre extends Components {
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
            <FlatButton
              icon={<EditIcon />}
            />
          </div>
        </div>
      </Panel>
    );
  }
}
