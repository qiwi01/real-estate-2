import { render, screen } from '@testing-library/react';
import App from './App';

test('renders architectural real estate website logo', () => {
  render(<App />);
  const logoElement = screen.getByRole('heading', { name: /ArchDev Realty/i, level: 1 });
  expect(logoElement).toBeInTheDocument();
});

test('renders hero section with main heading', () => {
  render(<App />);
  const heroHeading = screen.getByText(/Excellence in Architectural Real Estate Development/i);
  expect(heroHeading).toBeInTheDocument();
});

test('renders services section', () => {
  render(<App />);
  const servicesHeading = screen.getByText(/Our Services/i);
  expect(servicesHeading).toBeInTheDocument();
});

test('renders contact section heading', () => {
  render(<App />);
  const contactHeading = screen.getByRole('heading', { name: /Contact Us/i, level: 2 });
  expect(contactHeading).toBeInTheDocument();
});
