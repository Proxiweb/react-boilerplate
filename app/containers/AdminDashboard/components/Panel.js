import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import styles from './styles.css';

const Panel = ({ title, children }) => (
  <Paper className={styles.panel}>
    <div className={`dragHandle ${styles.title}`}>
      {title}
    </div>
    <div className={styles.content}>
      {children}
    </div>
  </Paper>
);

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Panel;
