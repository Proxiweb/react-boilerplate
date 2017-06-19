import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomSelectField from 'components/CustomSelectField';
import MenuItem from 'material-ui/MenuItem';

import { createStructuredSelector } from 'reselect';
import { loadFournisseurs } from 'containers/Commande/actions';

import { makeSelectFournisseurs } from 'containers/Commande/selectors';

class ListeFournisseursRelais extends Component {
  static propTypes = {
    fournisseurs: PropTypes.object,
    fournisseurId: PropTypes.string,
    relaiId: PropTypes.string.isRequired,
    loadFournisseurs: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.loadFournisseurs({ relaiId: this.props.relaiId });
  }

  render() {
    const { fournisseurs, fournisseurId, onChange } = this.props;
    return (
      <CustomSelectField
        fullWidth
        value={fournisseurId}
        onChange={onChange}
        floatingLabelText="Fournisseur"
        hintText="Sélectionnez un fournisseur"
      >
        {fournisseurs.map((data, idx) =>
          (<MenuItem
            key={idx}
            value={data.id}
            primaryText={data.nom.toUpperCase()}
          />)
        )}
      </CustomSelectField>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  fournisseurs: makeSelectFournisseurs(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadFournisseurs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(
  ListeFournisseursRelais
);
