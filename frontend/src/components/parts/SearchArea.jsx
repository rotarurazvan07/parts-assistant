import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const SearchArea = ({ onSearch, onAddPart }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search parts..."
            className="input-field pl-10 pr-4 py-2 w-64"
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute left-3 top-2.5">
            <Icon name="search" size="sm" />
          </div>
        </div>
      </div>
      <Button onClick={onAddPart} className="flex items-center">
        <Icon name="add" size="sm" className="mr-1" />
        Add Part
      </Button>
    </div>
  );
};

export default SearchArea;