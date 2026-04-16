import React, { useState } from 'react';
import { useAppContext } from '@context/AppContext';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import CategoryTree from './CategoryTree';
import BinsList from './BinsList';
import SidebarFooter from './SidebarFooter';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [binsExpanded, setBinsExpanded] = useState(true);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  if (sidebarCollapsed) {
    // Icon-only collapsed state
    return (
      <div className="flex bg-panel h-full flex-col items-center py-2 border-r border-border" style={{ width: '64px' }}>
        {/* Toggle Button */}
        <Button
          onClick={() => setSidebarCollapsed(false)}
          size="sm"
          variant="ghost"
          className="p-2 mb-4"
          ariaLabel="Expand sidebar"
        >
          <Icon name="chevron-right" size="md" />
        </Button>

        {/* Section Icons */}
        <div className="flex flex-col space-y-2 flex-1">
          {/* Categories Icon */}
          <Button
            onClick={() => {
              setSidebarCollapsed(false);
              setCategoriesExpanded(true);
            }}
            size="sm"
            variant="ghost"
            className="p-2"
            ariaLabel="Categories"
            title="Categories"
          >
            <Icon name="categories" size="md" />
          </Button>

          {/* Bins Icon */}
          <Button
            onClick={() => {
              setSidebarCollapsed(false);
              setBinsExpanded(true);
            }}
            size="sm"
            variant="ghost"
            className="p-2"
            ariaLabel="Bins"
            title="Bins"
          >
            <Icon name="bins" size="md" />
          </Button>
        </div>

        {/* Footer Icons */}
        <div className="flex flex-col space-y-2 mt-auto">
          <Button
            onClick={() => console.log('Import/Export')}
            size="sm"
            variant="ghost"
            className="p-2"
            ariaLabel="Import/Export"
            title="Import/Export"
          >
            <Icon name="import" size="md" />
          </Button>
          <Button
            onClick={() => console.log('Settings')}
            size="sm"
            variant="ghost"
            className="p-2"
            ariaLabel="Settings"
            title="Settings"
          >
            <Icon name="settings" size="md" />
          </Button>
        </div>
      </div>
    );
  }

  // Full expanded state
  return (
    <div className="flex bg-panel h-full flex-col border-r border-border" style={{ width: '256px' }}>
      {/* Header with Toggle */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="font-heading font-bold text-sm">Menu</span>
        <Button
          onClick={() => setSidebarCollapsed(true)}
          size="sm"
          variant="ghost"
          className="p-1"
          ariaLabel="Collapse sidebar"
        >
          <Icon name="chevron-left" size="sm" />
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories Section */}
        <div className={binsExpanded ? "border-b border-border" : ""}>
          <div
            className="p-2 flex items-center justify-between cursor-pointer hover:bg-border"
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          >
            <div className="flex items-center">
              <div className="w-6 flex justify-center">
                <Icon
                  name={categoriesExpanded ? "chevron-down" : "chevron-right"}
                  size="sm"
                />
              </div>
              <span className="font-heading font-bold text-sm ml-1">Categories</span>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddCategoryModal(true);
              }}
              size="xs"
              variant="ghost"
              className="p-1"
              title="Add category"
            >
              <Icon name="add" size="sm" />
            </Button>
          </div>
          {categoriesExpanded && (
            <div className="bg-background">
              <CategoryTree
                showAddModal={showAddCategoryModal}
                onOpenAddModal={() => setShowAddCategoryModal(true)}
                onCloseAddModal={() => setShowAddCategoryModal(false)}
              />
            </div>
          )}
        </div>

        {/* Bins Section */}
        <div className="border-b border-border">
          <div
            className="p-2 flex items-center cursor-pointer hover:bg-border"
            onClick={() => setBinsExpanded(!binsExpanded)}
          >
            <div className="w-6 flex justify-center">
              <Icon
                name={binsExpanded ? "chevron-down" : "chevron-right"}
                size="sm"
              />
            </div>
            <span className="font-heading font-bold text-sm ml-1">Bins</span>
          </div>
          {binsExpanded && (
            <div className="bg-background">
              <BinsList />
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <SidebarFooter
        onImportExport={() => console.log('Import/Export')}
        onSettings={() => console.log('Settings')}
      />
    </div>
  );
};

export default Sidebar;
