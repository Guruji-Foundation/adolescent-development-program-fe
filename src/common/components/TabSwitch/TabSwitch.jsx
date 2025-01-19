import React from "react";
import "./TabSwitch.css";

const TabSwitch = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tab-switch">
      <div className="tab-switch__container" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-switch__button ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.icon && <span className="tab-switch__icon">{tab.icon}</span>}
            <span className="tab-switch__label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabSwitch;
