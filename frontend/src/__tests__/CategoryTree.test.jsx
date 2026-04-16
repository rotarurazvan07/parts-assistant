import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryTree from '../components/layout/CategoryTree';

// Mock the hooks
jest.mock('../hooks/useCategories', () => ({
  useCategories: () => ({
    data: [
      { id: 1, name: 'Resistors', subcategories: [] },
      { id: 2, name: 'Capacitors', subcategories: [] }
    ],
    isLoading: false,
    isError: false
  }),
  useCreateCategory: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useUpdateCategory: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useDeleteCategory: jest.fn(() => ({
    mutate: jest.fn()
  }))
}));

describe('CategoryTree Component', () => {
  test('renders category tree with categories', () => {
    render(<CategoryTree />);
    
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Resistors')).toBeInTheDocument();
    expect(screen.getByText('Capacitors')).toBeInTheDocument();
  });

  test('handles add category form', () => {
    render(<CategoryTree />);
    
    // Click the add button to show the form
    const addButton = screen.getByRole('button', { name: '➕' });
    fireEvent.click(addButton);
    
    // Check if the form is visible
    expect(screen.getByPlaceholderText('Category Name')).toBeInTheDocument();
  });
});