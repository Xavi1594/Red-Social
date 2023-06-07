import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import RegisterFormComponent from '../Components/RegisterFormComponent';

test('renders app component', () => {
  render(<App />);
});

test('renders register form component', () => {
  render(<RegisterFormComponent />);
  const registerForm = screen.getByTestId('register-form');
  expect(registerForm).toBeInTheDocument();
});