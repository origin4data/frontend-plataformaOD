'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, Building2, Calendar, 
  DollarSign, User, MessageSquare, Send, Edit, Trash2, 
  Loader2, AlertCircle
} from 'lucide-react';
import { leadService, Lead } from '@/services/leadService';

export default function LeadDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadLead(parseInt(id as string));
    }
  }, [id]);

  const loadLead = async (leadId: number) => {
    try {
      setLoading(true);
      const data = await leadService.buscarPorId(leadId);
      setLead(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar lead');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!lead || !confirm('Deseja excluir este lead?')) return;
    try {
      await leadService.deletar(lead.id);
      router.push('/crm');
    } catch (err: any) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/crm')} className="flex items-center gap-2 text-neutral-400">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="flex gap-2">
          <button className="p-2 text-orange-500"><Edit size={20} /></button>
          <button onClick={handleDelete} className="p-2 text-red-500"><Trash2 size={20} /></button>
        </div>
      </div>
      {lead && (
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h1 className="text-2xl font-bold text-white">{lead.nome}</h1>
          <p className="text-neutral-400">ID: {lead.id}</p>
          {/* Resto do layout do Lead aqui */}
        </div>
      )}
    </div>
  );
}