'use client';
import { useDrag, useDrop } from 'react-dnd';
import { Mail, Phone, DollarSign } from 'lucide-react';
import { leadService, Lead } from '@/services/leadService';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function KanbanView({ leads }: { leads: Lead[], onUpdateLeadStatus: any }) {
  const [statuses, setStatuses] = useState<any[]>([]);
  
  useEffect(() => {
    leadService.listarStatus().then(setStatuses).catch(() => {
      setStatuses([{ id: 1, nome: 'Novo', cor: '#6b7280' }]); // Fallback
    });
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map(status => (
        <KanbanColumn key={status.id} status={status} leads={leads.filter(l => l.statusLead?.id === status.id)} />
      ))}
    </div>
  );
}

function KanbanColumn({ status, leads }: any) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEAD_CARD',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div ref={drop as any} className={`w-80 flex-shrink-0 bg-neutral-900 p-4 rounded-xl border-2 ${isOver ? 'border-orange-500' : 'border-neutral-800'}`}>
      <h3 className="text-white font-bold mb-4">{status.nome}</h3>
      <div className="space-y-3">
        {leads.map((lead: Lead) => <LeadCard key={lead.id} lead={lead} />)}
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LEAD_CARD',
    item: { id: lead.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <Link href={`/crm/lead/${lead.id}`}>
      <div ref={drag as any} className={`bg-neutral-800 p-4 rounded-lg border border-neutral-700 ${isDragging ? 'opacity-50' : ''}`}>
        <h4 className="text-white font-medium">{lead.nome}</h4>
        <div className="text-xs text-neutral-400 mt-2">
          <p className="flex items-center gap-1"><Mail size={12}/> {lead.email}</p>
          <p className="flex items-center gap-1 mt-1"><Phone size={12}/> {lead.telefone}</p>
        </div>
      </div>
    </Link>
  );
}