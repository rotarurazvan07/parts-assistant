import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImportExportModal from '../components/modals/ImportExportModal';

describe('ImportExportModal Component', () => {
  test('renders import/export modal', () => {
    const mockOnImport = jest.fn();
    const mockOnExport = jest.fn();
    
    render(
      <ImportExportModal
        isOpen={true}
        onClose={jest.fn()}
        onImport={mockOnImport}
        onExport={mockOnExport}
      />
    );
    
    // Check if the modal renders
    expect(screen.getByText('Import/Export')).toBeInTheDocument();
  });
});