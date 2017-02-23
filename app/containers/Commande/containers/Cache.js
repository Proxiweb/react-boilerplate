import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { get } from 'utils/apiClient';
import { loadFournisseurs, loadOffres, updateCatalogue } from 'containers/Commande/actions';
import { selectLastFetched } from 'containers/Commande/selectors';

class CatalogueCache extends Component {
  static propTypes = {
    lastFetched: PropTypes.object.isRequired,
    relaiId: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    // loadFournisseurs: PropTypes.func.isRequired,
    updateCatalogue: PropTypes.func.isRequired,
  };

  state = {
    catalogueChecked: false,
  };

  componentDidMount = () => {
    const { lastFetched, relaiId } = this.props;
    get(`/api/catalogue_datas/${relaiId}`).then(c => {
      const { catalogue } = c.datas;
      if (!lastFetched || moment(catalogue).isAfter(moment(lastFetched))) {
        this.props.updateCatalogue(relaiId);
      } else {
        this.setState({ catalogueChecked: true });
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.lastFetched === null && nextProps.lastFetched !== null) {
      this.setState({ catalogueChecked: true });
    }
  }

  render() {
    const { catalogueChecked } = this.state;
    if (!catalogueChecked) return null;
    return <div>{this.props.children}</div>;
  }
}

const mapStateToProps = createStructuredSelector({
  lastFetched: selectLastFetched(),
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    loadFournisseurs,
    loadOffres,
    updateCatalogue,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(CatalogueCache);
