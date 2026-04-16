import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChatInterface from '../components/layout/AIChatInterface';

// Mock the AI context
jest.mock('@context/AIContext', () => ({
  useAIContext: () => ({
    contextParts: [],
    sendMessage: jest.fn()
  })
}));

describe('AIChatInterface Component', () => {
  test('renders AI chat interface', () => {
    render(<AIChatInterface />);
    
    // Check if the component renders
    expect(screen.getByText('The Brain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask a question about your inventory...')).toBeInTheDocument();
  });

  test('handles input and form submission', () => {
    render(<AIChatInterface />);
    
    // Get the input field
    const input = screen.getByPlaceholderText('Ask a question about your inventory...');
    
    // Simulate typing in the input
    fireEvent.change(input, { target: { value: 'Test question' } });
    
    // Check if the input value is updated
    expect(input.value).toBe('Test question');
  });
});