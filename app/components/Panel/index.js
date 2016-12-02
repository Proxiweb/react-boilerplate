import React, { PropTypes, Component } from 'react';

class Panel extends Component { // eslint-disable-line
  static propTypes = {
    children: PropTypes.object.isRequired,
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const palette = this.context.muiTheme.palette;
    const style = {
      backgroundColor: palette.groupColor,
      border: `solid 1px ${palette.groupColorBorder}`,
      padding: 10,
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.2em',
    };
    return <div {...this.props} style={style}>{this.props.children}</div>;
  }
}

export default Panel;
