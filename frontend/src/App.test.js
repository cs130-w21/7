import { render, screen } from '@testing-library/react';
import App from './App';

test('renders yummy', () => {
  render(<App />);
  const linkElement = screen.getByText(/YummY/i);
  expect(linkElement).toBeInTheDocument();
});
