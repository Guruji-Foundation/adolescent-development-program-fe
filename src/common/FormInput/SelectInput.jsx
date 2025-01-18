import React from "react";

const SelectInput = ({ label, value, options, onChange, placeholder }) => {
  return (
    <div className="select-input">
      <select 
        value={value} 
        onChange={onChange}
        style={{ width: '100%' }}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
