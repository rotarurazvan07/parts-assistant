import React, { useState, useEffect } from 'react';
import { useParts, useCategories, useBins, useCreatePart, useUpdatePart, useDeletePart } from '../../hooks';
import SearchArea from './SearchArea';
import StatsBar from './StatsBar';
import PartsTable from './PartsTable';
import TablePagination from './TablePagination';
import PartModal from '../modals/PartModal';

const PartsManagement = () => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State for modals
  const [showPartModal, setShowPartModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  
  // State for context parts (AI context)
  const [contextParts, setContextParts] = useState([]);
  
  // Fetch parts data
  const { data: partsData, isLoading: partsLoading, isError: partsError } = useParts({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm
  });
  
  // Fetch categories data
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  
  // Fetch bins data
  const { data: binsData, isLoading: binsLoading, isError: binsError } = useBins();
  
  // Mutation hooks for CRUD operations
  const { mutate: createPart } = useCreatePart();
  const { mutate: updatePart } = useUpdatePart();
  const { mutate: deletePart } = useDeletePart();
  
  // Calculate total parts and in-context parts
  const totalParts = partsData?.total || 0;
  const inContextParts = contextParts.length;
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle add part
  const handleAddPart = () => {
    setSelectedPart(null);
    setShowPartModal(true);
  };
  
  // Handle edit part
  const handleEditPart = (part) => {
    setSelectedPart(part);
    setShowPartModal(true);
  };
  
  // Handle delete part
  const handleDeletePart = (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      deletePart(id);
    }
  };
  
  // Handle save part (create or update)
  const handleSavePart = (partData) => {
    if (selectedPart) {
      // Update existing part
      updatePart({ id: selectedPart.id, data: partData });
    } else {
      // Create new part
      createPart(partData);
    }
    setShowPartModal(false);
  };
  
  // Handle toggle context for AI
  const handleToggleContext = (partId, checked) => {
    if (checked) {
      setContextParts(prev => [...prev, partId]);
    } else {
      setContextParts(prev => prev.filter(id => id !== partId));
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };
  
  // Error handling
  if (partsError || categoriesError || binsError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Data</h2>
          <p className="text-text-muted">Failed to load parts data. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (partsLoading || categoriesLoading || binsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-muted">Loading parts data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Search Area */}
      <SearchArea 
        onSearch={handleSearch} 
        onAddPart={handleAddPart} 
      />
      
      {/* Stats Bar */}
      <StatsBar 
        totalParts={totalParts} 
        inContextParts={inContextParts} 
      />
      
      {/* Parts Table */}
      <div className="flex-1 overflow-y-auto">
        <PartsTable 
          parts={partsData?.parts || []}
          categories={categoriesData || []}
          bins={binsData || []}
          onEdit={handleEditPart}
          onDelete={handleDeletePart}
          onToggleContext={handleToggleContext}
        />
      </div>
      
      {/* Pagination Controls */}
      <TablePagination 
        currentPage={currentPage}
        totalPages={Math.ceil(totalParts / itemsPerPage)}
        totalItems={totalParts}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      {/* Part Modal */}
      {showPartModal && (
        <PartModal
          isOpen={showPartModal}
          onClose={() => setShowPartModal(false)}
          part={selectedPart}
          categories={categoriesData || []}
          bins={binsData || []}
          onSave={handleSavePart}
          onDelete={handleDeletePart}
        />
      )}
    </div>
  );
};

export default PartsManagement;