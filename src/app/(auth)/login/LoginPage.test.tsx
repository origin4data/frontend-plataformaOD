import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Simular dependências
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    window.localStorage.clear();
  });

  it('deve renderizar o formulário de login corretamente', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('user@origindata.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /autenticar conexão/i })).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando o login falha', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'));
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('user@origindata.com'), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /autenticar conexão/i }));

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
  });

  it('deve redirecionar para /dashboard se o usuário já possuir empresaMae', async () => {
    // Simulamos a API respondendo rápido
    mockLogin.mockImplementation(async () => {
      window.localStorage.setItem('user', JSON.stringify({
        nome: 'Admin',
        empresaMae: { id: 'empresa-123' }
      }));
      return { setupEmpresaPendente: false, usuario: { empresaMae: { id: 'empresa-123' } } };
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('user@origindata.com'), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /autenticar conexão/i }));

    // Usamos timeout generoso no waitFor para cobrir o setTimeout de 2500ms da página
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3500 });
  });

  it('deve redirecionar para /onboarding se o usuário NÃO possuir empresaMae', async () => {
    mockLogin.mockImplementation(async () => {
      window.localStorage.setItem('user', JSON.stringify({ nome: 'Novo' }));
      return { setupEmpresaPendente: true, usuario: {} };
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('user@origindata.com'), { target: { value: 'novo@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /autenticar conexão/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    }, { timeout: 3500 });
  });
});