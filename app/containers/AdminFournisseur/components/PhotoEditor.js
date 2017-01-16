import React, { Component, PropTypes } from 'react';
import AvatarEditor from 'components/AvatarEditor';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';

export default class PhotoEditor extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
  }

  state = {
    zoom: 1,
    editing: false,
  }

  changeZoom = (event, value) =>
    this.setState({ ...this.state, zoom: value })

  render() {
    const { produit } = this.props;
    return (
      <div className="row center-md">
        <div className="col-md-12">
          <AvatarEditor
            ref={(node) => (this.editor = node)}
            image={`https://proxiweb.fr/${produit.photo}`}
            width={150}
            height={150}
            border={50}
            color={[0, 0, 0, 0.2]}
            scale={this.state.zoom}
            style={{ margin: '0 20px' }}
            onDropFile={() => this.setState({ ...this.state, editing: true })}
          />
        </div>
        <div className="col-md-8" style={{ maxHeight: '50px' }}>
          <Slider
            value={this.state.zoom}
            min={0}
            max={5}
            onChange={this.changeZoom}
          />
        </div>
        {this.state.editing &&
          <div className="col-md-8">
            <RaisedButton fullWidth primary label="Modifier la photo" />
          </div>}
      </div>
    );
  }
}
