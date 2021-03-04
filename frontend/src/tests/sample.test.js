import { render, screen } from '@testing-library/react';
import App from '../App';

const sum = (a, b) => a + b;
test("adds 1 + 2 to equal 3 - sanity check", () => {
  expect(sum(1, 2)).toBe(3);
});