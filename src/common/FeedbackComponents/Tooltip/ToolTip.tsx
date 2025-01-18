import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./ToolTip.css";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const showTooltip = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width + 10,
    });
    setIsHovered(true);
  };

  const hideTooltip = () => setIsHovered(false);

  return (
    <>
      <div
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {isHovered &&
        ReactDOM.createPortal(
          <div
            className="tooltiptext"
            style={{
              position: "absolute",
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {text}
          </div>,
          document.body // Render outside the sidebar
        )}
    </>
  );
};

export default Tooltip;
