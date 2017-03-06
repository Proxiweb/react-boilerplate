import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
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
    params: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="row center-md">
        <div className="col-md-8">
          <Paper>
            <InfosFormContainer params={this.props.params} />
          </Paper>
        </div>
      </div>
    );
  }
}

export default InfosFournisseur;
