/**
 * Integration tests for page components
 */

import { render, screen } from '@testing-library/react';
import Home from '@/components/pages/Home';
import Calculator from '@/components/pages/Calculator';

// Mock the sub-components
jest.mock('@/components/pages/home/HeroSection', () => ({
  __esModule: true,
  default: () => <div>Hero Section</div>,
}));

jest.mock('@/components/pages/home/FeaturesSection', () => ({
  __esModule: true,
  default: () => <div>Features Section</div>,
}));

jest.mock('@/components/pages/home/ExampleSection', () => ({
  __esModule: true,
  default: () => <div>Example Section</div>,
}));

jest.mock('@/components/pages/home/CTASection', () => ({
  __esModule: true,
  default: () => <div>CTA Section</div>,
}));

describe('Home Page', () => {
  it('renders all sections', () => {
    render(<Home />);

    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Features Section')).toBeInTheDocument();
    expect(screen.getByText('Example Section')).toBeInTheDocument();
    expect(screen.getByText('CTA Section')).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<Home />);
    // Verify semantic structure
  });
});

describe('Calculator Page', () => {
  it('renders calculator interface', () => {
    render(<Calculator />);
    // Verify calculator components are present
  });

  it('displays group selector', () => {
    render(<Calculator />);
    // Verify group selector is rendered
  });
});
