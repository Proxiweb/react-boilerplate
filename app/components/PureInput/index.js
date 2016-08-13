import React, { PropTypes } from 'react';

const PureInput = ({ input, label, cols, type, className, placeholder, meta: { touched, error } }) => {
  const inLabel = type === 'checkbox' || type === 'radio';
  return (
    <div className={cols ? `col-sm-${cols}` : null}>
      <div className="form-group">
        {label && !inLabel && (<label>{label}</label>)}
        {inLabel && <label><input {...input} placeholder={placeholder} type={type} className={className || 'form-control'} />{label}</label>}
        {!inLabel && <input {...input} placeholder={placeholder} type={type} className={className || 'form-control'} />}
        {touched && error && <div className="text-danger">{error}</div>}
      </div>
    </div>
  );
};

PureInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string,
  cols: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};


export default PureInput;
