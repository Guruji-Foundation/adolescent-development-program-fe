import React from "react";
import "./ToolTip.css"; // Update this CSS file for tooltip styles

const Tooltip = ({ children, text, hide = false }) => {
  return (
    <div className="tooltip">
      {children}
      {!hide && <span className="tooltiptext">{text}</span>}
    </div>
  );
};

export default Tooltip;
