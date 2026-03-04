import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// 1. Simular dependências
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
    
    // Limpar localStorage antes de cada teste
    window.localStorage.clear();
    
    // Usar fake timers para lidar com os setTimeouts da página
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para /dashboard se o usuário já possuir empresaMae', async () => {
    mockLogin.mockResolvedValueOnce({}); // A função de login executa sem erro
    
    // Simula o AuthContext/Service salvando no localStorage
    window.localStorage.setItem('user', JSON.stringify({
      nome: 'Admin',
      empresaMae: { id: 'empresa-123' }
    }));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('user@origindata.com'), { target: { value: 'admin@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /autenticar conexão/i }));

    // Avança o tempo do setTimeout (2500ms)
    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve redirecionar para /onboarding se o usuário NÃO possuir empresaMae', async () => {
    mockLogin.mockResolvedValueOnce({});
    
    // Simula usuário recém-criado sem empresa
    window.localStorage.setItem('user', JSON.stringify({
      nome: 'Novo Usuário',
      // empresaMae não existe aqui
    }));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('user@origindata.com'), { target: { value: 'novo@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: /autenticar conexão/i }));

    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding');
    });
  });
});