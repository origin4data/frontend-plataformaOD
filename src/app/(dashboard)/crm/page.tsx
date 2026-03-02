'use client';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LayoutGrid, List, Plus, Search, Loader2 } from 'lucide-react';
import { KanbanView } from '@/components/crm/KanbanView';
import { ListView } from '@/components/crm/ListView';
import { leadService, Lead } from '@/services/leadService';

export default function CRMPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await leadService.listar();
        setLeads(data);
      } finally {
        setLoading(false);
      }
    };
    loadLeads();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">CRM - Funil de Vendas</h1>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Novo Lead
          </button>
        </div>
        
        <div className="flex gap-2 bg-neutral-900 p-2 rounded-lg w-fit">
          <button onClick={() => setViewMode('kanban')} className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-orange-500' : ''}`}><LayoutGrid size={20} /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500' : ''}`}><List size={20} /></button>
        </div>

        {viewMode === 'kanban' ? (
          <KanbanView leads={leads} onUpdateLeadStatus={() => {}} />
        ) : (
          <ListView leads={leads} />
        )}
      </div>
    </DndProvider>
  );
}