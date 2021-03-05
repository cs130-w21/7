import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils'
import { unmountComponentAtNode } from 'react-dom';
import Create from '../components/Pages/Create';
import LogIn from '../components/Pages/LogIn';
import SignUp from '../components/Pages/SignUp';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

console.log('Running interface tests\n');

it('interfaces LoginPage', () => {
  act(() => {
    ReactDOM.render(<LogIn />, container);
  });

  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('LOG IN')).toBeInTheDocument();
  expect(screen.getByText('SIGN UP')).toBeInTheDocument();
});

it('interfaces SignUpPage', () => {
  act(() => {
    ReactDOM.render(<SignUp />, container);
  });
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('SIGN UP')).toBeInTheDocument();
});

it('interfaces CreatePage', () => {
  act(() => {
    ReactDOM.render(<Create />, container);
  });

  // Page frame
  expect(screen.getByText('Select your preferences')).toBeInTheDocument();
  expect(screen.getByText('Cuisines')).toBeInTheDocument();
  expect(screen.getByText('Food Types')).toBeInTheDocument();
});