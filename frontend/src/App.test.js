import { render, screen } from '@testing-library/react';
import App from './App';

test('renders yummy', () => {
  render(<App />);
  expect(screen.getAllByText('YummY')).toBeInTheDocument();
});
