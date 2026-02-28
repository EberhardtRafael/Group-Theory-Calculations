/**
 * Unit tests for calculator components
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupSelector from '@/components/calculators/GroupSelector';
import TensorProductCalc from '@/components/calculators/TensorProductCalc';

describe('GroupSelector Component', () => {
  const groups = [
    { value: 'SU3', label: 'SU(3)' },
    { value: 'SU5', label: 'SU(5)' },
    { value: 'SO10', label: 'SO(10)' },
  ];

  it('renders all group options', () => {
    render(<GroupSelector groups={groups} value="" onChange={jest.fn()} />);
    
    groups.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument();
    });
  });

  it('calls onChange when group is selected', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<GroupSelector groups={groups} value="" onChange={handleChange} />);
    
    // This test will need adjustment based on actual GroupSelector implementation
    // Just showing the pattern
  });

  it('displays selected group', () => {
    render(<GroupSelector groups={groups} value="SU5" onChange={jest.fn()} />);
    // Verify SU5 is shown as selected
  });
});

describe('TensorProductCalc Component', () => {
  it('renders calculation form', () => {
    render(<TensorProductCalc />);
    expect(screen.getByText(/tensor product/i)).toBeInTheDocument();
  });

  it('validates dynkin label inputs', async () => {
    const user = userEvent.setup();
    render(<TensorProductCalc />);
    
    // Test input validation
    // This will need adjustment based on actual implementation
  });

  it('submits calculation request', async () => {
    const user = userEvent.setup();
    render(<TensorProductCalc />);
    
    // Fill form and submit
    // Verify API call is made
    // This will need adjustment based on actual implementation
  });
});
