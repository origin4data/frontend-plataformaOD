'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, MoreVertical, Briefcase, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { SegmentoResponseDTO } from '@/types/api'
import { api } from '@/services/api'

export default function SegmentosPage() {
  const [segmentos, setSegmentos] = useState<SegmentoResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newItem, setNewItem] = useState({ nome: '', descricao: '' })

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<SegmentoResponseDTO | null>(null)
  const [deletingItem, setDeletingItem] = useState<SegmentoResponseDTO | null>(null)
  const [deleteInput, setDeleteInput] = useState('')

  // Estado para os Pop-ups de notificação
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000) // Some após 4 segundos
  }

  const fetchSegmentos = async () => {
    try {
      const response = await api.get('/segmentos')
      setSegmentos(response.data)
    } catch (error) {
      console.error("Erro ao buscar segmentos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSegmentos()
  }, [])

  const handleCreate = async () => {
    if (!newItem.nome.trim()) {
      showNotification("O nome do segmento é obrigatório.", "error")
      return
    }
    
    try {
      const response = await api.post('/segmentos', newItem)
      setSegmentos(prev => [...prev, response.data])
      setIsCreating(false)
      setNewItem({ nome: '', descricao: '' })
      showNotification("Segmento criado com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao criar segmento:", error)
      showNotification("Falha ao criar o segmento. Verifique os dados.", "error")
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      await api.put(`/segmentos/${editingItem.id}`, {
        nome: editingItem.nome,
        descricao: editingItem.descricao
      })
      setSegmentos(prev => prev.map(s => s.id === editingItem.id ? editingItem : s))
      setEditingItem(null)
      showNotification("Segmento atualizado com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao salvar edição:", error)
      showNotification("Falha ao salvar as alterações.", "error")
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    try {
      await api.delete(`/segmentos/${deletingItem.id}`)
      setSegmentos(prev => prev.filter(s => s.id !== deletingItem.id))
      setDeletingItem(null)
      setDeleteInput('')
      showNotification("Segmento excluído com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao excluir segmento:", error)
      showNotification("Falha ao excluir o segmento.", "error")
    }
  }

  const filteredSegmentos = segmentos.filter(segmento => 
    segmento.nome.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden text-zinc-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-8 pb-8 px-6 pt-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/50">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-orange-500" />
              Gestão de Segmentos
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Gerencie os segmentos de mercado da plataforma.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Novo Segmento
          </button>
        </div>

        <div className="relative bg-zinc-950/40 border border-zinc-800/60 rounded-xl backdrop-blur-xl flex flex-col shadow-2xl pb-4">
          <div className="p-4 border-b border-zinc-800/60 flex items-center gap-4 bg-zinc-900/20 rounded-t-xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar segmento pelo nome..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/40 border-b border-zinc-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium text-zinc-400 w-1/3">Nome do Segmento</th>
                  <th className="px-6 py-4 font-medium text-zinc-400 w-1/2">Descrição</th>
                  <th className="px-6 py-4 font-medium text-zinc-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 animate-pulse font-mono text-xs uppercase tracking-widest">Carregando segmentos...</td>
                  </tr>
                ) : filteredSegmentos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Nenhum segmento encontrado.</td>
                  </tr>
                ) : (
                  filteredSegmentos.map((segmento) => (
                    <tr key={segmento.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-200">{segmento.nome}</td>
                      <td className="px-6 py-4 text-zinc-400 truncate max-w-xs">{segmento.descricao || '-'}</td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === segmento.id ? null : segmento.id)}
                          className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors relative z-10"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === segmento.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-6 top-10 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <button 
                                onClick={() => { setEditingItem(segmento); setOpenMenuId(null); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                              >
                                Editar
                              </button>
                              <div className="h-px bg-zinc-800/80 w-full" />
                              <button 
                                onClick={() => { setDeletingItem(segmento); setOpenMenuId(null); setDeleteInput(''); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                              >
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pop-up / Toast de Notificação */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-zinc-900/90 border-green-500/30 text-green-400' 
              : 'bg-zinc-900/90 border-red-500/30 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="text-sm font-medium text-zinc-200">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 text-zinc-500 hover:text-zinc-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
              <h3 className="text-lg font-semibold text-white">Novo Segmento</h3>
              <button onClick={() => setIsCreating(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={newItem.nome}
                  onChange={(e) => setNewItem({...newItem, nome: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Ex: Varejo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
                <textarea 
                  value={newItem.descricao}
                  onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none min-h-[100px]"
                  placeholder="Descrição do segmento..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800/80 flex justify-end gap-3 bg-zinc-950/50">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-zinc-300 hover:text-white">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20">Criar Segmento</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
              <h3 className="text-lg font-semibold text-white">Editar Segmento</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome</label>
                <input 
                  type="text" 
                  value={editingItem.nome}
                  onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
                <textarea 
                  value={editingItem.descricao || ''}
                  onChange={(e) => setEditingItem({...editingItem, descricao: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none min-h-[100px]"
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800/80 flex justify-end gap-3 bg-zinc-950/50">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm text-zinc-300 hover:text-white">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-red-900/30 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Excluir "{deletingItem.nome}"?</h3>
              <p className="text-sm text-zinc-400 mb-6">Esta ação não pode ser desfeita. Para confirmar a exclusão, digite o nome do segmento abaixo.</p>
              
              <div className="text-left mb-6">
                <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Digite <span className="text-zinc-300 font-bold">{deletingItem.nome}</span></label>
                <input 
                  type="text" 
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none text-center font-mono"
                  placeholder={deletingItem.nome}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setDeletingItem(null)} className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors">Cancelar</button>
                <button 
                  disabled={deleteInput !== deletingItem.nome}
                  onClick={handleDelete} 
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/30 disabled:text-white/50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Excluir Segmento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
