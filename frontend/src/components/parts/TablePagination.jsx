import React from 'react';
import Button from '../ui/Button';

const TablePagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-text-muted">
        Showing {totalItems} parts
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;