import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  isPristine,
  change,
} from 'redux-form';
import RelaisForm from 'containers/AdminRelais/components/RelaisForm';
import { selectPending } from 'containers/App/selectors';
import { saveRelais } from 'containers/AdminRelais/actions';

const isProfilePristine = () => (state) => isPristine('profile')(state);

class InfosRelais extends Component { // eslint-disable-line
  static propTypes = {
    changeValue: PropTypes.func.isRequired,
    relais: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
  }

  handleSubmit = (values) => {
    this.props.save(values);
  }

  render() {
    const { relais, pending, pristine, changeValue } = this.props;
    return (
      <div className="row">
        <RelaisForm
          changePresentation={(val) => changeValue('relais', 'presentation', val)}
          initialValues={relais}
          onSubmit={this.handleSubmit}
          pending={pending}
          pristine={pristine}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  pending: selectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = (dispatch) => ({
  changeValue: (form, field, val) => dispatch(change(form, field, val)),
  save: (relais) => dispatch(saveRelais(relais)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfosRelais);