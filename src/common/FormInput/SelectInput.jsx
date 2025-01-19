import React from "react";
import "./SelectInput.css";

const SelectInput = ({
  label,
  value,
  options,
  onChange,
  selectsomthingtext,
  name,
  required,
  disabled,
  className,
  labelClassName,
}) => {
  return (
    <div className={`form-group ${className || ""}`}>
      <label className={`form-label ${labelClassName || ""}`}>
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
        className="select-field"
      >
        <option value="">{selectsomthingtext || "Select"}</option>
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
