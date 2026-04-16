import React, { useState } from 'react';
import { useBins, useCreateBin, useUpdateBin, useDeleteBin } from '../../hooks';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const BinsList = ({ onAddBin }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const [editingBin, setEditingBin] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, name: '' });

  // Fetch bins data with React Query
  const { data: binsData, isLoading, isError } = useBins();
  const { mutate: createBin } = useCreateBin();
  const { mutate: updateBin } = useUpdateBin();
  const { mutate: deleteBin } = useDeleteBin();

  // Handle add bin
  const handleAddBin = () => {
    setShowAddForm(true);
    if (onAddBin) {
      onAddBin();
    }
  };

  // Handle save new bin
  const handleSaveNewBin = () => {
    if (newBinName.trim()) {
      createBin({ name: newBinName.trim() });
      setNewBinName('');
      setShowAddForm(false);
    }
  };

  // Handle edit bin
  const handleEditBin = (bin) => {
    setEditForm({ id: bin.id, name: bin.name });
    setEditingBin(bin.id);
  };

  // Handle save edited bin
  const handleSaveEditedBin = () => {
    if (editForm.name.trim() && editingBin) {
      updateBin({ id: editForm.id, data: { name: editForm.name } });
      setEditForm({ id: null, name: '' });
      setEditingBin(null);
    }
  };

  // Handle delete bin
  const handleDeleteBin = (binId) => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      deleteBin(binId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pt-2">
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pt-2">
        <div className="text-destructive text-center py-4">
          Error loading bins
        </div>
      </div>
    );
  }

  return (
    <div className="pb-2">
      {/* Add Bin Form */}
      {showAddForm && (
        <div className="mb-3 p-2 border border-border rounded bg-background">
          <div className="flex">
            <input
              type="text"
              value={newBinName}
              onChange={(e) => setNewBinName(e.target.value)}
              placeholder="Bin name"
              className="input-field flex-1 mr-1 text-xs py-1"
              autoFocus
            />
            <Button onClick={handleSaveNewBin} size="xs" className="px-2 py-1">
              Add
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              size="xs"
              variant="ghost"
              className="px-2 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Edit Bin Form */}
      {editingBin && (
        <div className="mb-3 p-2 border border-border rounded bg-background">
          <div className="flex">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Bin name"
              className="input-field flex-1 mr-1 text-xs py-1"
              autoFocus
            />
            <Button onClick={handleSaveEditedBin} size="xs" className="px-2 py-1">
              Save
            </Button>
            <Button
              onClick={() => setEditingBin(null)}
              size="xs"
              variant="ghost"
              className="px-2 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        {binsData && binsData.map(bin => (
          <div key={bin.id} className="flex items-center justify-between py-1.5 px-2 border border-border rounded hover:bg-border group">
            <span className="font-medium truncate text-sm flex-1 min-w-0">{bin.name}</span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="text-xs text-text-primary hover:text-primary p-0.5"
                onClick={() => handleEditBin(bin)}
                title="Edit"
              >
                <Icon name="edit" size="xs" />
              </button>
              <button
                className="text-xs text-destructive hover:text-destructive p-0.5"
                onClick={() => handleDeleteBin(bin.id)}
                title="Delete"
              >
                <Icon name="delete" size="xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinsList;