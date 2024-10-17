import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Blockchain Tracking App title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Blockchain Tracking App/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/Login/i);
  expect(loginButton).toBeInTheDocument();
});

test('renders instruction button', () => {
  render(<App />);
  const instructionButton = screen.getByText(/Instructions/i);
  expect(instructionButton).toBeInTheDocument();
});

test('shows error on incorrect login', () => {
  render(<App />);
  const usernameInput = screen.getByPlaceholderText(/Username/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Login/i);
  
  usernameInput.value = 'wrongusername';
  passwordInput.value = 'wrongpassword';
  
  loginButton.click();
  
  const errorMessage = screen.getByText(/Invalid credentials/i);
  expect(errorMessage).toBeInTheDocument();
});
