import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectRelais } from 'containers/Commande/selectors';
import { loadRelais } from 'containers/Commande/actions';
import styles from './styles.css';

class TexteCatalogue extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    relais: PropTypes.object,
  }

  componentDidMount = () => {
    const { relais, load, params } = this.props;
    if (!relais) {
      load(params.relaiId);
    }
  }

  render() {
    const { relais, params } = this.props;
    const ceRelais = relais[params.relaiId];
    if (!ceRelais) return null;

    return (
      <div className="row" style={{ paddingLeft: '1em', paddingRight: '1em' }}>
        <div className={`col-md-12 ${styles.texteCatalogue}`}>
          <h1>Catalogue du relais {ceRelais.nom}</h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  relais: selectRelais(),
});

const mapDispatchToProps = (dispatch) => ({
  load: (query) => dispatch(loadRelais(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TexteCatalogue);
