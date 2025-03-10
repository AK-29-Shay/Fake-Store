import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

const mockAuth = {
  token: 'fake-token',
  login: jest.fn(),
  logout: jest.fn()
};

jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => mockAuth
}));

describe('App', () => {
  test('renders home page when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const navbarTitle = screen.getByText(/fake store/i);
    expect(navbarTitle).toBeInTheDocument();

    const catchPhrase = screen.getByText(/Your One-Stop Shop/i);
    expect(catchPhrase).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    mockAuth.token = null;

    render(
      <MemoryRouter initialEntries={['/products']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    const loginHeading = screen.getByText(/login/i);
    expect(loginHeading).toBeInTheDocument();
  });
});