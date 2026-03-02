'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Mail,
  Phone,
  X,
  Loader2,
  Users,
  AlertCircle,
} from 'lucide-react'
import { clienteService, Cliente, ClienteCreateDTO, ClienteUpdateDTO } from '../../../services/clienteService'

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)
  const [clients, setClients] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clienteService.listar()
      setClients(data)
    } catch (err: any) {
      console.error('Erro ao carregar clientes:', err)
      setError(err.message || 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone.includes(searchTerm)
  )

  const handleAddNew = () => {
    setEditingClient(null)
    setShowModal(true)
  }

  const handleEdit = (client: Cliente) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      await clienteService.deletar(id)
      await loadClients()
    } catch (err: any) {
      alert('Erro ao deletar cliente: ' + err.message)
    }
  }

  const handleSave = async (clientData: ClienteCreateDTO | ClienteUpdateDTO) => {
    try {
      if (editingClient) {
        await clienteService.atualizar(editingClient.id, clientData as ClienteUpdateDTO)
      } else {
        await clienteService.criar(clientData as ClienteCreateDTO)
      }
      await loadClients()
      setShowModal(false)
    } catch (err: any) {
      alert('Erro ao salvar cliente: ' + err.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-500/20 text-green-400'
      case 'INATIVO':
        return 'bg-red-500/20 text-red-400'
      case 'PENDENTE':
        return 'bg-orange-500/20 text-orange-400'
      default:
        return 'bg-neutral-700 text-neutral-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'Ativo'
      case 'INATIVO':
        return 'Inativo'
      case 'PENDENTE':
        return 'Pendente'
      case 'SUSPENSO':
        return 'Suspenso'
      case 'CANCELADO':
        return 'Cancelado'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-neutral-400 mt-1">Gerencie todos os clientes cadastrados</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="search"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors">
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">Nenhum cliente encontrado</p>
                    <button
                      onClick={handleAddNew}
                      className="mt-4 text-orange-500 hover:text-orange-400 text-sm"
                    >
                      Cadastrar primeiro cliente
                    </button>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-neutral-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {client.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{client.nome}</p>
                          {client.documento && (
                            <p className="text-xs text-neutral-500">{client.documento}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <Mail className="w-4 h-4 text-neutral-500" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <Phone className="w-4 h-4 text-neutral-500" />
                          {client.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-white">
                        {client.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {getStatusLabel(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-white">
                        {new Date(client.dataCadastro).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 rounded-lg text-orange-500 hover:bg-orange-500/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ClientModal client={editingClient} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  )
}

function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Cliente | null
  onClose: () => void
  onSave: (client: ClienteCreateDTO | ClienteUpdateDTO) => void
}) {
  const [formData, setFormData] = useState<Partial<ClienteCreateDTO>>(
    client || {
      nome: '',
      email: '',
      telefone: '',
      tipo: 'PF',
      documento: '',
      observacoes: '',
    }
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData: ClienteCreateDTO = {
        nome: formData.nome!,
        email: formData.email!,
        telefone: formData.telefone!,
        tipo: formData.tipo!,
        documento: formData.documento,
        observacoes: formData.observacoes,
      }

      await onSave(submitData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-neutral-800">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-semibold text-white">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'PF' | 'PJ' })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                {formData.tipo === 'PF' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                value={formData.documento}
                onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={formData.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Informações adicionais sobre o cliente..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
