import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../src/components/Input';

describe('Input Component', () => {
  it('should render input field', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} placeholder="test-input" />);

    const input = screen.getByPlaceholderText('test-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="disabled-input" />);
    expect(screen.getByPlaceholderText('disabled-input')).toBeDisabled();
  });

  it('should show error state', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should support different input types', () => {
    const { rerender, container } = render(<Input type="text" placeholder="type-test" />);
    expect(screen.getByPlaceholderText('type-test')).toHaveAttribute('type', 'text');

    rerender(<Input type="password" placeholder="type-test" />);
    // Password inputs don't have textbox role, so query by placeholder
    expect(screen.getByPlaceholderText('type-test')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="type-test" />);
    expect(screen.getByPlaceholderText('type-test')).toHaveAttribute('type', 'email');
  });

  it('should show required indicator', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" placeholder="custom-class-input" />);
    expect(screen.getByPlaceholderText('custom-class-input')).toHaveClass('custom-input');
  });

  it('should render with helper text', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} placeholder="maxlength-input" />);
    expect(screen.getByPlaceholderText('maxlength-input')).toHaveAttribute('maxLength', '10');
  });
});
