import React from 'react';
import { useNavigationContext } from '@context/NavigationContext';

const TopBar = () => {
  const { activeTab, setActiveTab } = useNavigationContext();

  // Define pages for navigation
  const pages = [
    { id: 'inventory', label: 'Inventory' },
    // Add more pages here as needed
  ];

  return (
    <div className="h-14 bg-panel border-b border-border flex items-center px-4">
      {/* Logo/Title */}
      <div className="text-xl font-heading font-bold text-primary mr-8">
        Parts Assistant
      </div>

      {/* Page Navigation */}
      <nav className="flex space-x-1">
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActiveTab(page.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === page.id
                ? 'bg-primary text-white'
                : 'text-text-primary hover:bg-border'
            }`}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TopBar;
