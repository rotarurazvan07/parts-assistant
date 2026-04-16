import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const SidebarFooter = ({ onImportExport, onSettings }) => {
  return (
    <div className="border-t border-border p-3 mt-auto bg-panel">
      <div className="flex flex-col space-y-2">
        <Button
          onClick={onImportExport}
          variant="secondary"
          className="w-full flex items-center justify-center py-2"
        >
          <Icon name="import" size="sm" className="mr-2" />
          Import/Export
        </Button>
        <Button
          onClick={onSettings}
          variant="secondary"
          className="w-full flex items-center justify-center py-2"
        >
          <Icon name="settings" size="sm" className="mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;