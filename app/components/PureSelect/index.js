import React from 'react';
import PropTypes from 'prop-types';

const PureSelect = ({ input, label, cols, datas, meta: { touched, error } }) =>
  <div className={cols ? `col-sm-${cols}` : null}>
    <label htmlFor={label}>{label}</label>
    <div className="form-group">
      <select {...input} className="form-control">
        {Object.keys(datas).map(key => <option key={key} value={key}>{datas[key]}</option>)}
      </select>
      {touched && error && <div className="text-danger">{error}</div>}
    </div>
  </div>;

PureSelect.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
  cols: PropTypes.string,
  datas: PropTypes.object.isRequired,
};

export default PureSelect;
