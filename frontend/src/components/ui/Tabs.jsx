import React, { useState } from 'react';

const Tabs = ({ children, activeTab, setActiveTab }) => {
  const [tabs, setTabs] = useState(React.Children.map(children, (child, index) => ({
    id: index,
    label: child.props.label,
    content: child.props.children
  })));
  
  // Generate unique IDs for accessibility
  const tabsId = `tabs-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      <div 
        className="flex border-b border-border" 
        role="tablist" 
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-mono text-sm ${
              activeTab === tab.id 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-text-muted hover:text-text-primary'
            }`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tabsId}-panel-${tab.id}`}
            id={`${tabsId}-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={activeTab === tab.id ? 'block' : 'hidden'}
            role="tabpanel"
            id={`${tabsId}-panel-${tab.id}`}
            aria-labelledby={`${tabsId}-tab-${tab.id}`}
            tabIndex="0"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <div>{children}</div>;
};

Tabs.Tab = Tab;

export default Tabs;