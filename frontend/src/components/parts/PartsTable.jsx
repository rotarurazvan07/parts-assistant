import React from 'react';
import Checkbox from '../ui/Checkbox';

const PartsTable = ({ parts, onEdit, onDelete, onToggleContext }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-panel border border-border">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-4 text-left">Context</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Part Number</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Bin</th>
            <th className="py-2 px-4 text-left">Quantity</th>
            <th className="py-2 px-4 text-left">Manufacturer</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts && parts.map((part) => (
            <tr key={part.id} className="border-b border-border hover:bg-hover">
              <td className="py-2 px-4">
                <Checkbox 
                  checked={part.inContext || false}
                  onChange={(e) => onToggleContext(part.id, e.target.checked)}
                />
              </td>
              <td className="py-2 px-4">{part.name}</td>
              <td className="py-2 px-4">{part.part_number}</td>
              <td className="py-2 px-4">{part.category || 'N/A'}</td>
              <td className="py-2 px-4">{part.bin || 'N/A'}</td>
              <td className="py-2 px-4">{part.quantity}</td>
              <td className="py-2 px-4">{part.manufacturer || 'N/A'}</td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <button 
                    className="text-text-primary hover:text-primary"
                    onClick={() => onEdit(part)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(part.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartsTable;