// Button.tsx
import React from "react";
import "../../CSS/Main.css";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button type={type} className={`${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
