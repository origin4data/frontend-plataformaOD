'use client';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Store,
  Loader2,
  AlertCircle,
} from 'lucide-react';
// ✅ Usando o atalho @/ configurado no seu tsconfig.json
import { empresaService, Empresa } from '@/services/empresaService';

// ✅ CORREÇÃO: Adicionado 'default' para o Next.js reconhecer a página
export default function StoresPage() {
  const [stores, setStores] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ATIVA' | 'INATIVA'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await empresaService.listar();
      setStores(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar lojas:', err);
      setError(err.message || 'Erro ao carregar lojas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta loja?')) {
      return;
    }

    try {
      await empresaService.deletar(id);
      await loadStores();
    } catch (err: any) {
      alert('Erro ao deletar loja: ' + err.message);
    }
  };

  // ✅ CORREÇÃO: Adicionado checks de existência (?.) para evitar erros se os dados vierem incompletos
  const filteredStores = (stores || []).filter((store) => {
    const matchesSearch =
      store.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.telefone?.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || store.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === 'ATIVA'
      ? 'bg-green-500/20 text-green-400'
      : 'bg-red-500/20 text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lojas / Filiais</h1>
          <p className="text-neutral-400 mt-1">Gerencie todas as unidades da empresa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
          <Plus className="w-5 h-5" />
          Nova Loja
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="search"
              placeholder="Buscar lojas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos Status</option>
              <option value="ATIVA">Ativas</option>
              <option value="INATIVA">Inativas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
              <Store className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400">Nenhuma loja encontrada</p>
            </div>
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 hover:border-orange-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg text-orange-500 hover:bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(store.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{store.nome}</h3>
                  {store.cnpj && <p className="text-sm text-neutral-400">CNPJ: {store.cnpj}</p>}
                </div>

                <div className="space-y-2">
                  {store.endereco && (
                    <div className="flex items-start gap-2 text-sm text-neutral-300">
                      <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{store.endereco}</span>
                    </div>
                  )}
                  {store.telefone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Phone className="w-4 h-4 text-neutral-500" />
                      {store.telefone}
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <span className="truncate">{store.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                    {store.status === 'ATIVA' ? 'Ativa' : 'Inativa'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(store.dataCriacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}