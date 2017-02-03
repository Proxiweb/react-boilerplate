import React, { PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isPristine } from 'redux-form';
import round from 'lodash/round';

import { saveOffre } from 'containers/Commande/actions';
import { selectPending } from 'containers/App/selectors';
import OffreForm from './OffreForm';

const isProfilePristine = () => (state) => isPristine('offre')(state);
const selectValeurs = () => (state) => state.form;

// import submit from './submit';

class OffreFormContainer extends React.Component {
  static propTypes = {
    offre: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    valeurs: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    handleToggeState: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    const { save, offre } = this.props;
    const tarifications = values.tarifications.map((t) => ({
      ...t,
      prix: parseInt(t.prix * 100, 10),
      recolteFond: parseInt(t.recolteFond * 100, 10),
    }));
    save({
      ...offre,
      tarifications,
      poids: values.poids ? parseInt(values.poids, 10) : null,
    });
  }

  render() {
    const {
      pending,
      offre,
      pristine,
      handleToggeState,
      valeurs,
    } = this.props;
    const tarifications = offre.tarifications.map((t) => ({
      ...t,
      prix: round(t.prix / 100, 2),
      recolteFond: round(t.recolteFond / 100, 2),
    }));
    return (
      <OffreForm
        initialValues={{ ...offre, tarifications }}
        onSubmit={this.handleSubmit}
        pending={pending}
        pristine={pristine}
        valeurs={valeurs}
        handleToggeState={handleToggeState}
      />
      );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isProfilePristine(),
  valeurs: selectValeurs(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  save: saveOffre,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffreFormContainer);
