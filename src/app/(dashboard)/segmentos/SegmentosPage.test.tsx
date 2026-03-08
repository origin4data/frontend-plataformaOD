import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SegmentosPage from './page'; // Se o seu componente principal se chamar page.tsx, mude para './page'
import { api } from '@/services/api';

// Diz ao Jest para interceptar as chamadas do Axios
jest.mock('@/services/api');

describe('SegmentosPage Component', () => {
  const mockSegmentos = [
    { id: 1, nome: 'Varejo', descricao: 'Lojas e comércio' },
    { id: 2, nome: 'Tecnologia', descricao: 'Software e Hardware' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Deve carregar e exibir a lista de segmentos vinda da API', async () => {
    // Simula a API retornando nossos dados mockados
    (api.get as jest.Mock).mockResolvedValue({ data: mockSegmentos });

    render(<SegmentosPage />);

    // Verifica se mostra o loading inicial
    expect(screen.getByText(/Carregando segmentos/i)).toBeInTheDocument();

    // Aguarda o loading sumir e a tabela popular
    await waitFor(() => {
      expect(screen.getByText('Varejo')).toBeInTheDocument();
      expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    });
  });

  it('2. Deve filtrar a lista ao digitar no campo de busca', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockSegmentos });

    render(<SegmentosPage />);

    // Espera os itens aparecerem
    await waitFor(() => {
      expect(screen.getByText('Varejo')).toBeInTheDocument();
    });

    // Pega o input de busca pelo placeholder
    const inputBusca = screen.getByPlaceholderText(/Buscar segmento pelo nome/i);
    
    // Digita "Tec" no input
    fireEvent.change(inputBusca, { target: { value: 'Tec' } });

    // Varejo deve sumir, Tecnologia deve continuar
    await waitFor(() => {
      expect(screen.queryByText('Varejo')).not.toBeInTheDocument();
      expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    });
  });

  it('3. Deve abrir a modal, preencher os dados e chamar a API para criar', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] }); // Inicia lista vazia
    // Simula o retorno de SUCESSO na criação do POST
    (api.post as jest.Mock).mockResolvedValue({ data: { id: 3, nome: 'Saúde', descricao: 'Hospitais' } });

    render(<SegmentosPage />);

    // Aguarda carregar a tela
    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });

    // Clica em "Novo Segmento"
    const btnNovo = screen.getByText(/Novo Segmento/i);
    fireEvent.click(btnNovo);

    // Espera a Modal aparecer
    expect(screen.getByRole('heading', { name: 'Novo Segmento', level: 3 })).toBeInTheDocument();

    // Preenche Nome
    const inputNome = screen.getByPlaceholderText('Ex: Varejo');
    fireEvent.change(inputNome, { target: { value: 'Saúde' } });

    // Preenche Descrição
    const inputDesc = screen.getByPlaceholderText('Descrição do segmento...');
    fireEvent.change(inputDesc, { target: { value: 'Hospitais' } });

    // Clica em Salvar/Criar
    const btnCriar = screen.getByText('Criar Segmento');
    fireEvent.click(btnCriar);

    // Aguarda a chamada na API e o Pop-up de Sucesso aparecer
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/segmentos', { nome: 'Saúde', descricao: 'Hospitais' });
      expect(screen.getByText('Segmento criado com sucesso!')).toBeInTheDocument();
    });
  });
});
