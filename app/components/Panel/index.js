import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Panel extends Component {
  // eslint-disable-line
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    padding: PropTypes.number.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    padding: 10,
  };

  render() {
    const palette = this.context.muiTheme.palette;
    const style = {
      backgroundColor: palette.groupColor,
      border: `solid 1px ${palette.groupColorBorder}`,
      padding: this.props.padding,
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.2em',
    };
    return <div style={style}>{this.props.children}</div>; // {...this.props}
  }
}

export default Panel;
