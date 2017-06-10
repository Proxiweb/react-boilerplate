import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";

const styles = {
  underlineStyle: { borderColor: "gray" },
  floatingLabelStyle: { color: "gray" },
  iconStyle: { fill: "gray" }
};

const CustomSelectField = ({ children, ...props }) =>
  <SelectField
    underlineStyle={styles.underlineStyle}
    floatingLabelStyle={styles.floatingLabelStyle}
    iconStyle={styles.iconStyle}
    {...props}
  >
    {children}
  </SelectField>;

CustomSelectField.propTypes = {
  children: PropTypes.any
};

export default CustomSelectField;
