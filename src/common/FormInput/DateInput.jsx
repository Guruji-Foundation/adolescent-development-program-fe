// DateInput.js
import React from "react";
import PropTypes from "prop-types";
const DateInput = ({
  name,
  label,
  value,
  onChange,
  min,
  max,
  required,
  className,
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={name} className={required ? "required" : ""}>
        {label}
      </label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
      />
    </div>
  );
};

// Setting default props
DateInput.defaultProps = {
  value: "",
  required: false,
  className: "",
};

// Prop types for better type-checking
DateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default DateInput;
