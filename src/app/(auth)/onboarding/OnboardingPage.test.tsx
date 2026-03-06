import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OnboardingPage from './page';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// Mocks das dependências
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

    expect(await screen.findByText('Preencha o CNPJ e a Razão Social para continuar.')).toBeInTheDocument();
  });

  it('deve criar a empresa na Etapa 1 e avançar para a Etapa 2', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'nova-empresa-id' } });
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText('00.000.000/0000-00'), { target: { value: '12345678901234' } });
    fireEvent.change(screen.getByPlaceholderText('Razão Social'), { target: { value: 'Minha Empresa Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar e continuar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/empresas', expect.objectContaining({
        cnpj: '12345678901234',
        razaoSocial: 'Minha Empresa Teste'
      }));
    });

    const tituloEtapa2 = await screen.findByRole('heading', { level: 2, name: /Cliente e Segmentação/i });
    expect(tituloEtapa2).toBeInTheDocument();
  });

  it('deve criar o cliente na Etapa 2 e finalizar o Onboarding', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'empresa-id' } });
    
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('segmentos')) return Promise.resolve({ data: [{ id: 4, nome: 'Varejo' }] });
      if (url.includes('setores')) return Promise.resolve({ data: [{ id: 10, nome: 'Roupas', segmento: { id: 4 } }] });
      return Promise.resolve({ data: [] });
    });

    render(<OnboardingPage />);
    
    // Preenche Etapa 1
    fireEvent.change(screen.getByPlaceholderText('00.000.000/0000-00'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Razão Social'), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar e continuar/i }));

    // AGUARDA A ETAPA 2 RENDERIZAR NA TELA
    await waitFor(() => {
      expect(screen.getByText('1. Dados Principais')).toBeInTheDocument();
    });
    
    // Preenche dados do Cliente
    fireEvent.change(screen.getByPlaceholderText('Nome Completo / Filial'), { target: { value: 'Filial Centro' } });
    
    // Buscamos diretamente pelo texto da Option padrão, que é infalível
    const selectSegmento = screen.getByDisplayValue('Selecione um segmento...');
    fireEvent.change(selectSegmento, { target: { value: '4' } });

    // Aguarda o checkbox do setor aparecer após a troca do segmento e clica
    const checkboxSetor = await screen.findByRole('checkbox');
    fireEvent.click(checkboxSetor);

    // Mock do POST de criação do cliente
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'cliente-id' } });
    
    fireEvent.click(screen.getByRole('button', { name: /finalizar configuração/i }));

    // Verifica se os dados enviados para a API estão corretos
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/clientes', expect.objectContaining({
        nome: 'Filial Centro',
        empresaId: 'empresa-id',
        setoresIds: [10]
      }));
    });

    // Verifica o redirecionamento final para o dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 2000 });
  });
});