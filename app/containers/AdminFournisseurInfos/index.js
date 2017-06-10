import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine, change } from 'redux-form';
import Paper from 'material-ui/Paper';

import { selectPending } from 'containers/App/selectors';

import { selectFournisseursIds } from 'containers/Commande/selectors';
import { loadFournisseurs } from 'containers/Commande/actions';

import InfosFormContainer from './containers/InfosFormContainer';
const options = {
  options: ['inline', 'list', 'textAlign', 'link', 'remove', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  list: {
    inDropdown: false,
    className: undefined,
    options: ['unordered', 'ordered'],
  },
};

import classnames from 'classnames';
import styles from './styles.css';

class InfosFournisseur extends Component {
  static propTypes = {
    fournisseurs: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };
  componentDidMount() {
    const { fournisseurs, params: { fournisseurId } } = this.props;
    if (!fournisseurs || !fournisseurs[fournisseurId]) {
      this.props.loadFournisseurs({ id: fournisseurId, jointures: true });
    }
  }

  render() {
    const { fournisseurs, params: { fournisseurId } } = this.props;
    return (
      <div className="row center-md">
        <div className="col-md-8">
          <Paper>
            {fournisseurs &&
              fournisseurs[fournisseurId] &&
              <InfosFormContainer params={this.props.params} fournisseur={fournisseurs[fournisseurId]} />}
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  fournisseurs: selectFournisseursIds(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadFournisseurs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InfosFournisseur);
