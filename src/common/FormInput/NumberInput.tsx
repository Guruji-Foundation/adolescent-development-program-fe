import React from "react";

interface NumberInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label htmlFor={name} className={required ? "required" : ""}>
        {label}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default NumberInput;
