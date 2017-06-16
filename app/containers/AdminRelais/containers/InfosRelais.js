import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { isPristine, change } from 'redux-form';
import RelaisForm from 'containers/AdminRelais/components/RelaisForm';
import { makeSelectPending } from 'containers/App/selectors';
import { saveRelais } from 'containers/AdminRelais/actions';

const isProfilePristine = () => state => isPristine('profile')(state);

class InfosRelais extends Component {
  // eslint-disable-line
  static propTypes = {
    changeValue: PropTypes.func.isRequired,
    relais: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
  };

  handleSubmit = values => {
    this.props.save(values);
  };

  render() {
    const { relais, pending, pristine, changeValue } = this.props;
    return (
      <div className="row">
        <RelaisForm
          changePresentation={val => changeValue('relais', 'presentation', val)}
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
  pending: makeSelectPending(),
  pristine: isProfilePristine(),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeValue: change,
      save: saveRelais,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InfosRelais);
