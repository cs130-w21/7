import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils'
import { unmountComponentAtNode } from 'react-dom';
import Home from '../components/Pages/Home';
import Create from '../components/Pages/Create';
import LogIn from '../components/Pages/LogIn';
import SignUp from '../components/Pages/SignUp';
import Recommend from '../components/Pages/Recommend';


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

console.log('Running integration tests\n');

it('integrates Home', () => {
  act(() => {
    ReactDOM.render(<Home />, container);
  });

  expect();
});

it('integrates Create', () => {
  act(() => {
    ReactDOM.render(<Create />, container);
  });
  
  expect();
});

it('integrates LogIn', () => {
    act(() => {
      ReactDOM.render(<LogIn />, container);
    });
    
    expect();
});

it('integrates SignUp', () => {
    act(() => {
      ReactDOM.render(<SignUp />, container);
    });
    
    expect();
});

