'use client';
import { useState } from 'react';
// ✅ CORREÇÃO: Caminho absoluto usando @/ e nome da pasta no plural
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Building2,
  Webhook,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  X,
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

// ✅ CORREÇÃO: Adicionado 'default' para o Next.js reconhecer como página
export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'webhooks'>('general');

  // Verifica permissão (apenas ADMIN ou OWNER)
  if (user?.role === 'USER') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-neutral-400">
            Apenas usuários com perfil ADMIN ou OWNER podem acessar as configurações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-neutral-400 mt-1">Gerencie as configurações do sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'general'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Geral
            </div>
          </button>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'webhooks'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhooks
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'webhooks' && user?.role === 'ADMIN' && <WebhooksTab />}
    </div>
  );
}

function GeneralTab() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userEmail: user?.email || '',
    companyName: user?.companyName || '',
    companyPhone: '(11) 1234-5678',
    companyAddress: 'Av. Paulista, 1000 - São Paulo, SP',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-orange-500/20">
            <User className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Perfil do Usuário</h2>
            <p className="text-sm text-neutral-400">Atualize suas informações pessoais</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Nome</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.userEmail}
              onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Perfil Atual</label>
            <div className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm">
              {user?.role}
            </div>
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </form>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-orange-500/20">
            <Building2 className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Dados da Empresa</h2>
            <p className="text-sm text-neutral-400">Informações da sua organização</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Nome da Empresa</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      url: 'https://api.example.com/webhook/leads',
      events: ['lead.created', 'lead.updated'],
      active: true,
      createdAt: '2024-02-15',
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  const availableEvents = [
    { value: 'lead.created', label: 'Lead Criado' },
    { value: 'lead.updated', label: 'Lead Atualizado' },
    { value: 'client.created', label: 'Cliente Criado' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3">
        <Webhook className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <p className="text-sm text-neutral-400">
          Webhooks permitem receber notificações em tempo real. Configure URLs de endpoint para receber dados via HTTP POST.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Webhooks Configurados</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" /> Adicionar Webhook
        </button>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-neutral-400 uppercase">URL</th>
              <th className="px-6 py-3 text-xs font-medium text-neutral-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {webhooks.map((webhook) => (
              <tr key={webhook.id} className="hover:bg-neutral-800 transition-colors">
                <td className="px-6 py-4"><code className="text-sm text-white font-mono">{webhook.url}</code></td>
                <td className="px-6 py-4 text-sm text-neutral-300">{webhook.active ? 'Ativo' : 'Inativo'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <WebhookModal
          availableEvents={availableEvents}
          onClose={() => setShowModal(false)}
          onSave={(w) => {
            setWebhooks([...webhooks, { ...w, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function WebhookModal({ availableEvents, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ url: '', events: [] as string[], active: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-800 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-semibold text-white">Novo Webhook</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">URL do Endpoint</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white font-mono text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium">Criar Webhook</button>
          </div>
        </form>
      </div>
    </div>
  );
}