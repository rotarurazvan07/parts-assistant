import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartModal from '../components/modals/PartModal';

// Mock the useParts hook
jest.mock('../hooks/useParts', () => ({
  useParts: () => ({
    data: {
      parts: [],
      total: 0
    },
    isLoading: false,
    isError: false
  })
}));

describe('PartModal Component', () => {
  test('renders part modal with form fields', () => {
    const mockOnSave = jest.fn();
    const mockOnDelete = jest.fn();
    const mockCategories = [];
    const mockBins = [];
    
    render(
      <PartModal
        isOpen={true}
        onClose={jest.fn()}
        part={null}
        categories={mockCategories}
        bins={mockBins}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );
    
    // Check if the modal renders by looking for key elements
    expect(screen.getByText('Part Name')).toBeInTheDocument();
  });

  test('handles form submission', () => {
    const mockOnSave = jest.fn();
    const mockOnDelete = jest.fn();
    const mockCategories = [];
    const mockBins = [];
    
    render(
      <PartModal
        isOpen={true}
        onClose={jest.fn()}
        part={null}
        categories={mockCategories}
        bins={mockBins}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
      />
    );
    
    // You would add more specific tests here
  });
});