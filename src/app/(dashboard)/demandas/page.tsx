'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  X,
  FolderKanban,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { processService, Process, ProcessCreateDTO, ProcessUpdateDTO } from '@/services/processService';

// ✅ CORREÇÃO: Adicionado 'default' para o Next.js reconhecer como página
export default function ProcessesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await processService.listar();
      setProcesses(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar processos:', err);
      setError(err.message || 'Erro ao carregar processos');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'USER') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-neutral-400">Você não tem permissão para visualizar processos.</p>
        </div>
      </div>
    );
  }

  const filteredProcesses = (processes || []).filter(
    (process) =>
      process.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingProcess(null);
    setShowModal(true);
  };

  const handleEdit = (process: Process) => {
    setEditingProcess(process);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este processo?')) return;
    try {
      await processService.deletar(id);
      await loadProcesses();
    } catch (err: any) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  const handleStatusChange = async (processId: number, newStatus: Process['status']) => {
    try {
      await processService.atualizarStatus(processId, newStatus);
      await loadProcesses();
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  const handlePriorityChange = async (processId: number, newPriority: Process['priority']) => {
    try {
      await processService.atualizarPrioridade(processId, newPriority);
      await loadProcesses();
    } catch (err: any) {
      alert('Erro ao atualizar prioridade: ' + err.message);
    }
  };

  const handleSave = async (processData: ProcessCreateDTO | ProcessUpdateDTO) => {
    try {
      if (editingProcess) {
        await processService.atualizar(editingProcess.id, processData as ProcessUpdateDTO);
      } else {
        await processService.criar(processData as ProcessCreateDTO);
      }
      await loadProcesses();
      setShowModal(false);
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
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
          <h1 className="text-2xl font-bold text-white">Processos</h1>
          <p className="text-neutral-400 mt-1">Gerencie todos os processos da empresa</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Processo
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="search"
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800 border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Processo</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Prioridade</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Responsável</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase">Prazo</th>
                <th className="px-6 py-3 text-right text-xs text-neutral-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                    <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    Nenhum processo encontrado
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((process) => (
                  <tr key={process.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">{process.title}</td>
                    <td className="px-6 py-4 text-sm text-white">{process.clienteNome}</td>
                    <td className="px-6 py-4">
                      <StatusDropdown
                        status={process.status}
                        onChange={(newStatus) => handleStatusChange(process.id, newStatus)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityDropdown
                        priority={process.priority}
                        onChange={(newPriority) => handlePriorityChange(process.id, newPriority)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xs font-bold border border-orange-500/20">
                          {process.assignedTo?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-white">{process.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(process.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(process)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(process.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProcessModal
          process={editingProcess}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ✅ CORREÇÃO: Posicionamento FIXED corrigido para StatusDropdown
function StatusDropdown({ status, onChange }: { status: Process['status']; onChange: (status: Process['status']) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending': return 'bg-orange-500/20 text-orange-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return s;
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)} transition-opacity`}
      >
        {getStatusLabel(status)}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 9999 }}
          className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl min-w-[160px] overflow-hidden"
        >
          {['pending', 'in_progress', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s as any); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              {getStatusLabel(s)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ✅ CORREÇÃO: Posicionamento FIXED corrigido para PriorityDropdown
function PriorityDropdown({ priority, onChange }: { priority: Process['priority']; onChange: (priority: Process['priority']) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return p;
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getPriorityColor(priority)} transition-opacity`}
      >
        {getPriorityLabel(priority)}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 9999 }}
          className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl min-w-[140px] overflow-hidden"
        >
          {['low', 'medium', 'high'].map((p) => (
            <button
              key={p}
              onClick={() => { onChange(p as any); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              {getPriorityLabel(p)}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ProcessModal({ process, onClose, onSave }: any) {
  const [formData, setFormData] = useState<any>(process || {
    title: '', clienteId: 1, status: 'pending', priority: 'medium', assignedTo: '', dueDate: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-semibold text-white">{process ? 'Editar Processo' : 'Novo Processo'}</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Título</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Cliente ID</label>
              <input type="number" value={formData.clienteId} onChange={(e) => setFormData({...formData, clienteId: parseInt(e.target.value)})} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white" required />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Prazo</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 text-neutral-400 hover:bg-neutral-800 rounded-lg">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}