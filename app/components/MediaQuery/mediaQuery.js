/* eslint-disable */
import { PropTypes } from 'react';

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

// properties that match media queries
const matchers = {
  orientation: PropTypes.oneOf(['portrait', 'landscape']),

  scan: PropTypes.oneOf(['progressive', 'interlace']),

  aspectRatio: PropTypes.string,
  deviceAspectRatio: PropTypes.string,

  height: stringOrNumber,
  deviceHeight: stringOrNumber,

  width: stringOrNumber,
  deviceWidth: stringOrNumber,

  color: PropTypes.bool,

  colorIndex: PropTypes.bool,

  monochrome: PropTypes.bool,
  resolution: stringOrNumber,
};

// media features
const features = {
  minAspectRatio: PropTypes.string,
  maxAspectRatio: PropTypes.string,
  minDeviceAspectRatio: PropTypes.string,
  maxDeviceAspectRatio: PropTypes.string,

  minHeight: stringOrNumber,
  maxHeight: stringOrNumber,
  minDeviceHeight: stringOrNumber,
  maxDeviceHeight: stringOrNumber,

  minWidth: stringOrNumber,
  maxWidth: stringOrNumber,
  minDeviceWidth: stringOrNumber,
  maxDeviceWidth: stringOrNumber,

  minColor: PropTypes.number,
  maxColor: PropTypes.number,

  minColorIndex: PropTypes.number,
  maxColorIndex: PropTypes.number,

  minMonochrome: PropTypes.number,
  maxMonochrome: PropTypes.number,

  minResolution: stringOrNumber,
  maxResolution: stringOrNumber,

  ...matchers,
};

// media types
const types = {
  all: PropTypes.bool,
  grid: PropTypes.bool,
  aural: PropTypes.bool,
  braille: PropTypes.bool,
  handheld: PropTypes.bool,
  print: PropTypes.bool,
  projection: PropTypes.bool,
  screen: PropTypes.bool,
  tty: PropTypes.bool,
  tv: PropTypes.bool,
  embossed: PropTypes.bool,
};

const all = { ...types, ...features };

// add the type property
matchers.type = Object.keys(types);

export default {
  all: all,
  types: types,
  matchers: matchers,
  features: features,
};

/* eslint-enable */
