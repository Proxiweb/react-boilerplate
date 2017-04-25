import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styles from './styles.css';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { selectCommandeId } from 'containers/Commande/selectors';

class NewCommandeButton extends Component {
  static propTypes = {
    commandeId: PropTypes.string,
    action: PropTypes.string,
  };

  render() {
    const { commandeId, action } = this.props;

    if (!commandeId || !action) return null;

    return (
      <div style={{ textAlign: 'center' }}>
        <FloatingActionButton
          primary
          className={styles.addButton}
          onClick={this.newCommande}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  commandeId: selectCommandeId(),
});

export default connect(mapStateToProps)(NewCommandeButton);
