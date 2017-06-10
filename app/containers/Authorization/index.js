import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import includes from "lodash/includes";
import { createStructuredSelector } from "reselect";
import { selectRoles } from "containers/CompteUtilisateur/selectors";

const mapStateToProps = createStructuredSelector({
  roles: selectRoles()
});

const Authorization = (WrappedComponent, allowedRoles) =>
  connect(mapStateToProps)(
    class withAuthorization extends Component {
      // eslint-disable-line
      static propTypes = {
        roles: PropTypes.array.isRequired
      };
      render() {
        const { roles } = this.props;
        const granted = roles.reduce((m, r) => (includes(allowedRoles, r) ? true : m), false);
        if (granted) {
          return <WrappedComponent {...this.props} />;
        }
        return <h1>Non autorisé !</h1>;
      }
    }
  );

export default Authorization;
