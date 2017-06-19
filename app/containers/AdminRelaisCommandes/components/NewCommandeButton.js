import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.css';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { makeSelectCommandeId } from 'containers/Commande/selectors';
import { makeSelectRoute } from 'containers/App/selectors';

class NewCommandeButton extends Component {
  static propTypes = {
    relaiId: PropTypes.string.isRequired,
  };

  handleNewCommande = () => {
    this.props.pushState(
      `/admin/relais/${this.props.relaiId}/commandes/nouvelle`
    );
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <FloatingActionButton
          primary
          className={styles.addButton}
          onClick={this.handleNewCommande}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushState: push,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(NewCommandeButton);
