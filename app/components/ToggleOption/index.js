/**
*
* ToggleOption
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

const ToggleOption = ({ value, message, intl }) =>
  <option value={value}>
    {intl.formatMessage(message)}
  </option>;

ToggleOption.propTypes = {
  value: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ToggleOption);
