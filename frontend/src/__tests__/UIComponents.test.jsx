import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import Button from '../components/ui/Button';

describe('UI Components', () => {
  test('InputField renders correctly', () => {
    render(
      <InputField
        label="Test Input"
        value=""
        onChange={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Input')).toBeInTheDocument();
  });

  test('SelectField renders correctly', () => {
    render(
      <SelectField
        label="Test Select"
        value=""
        onChange={jest.fn()}
        options={[{ value: 'option1', label: 'Option 1' }]}
      />
    );
    
    expect(screen.getByText('Test Select')).toBeInTheDocument();
  });

  test('Button renders correctly and handles click', () => {
    const handleClick = jest.fn();
    
    render(
      <Button onClick={handleClick}>
        Click Me
      </Button>
    );
    
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});