import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartsManagement from '../components/parts/PartsManagement';

// Mock the React Query hooks
jest.mock('../hooks/useParts', () => ({
  useParts: () => ({
    data: {
      parts: [
        { id: 1, name: 'Test Part', quantity: 10 }
      ],
      total: 1
    },
    isLoading: false,
    isError: false
  }),
  useCreatePart: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useUpdatePart: jest.fn(() => ({
    mutate: jest.fn()
  })),
  useDeletePart: jest.fn(() => ({
    mutate: jest.fn()
  }))
}));

jest.mock('../hooks/useCategories', () => ({
  useCategories: () => ({
    data: [
      { id: 1, name: 'Resistors' }
    ],
    isLoading: false,
    isError: false
  })
}));

jest.mock('../hooks/useBins', () => ({
  useBins: () => ({
    data: [
      { id: 1, name: 'Resistor Drawer' }
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

describe('PartsManagement Component', () => {
  test('renders parts management interface', () => {
    render(<PartsManagement />);
    
    // Check if the main components are rendered
    expect(screen.getByText('Add Part')).toBeInTheDocument();
  });
});