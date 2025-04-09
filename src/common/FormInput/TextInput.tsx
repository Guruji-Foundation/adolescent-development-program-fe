import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./TextInput.css";

interface TextInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  type?: string;
  isTextArea?: boolean;
  rows?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  isTextArea = false,
  rows = 2,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-field">
      <label htmlFor={name} className={required ? "required" : ""}>
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          style={{width:"100%"}}
        />
      ) : (
        <div className="input-with-icon">
          <input
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          />
          {type === "password" && (
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInput;
