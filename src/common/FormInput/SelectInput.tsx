import React from "react";

interface SelectInputProps {
  label: string;
  value: number | any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[];
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label htmlFor="selectinput" className={required ? "required" : ""}>
        {label}
      </label>
      <select value={value} onChange={onChange} required={required}>
        <option value="" disabled>
          Select Something
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
