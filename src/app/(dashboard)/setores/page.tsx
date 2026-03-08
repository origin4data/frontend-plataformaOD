'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, MoreVertical, Layers, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { SetorResponseDTO, SegmentoResponseDTO } from '@/types/api'
import { api } from '@/services/api'

export default function SetoresPage() {
  const [setores, setSetores] = useState<SetorResponseDTO[]>([])
  const [segmentos, setSegmentos] = useState<SegmentoResponseDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newItem, setNewItem] = useState({ nome: '', descricao: '', segmentoId: '' })

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<SetorResponseDTO | null>(null)
  const [deletingItem, setDeletingItem] = useState<SetorResponseDTO | null>(null)
  const [deleteInput, setDeleteInput] = useState('')

  // Pop-up Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const fetchData = async () => {
    try {
      const [resSetores, resSegmentos] = await Promise.all([
        api.get('/setores'),
        api.get('/segmentos')
      ])
      setSetores(resSetores.data)
      setSegmentos(resSegmentos.data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!newItem.nome.trim() || !newItem.segmentoId) {
      showNotification("Nome e Segmento são obrigatórios.", "error")
      return
    }
    
    try {
      const response = await api.post('/setores', {
        nome: newItem.nome,
        descricao: newItem.descricao,
        segmentoId: Number(newItem.segmentoId)
      })
      setSetores(prev => [...prev, response.data])
      setIsCreating(false)
      setNewItem({ nome: '', descricao: '', segmentoId: '' })
      showNotification("Setor criado com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao criar setor:", error)
      showNotification("Falha ao criar o setor. Verifique se os dados estão corretos.", "error")
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      await api.put(`/setores/${editingItem.id}`, {
        nome: editingItem.nome,
        descricao: editingItem.descricao
      })
      setSetores(prev => prev.map(s => s.id === editingItem.id ? editingItem : s))
      setEditingItem(null)
      showNotification("Setor atualizado com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao editar setor:", error)
      showNotification("Falha ao salvar as alterações.", "error")
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    try {
      await api.delete(`/setores/${deletingItem.id}`)
      setSetores(prev => prev.filter(s => s.id !== deletingItem.id))
      setDeletingItem(null)
      setDeleteInput('')
      showNotification("Setor excluído com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao excluir setor:", error)
      showNotification("Falha ao excluir o setor.", "error")
    }
  }

  const filteredSetores = setores.filter(setor => 
    setor.nome.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Layers className="w-6 h-6 text-orange-500" />
              Gestão de Setores
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Organize os setores de atuação vinculados aos segmentos.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Novo Setor
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
                placeholder="Buscar setor pelo nome..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 transition-colors" 
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/40 border-b border-zinc-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium text-zinc-400">Nome do Setor</th>
                  <th className="px-6 py-4 font-medium text-zinc-400">Descrição</th>
                  <th className="px-6 py-4 font-medium text-zinc-400">Segmento Pai</th>
                  <th className="px-6 py-4 font-medium text-zinc-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-500 animate-pulse font-mono text-xs uppercase tracking-widest">Carregando setores...</td></tr>
                ) : filteredSetores.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">Nenhum setor encontrado.</td></tr>
                ) : (
                  filteredSetores.map((setor) => (
                    <tr key={setor.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-200">{setor.nome}</td>
                      <td className="px-6 py-4 text-zinc-400 truncate max-w-[200px]">{setor.descricao}</td>
                      <td className="px-6 py-4 text-zinc-400">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-xs font-mono border border-zinc-700/50">{setor.segmento?.nome || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={() => setOpenMenuId(openMenuId === setor.id ? null : setor.id)} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors relative z-10">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === setor.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-6 top-10 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <button onClick={() => { setEditingItem(setor); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">Editar</button>
                              <div className="h-px bg-zinc-800/80 w-full" />
                              <button onClick={() => { setDeletingItem(setor); setOpenMenuId(null); setDeleteInput(''); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">Excluir</button>
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

      {/* Pop-up de Notificação */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 backdrop-blur-md ${
            notification.type === 'success' ? 'bg-zinc-900/90 border-green-500/30 text-green-400' : 'bg-zinc-900/90 border-red-500/30 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <p className="text-sm font-medium text-zinc-200">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 text-zinc-500 hover:text-zinc-300 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
              <h3 className="text-lg font-semibold text-white">Novo Setor</h3>
              <button onClick={() => setIsCreating(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome do Setor</label>
                <input type="text" value={newItem.nome} onChange={(e) => setNewItem({...newItem, nome: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" placeholder="Ex: Supermercado" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Segmento</label>
                <select 
                  value={newItem.segmentoId} 
                  onChange={(e) => setNewItem({...newItem, segmentoId: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Selecione um segmento...</option>
                  {segmentos.map(seg => (
                    <option key={seg.id} value={seg.id}>{seg.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
                <textarea value={newItem.descricao} onChange={(e) => setNewItem({...newItem, descricao: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none min-h-[80px]" placeholder="Breve descrição..." />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800/80 flex justify-end gap-3 bg-zinc-950/50">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-zinc-300 hover:text-white">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-orange-500/20">Criar Setor</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edição */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
              <h3 className="text-lg font-semibold text-white">Editar Setor</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome</label>
                <input type="text" value={editingItem.nome} onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Descrição</label>
                <input type="text" value={editingItem.descricao || ''} onChange={(e) => setEditingItem({...editingItem, descricao: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none" />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800/80 flex justify-end gap-3 bg-zinc-950/50">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-sm text-zinc-300 hover:text-white">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-red-900/30 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-6 h-6" /></div>
              <h3 className="text-lg font-semibold text-white mb-2">Excluir "{deletingItem.nome}"?</h3>
              <p className="text-sm text-zinc-400 mb-6">Para confirmar a exclusão deste setor, digite o nome exato abaixo.</p>
              <div className="text-left mb-6">
                <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Digite <span className="text-zinc-300 font-bold">{deletingItem.nome}</span></label>
                <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none text-center font-mono" placeholder={deletingItem.nome} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeletingItem(null)} className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors">Cancelar</button>
                <button disabled={deleteInput !== deletingItem.nome} onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/30 disabled:text-white/50 text-white text-sm font-medium rounded-lg transition-colors">Excluir Setor</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
