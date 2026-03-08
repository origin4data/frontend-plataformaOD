import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AcessosPage from './page'; // Se o arquivo do componente se chamar page.tsx, altere para './page'
import { api } from '@/services/api';

jest.mock('@/services/api');

describe('AcessosPage Component', () => {
  const mockGrupos = [
    { id: '1', nome: 'Administrador', descricao: 'Acesso total', permissoes: [{ id: 'p1' }, { id: 'p2' }] },
    { id: '2', nome: 'Vendedor', descricao: 'Acesso ao funil', permissoes: [{ id: 'p3' }] }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({ data: mockGrupos });
  });

  it('1. Deve carregar e exibir a lista de grupos de acesso', async () => {
    render(<AcessosPage />);

    expect(screen.getByText(/Carregando acessos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Vendedor')).toBeInTheDocument();
    });
  });

  it('2. Deve filtrar a lista ao digitar no campo de busca', async () => {
    render(<AcessosPage />);

    await waitFor(() => {
      expect(screen.getByText('Administrador')).toBeInTheDocument();
    });

    const inputBusca = screen.getByPlaceholderText(/Pesquisar grupo pelo nome/i);
    fireEvent.change(inputBusca, { target: { value: 'Vendedor' } });

    await waitFor(() => {
      expect(screen.queryByText('Administrador')).not.toBeInTheDocument();
      expect(screen.getByText('Vendedor')).toBeInTheDocument();
    });
  });

  it('3. Deve abrir a modal, preencher os dados e chamar a API para criar um Grupo', async () => {
    (api.post as jest.Mock).mockResolvedValue({ 
      data: { id: '3', nome: 'Financeiro', descricao: 'Acesso ao faturamento', permissoes: [] } 
    });

    render(<AcessosPage />);

    await waitFor(() => {
      expect(screen.queryByText(/Carregando/i)).not.toBeInTheDocument();
    });

    // Abre modal
    fireEvent.click(screen.getByText(/Novo Grupo/i));

    expect(screen.getByRole('heading', { name: 'Novo Grupo de Acesso', level: 3 })).toBeInTheDocument();

    // Preenche dados
    fireEvent.change(screen.getByPlaceholderText('Ex: Financeiro'), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByPlaceholderText('Descreva os acessos deste grupo...'), { target: { value: 'Acesso ao faturamento' } });

    // Salva
    fireEvent.click(screen.getByRole('button', { name: 'Criar Grupo' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/grupos-acesso', { 
        nome: 'Financeiro', 
        descricao: 'Acesso ao faturamento',
        permissoes: [] 
      });
      expect(screen.getByText('Grupo criado com sucesso!')).toBeInTheDocument();
    });
  });
});
