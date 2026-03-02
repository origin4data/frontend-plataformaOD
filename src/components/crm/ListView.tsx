'use client';
import { Mail, Phone, DollarSign, Calendar, User } from 'lucide-react';
import { Lead } from '@/services/leadService'; 
import Link from 'next/link'; 

interface ListViewProps {
  leads: Lead[];
}

export function ListView({ leads }: ListViewProps) {
  const getStatusColor = (statusNome?: string) => {
    if (!statusNome) return 'bg-neutral-700 text-neutral-400';
    
    const lowerName = statusNome.toLowerCase();
    if (lowerName.includes('novo')) return 'bg-neutral-700 text-neutral-400';
    if (lowerName.includes('ganho') || lowerName.includes('fechado')) return 'bg-green-500/20 text-green-400';
    if (lowerName.includes('perdido')) return 'bg-red-500/20 text-red-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  const getPriorityColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'ALTA':
        return 'bg-red-500/20 text-red-400';
      case 'MEDIA':
        return 'bg-orange-500/20 text-orange-400';
      case 'BAIXA':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-neutral-700 text-neutral-400';
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-neutral-400">Nenhum lead encontrado</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-neutral-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/crm/lead/${lead.id}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {lead.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                          {lead.nome}
                        </p>
                        {lead.origem && (
                          <p className="text-xs text-neutral-500">{lead.origem}</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Mail className="w-4 h-4 text-neutral-500" />
                        <span className="truncate max-w-[200px]">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        {lead.telefone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.statusLead?.nome
                      )}`}
                    >
                      {lead.statusLead?.nome || 'Sem status'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.prioridade && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          lead.prioridade
                        )}`}
                      >
                        {lead.prioridade}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.valor && (
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white font-medium">
                          R$ {(lead.valor / 1000).toFixed(0)}k
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.responsavel && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-medium">
                          {lead.responsavel.nome.charAt(0)}
                        </div>
                        <span className="text-sm text-white">{lead.responsavel.nome}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      {new Date(lead.dataCriacao).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}