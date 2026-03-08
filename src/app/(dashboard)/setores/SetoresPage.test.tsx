import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetoresPage from './page'; // Se o arquivo do componente se chamar page.tsx, altere para './page'
import { api } from '@/services/api';

// Intercepta as chamadas do Axios
jest.mock('@/services/api');

describe('SetoresPage Component', () => {
  const mockSetores = [
    { id: 1, nome: 'Supermercado', descricao: 'Vendas em geral', segmento: { id: 1, nome: 'Varejo' } },
    { id: 2, nome: 'Software House', descricao: 'Desenvolvimento', segmento: { id: 2, nome: 'Tecnologia' } }
  ];

  const mockSegmentos = [
    { id: 1, nome: 'Varejo' },
    { id: 2, nome: 'Tecnologia' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Como a tela de Setores faz duas requisições GET no useEffect, 
    // mockamos a resposta com base na URL solicitada
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === '/setores') return Promise.resolve({ data: mockSetores });
      if (url === '/segmentos') return Promise.resolve({ data: mockSegmentos });
      return Promise.resolve({ data: [] });
    });
  });

  it('1. Deve carregar e exibir a lista de setores vinda da API', async () => {
    render(<SetoresPage />);

    expect(screen.getByText(/Carregando setores/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Supermercado')).toBeInTheDocument();
      expect(screen.getByText('Software House')).toBeInTheDocument();
    });
  });

  it('2. Deve filtrar a lista ao digitar no campo de busca', async () => {
    render(<SetoresPage />);

    await waitFor(() => {
      expect(screen.getByText('Supermercado')).toBeInTheDocument();
    });

    const inputBusca = screen.getByPlaceholderText(/Buscar setor pelo nome/i);
    fireEvent.change(inputBusca, { target: { value: 'Software' } });

    await waitFor(() => {
      expect(screen.queryByText('Supermercado')).not.toBeInTheDocument();
      expect(screen.getByText('Software House')).toBeInTheDocument();
    });
  });

  it('3. Deve abrir a modal, preencher os dados e chamar a API para criar um Setor', async () => {
    // Simula o retorno de sucesso do POST
    (api.post as jest.Mock).mockResolvedValue({ 
      data: { id: 3, nome: 'Clínica', descricao: 'Atendimento', segmento: { id: 3, nome: 'Saúde' } } 
    });

    render(<SetoresPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });

    // Abre a modal
    fireEvent.click(screen.getByText(/Novo Setor/i));

    expect(screen.getByRole('heading', { name: 'Novo Setor', level: 3 })).toBeInTheDocument();

    // Preenche Nome e Descrição
    fireEvent.change(screen.getByPlaceholderText('Ex: Supermercado'), { target: { value: 'Clínica' } });
    fireEvent.change(screen.getByPlaceholderText('Breve descrição...'), { target: { value: 'Atendimento médico' } });

    // Seleciona o Segmento no dropdown
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    // Envia o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Criar Setor' }));

    // Verifica se a API foi chamada e o popup apareceu
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/setores', { 
        nome: 'Clínica', 
        descricao: 'Atendimento médico', 
        segmentoId: 1 
      });
      expect(screen.getByText('Setor criado com sucesso!')).toBeInTheDocument();
    });
  });
});
