import React from "react";

const SelectInput = ({
  label,
  value,
  name,
  onChange,
  options,
  disabled,
  selectsomthingtext,
  isFilter = false,
  required = false,
  disabled=false
}) => {
  return (
    <div className="form-field">
      <label htmlFor="selectinput" className={required ? "required" : ""}>
        {label}
      </label>
      <select
        value={value}
        name={name}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value={isFilter ? "null" : ""}  disabled={!isFilter}>
          {selectsomthingtext ? selectsomthingtext : "Select Something"}
        </option>
        {options.map((option) => (
          <option key={option?.id} value={option?.id}>
            {option?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
