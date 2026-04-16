import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BinsList from '../components/layout/BinsList';

// Mock the hooks
jest.mock('../hooks/useBins', () => ({
  useBins: () => ({
    data: [
      { id: 1, name: 'Resistor Drawer' },
      { id: 2, name: 'Capacitor Box' }
    ],
    isLoading: false,
    isError: false
  }),
  useCreateBin: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useUpdateBin: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useDeleteBin: jest.fn(() => ({
    mutate: jest.fn()
  }))
}));

describe('BinsList Component', () => {
  test('renders bins list with bins', () => {
    render(<BinsList />);
    
    expect(screen.getByText('Bins')).toBeInTheDocument();
    expect(screen.getByText('Resistor Drawer')).toBeInTheDocument();
    expect(screen.getByText('Capacitor Box')).toBeInTheDocument();
  });

  test('handles add bin form', () => {
    render(<BinsList />);
    
    // Click the add button to show the form
    const addButton = screen.getByRole('button', { name: '➕' });
    fireEvent.click(addButton);
    
    // Check if the form is visible
    expect(screen.getByPlaceholderText('Bin Name')).toBeInTheDocument();
  });
});