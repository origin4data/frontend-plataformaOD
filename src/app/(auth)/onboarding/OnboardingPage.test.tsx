import '@testing-library/jest-dom';
// o resto dos seus imports continuam aqui...
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingPage from './page';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  }
}));

// Mock do Fetch nativo para a Brasil API (CNPJ)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ razao_social: 'EMPRESA DA API LTDA' }),
  })
) as jest.Mock;

describe('OnboardingPage', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, push: mockPush });
    window.localStorage.clear();
  });

  it('deve redirecionar para o dashboard caso o usuário já possua empresaMae (Trava de Segurança)', () => {
    window.localStorage.setItem('user', JSON.stringify({
      empresaMae: { id: 'empresa-123' }
    }));

    render(<OnboardingPage />);

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('deve exibir erro na Etapa 1 se tentar avançar sem preencher CNPJ e Razão Social', async () => {
    render(<OnboardingPage />);
    
    const botaoAvancar = screen.getByRole('button', { name: /salvar e continuar/i });
    fireEvent.click(botaoAvancar);

    await waitFor(() => {
      expect(screen.getByText('Preencha o CNPJ e a Razão Social para continuar.')).toBeInTheDocument();
    });
  });

  it('deve criar a empresa na Etapa 1 e avançar para a Etapa 2', async () => {
    // Mock do retorno da criação da empresa
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'nova-empresa-id' } });

    render(<OnboardingPage />);

    // Preenche CNPJ
    const inputCnpj = screen.getByPlaceholderText('00.000.000/0000-00');
    fireEvent.change(inputCnpj, { target: { value: '12345678901234' } });

    // Preenche Razão Social
    const inputRazao = screen.getByPlaceholderText('Razão Social');
    fireEvent.change(inputRazao, { target: { value: 'Minha Empresa Teste' } });

    // Clica para avançar
    fireEvent.click(screen.getByRole('button', { name: /salvar e continuar/i }));

    await waitFor(() => {
      // Verifica se a API foi chamada com os dados corretos (apenas números no CNPJ)
      expect(api.post).toHaveBeenCalledWith('/api/empresas', {
        cnpj: '12345678901234',
        razaoSocial: 'Minha Empresa Teste',
        nomeFantasia: 'Minha Empresa Teste'
      });
    });

    // Verifica se mudou para a tela da Etapa 2
    expect(screen.getByText('Cliente e Segmentação')).toBeInTheDocument();
  });

  it('deve criar o cliente na Etapa 2 e finalizar o Onboarding', async () => {
    // 1. Passa a Etapa 1 silenciosamente para chegar na 2
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'empresa-id' } });
    // Mock dos GETs do useEffect da Etapa 2 (Segmentos e Setores)
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, nome: 'Varejo' }] }); // Segmentos
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 10, nome: 'Roupas', segmento: { id: 1 } }] }); // Setores

    render(<OnboardingPage />);
    
    fireEvent.change(screen.getByPlaceholderText('00.000.000/0000-00'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Razão Social'), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar e continuar/i }));

    // Espera a etapa 2 renderizar
    await waitFor(() => expect(screen.getByText('Cliente e Segmentação')).toBeInTheDocument());

    // 2. Preenche os dados da Etapa 2
    fireEvent.change(screen.getByPlaceholderText('Nome Completo / Filial'), { target: { value: 'Filial Centro' } });
    
    // Seleciona Segmento
    fireEvent.change(screen.getByRole('combobox', { name: /qual o segmento/i }), { target: { value: '1' } });

    // Clica no Setor (Checkbox)
    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
    });

    // Prepara o mock do post do Cliente
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'cliente-id' } });
    jest.useFakeTimers();

    // Finaliza
    fireEvent.click(screen.getByRole('button', { name: /finalizar configuração/i }));

    await waitFor(() => {
      // Confirma requisição
      expect(api.post).toHaveBeenCalledWith('/api/clientes', expect.objectContaining({
        nome: 'Filial Centro',
        empresaId: 'empresa-id',
        setoresIds: [10] // Garante que pegou o setor selecionado
      }));
    });

    jest.advanceTimersByTime(1000);

    // Confirma redirecionamento
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    jest.useRealTimers();
  });
});