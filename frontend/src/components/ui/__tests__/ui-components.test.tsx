/**
 * Unit tests for UI components
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-6');
  });
});

describe('Card Component', () => {
  it('renders with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Test Card">Content</Card>);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders footer when provided', () => {
    render(
      <Card footer={<div>Footer content</div>}>
        Card body
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input label="Test" onChange={handleChange} />);
    const input = screen.getByLabelText('Test');
    
    await user.type(input, 'hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<Input label="Test" error="Invalid input" />);
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Input label="Test" disabled />);
    expect(screen.getByLabelText('Test')).toBeDisabled();
  });

  it('supports different types', () => {
    render(<Input label="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });
});
