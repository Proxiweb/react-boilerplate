import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AvatarEditor from "components/AvatarEditor";
import Slider from "material-ui/Slider";
import RaisedButton from "material-ui/RaisedButton";
import { changePhoto } from "containers/Commande/actions";

class PhotoEditor extends Component {
  static propTypes = {
    produit: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired
  };

  state = {
    zoom: 1,
    editing: false
  };

  changeZoom = (event, value) => this.setState({ ...this.state, zoom: value });

  changePhoto = () => this.props.change(this.props.produit.id, this.editor.getImage().toDataURL());

  render() {
    const { produit } = this.props;
    const imgUrl = produit.photo ? produit.photo : "img/deposez.png";
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row center-md">
            <div className="col-md-12">
              <AvatarEditor
                ref={node => (this.editor = node)}
                image={`https://proxiweb.fr/assets/${imgUrl}`}
                width={150}
                height={150}
                border={50}
                color={[0, 0, 0, 0.2]}
                scale={this.state.zoom}
                style={{ margin: "0 20px" }}
                onDropFile={() => this.setState({ ...this.state, editing: true })}
                onLoadFailure={this.handleLoadFailure}
                onLoadSuccess={this.handleLoadSuccess}
              />
            </div>
            <div className="col-md-6" style={{ maxHeight: "50px" }}>
              <Slider value={this.state.zoom} min={0} max={5} onChange={this.changeZoom} />
            </div>
            {this.state.editing &&
              <div className="col-md-8">
                <RaisedButton fullWidth primary label="Modifier la photo" onClick={this.changePhoto} />
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change: changePhoto
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(PhotoEditor);
