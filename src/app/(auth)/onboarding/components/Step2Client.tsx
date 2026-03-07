import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { api } from '@/services/api'

interface Step2Props {
  data: any
  onChange: (data: any) => void
}

export function Step2Client({ data, onChange }: Step2Props) {
  const [segmentos, setSegmentos] = useState<any[]>([])
  const [todosSetores, setTodosSetores] = useState<any[]>([])
  const [loadingDados, setLoadingDados] = useState(true)

  // Função para transformar "texto exemplo" em "Texto Exemplo"
  const formatText = (text: string) => {
    if (!text) return ""
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resSeg, resSet] = await Promise.all([
          api.get('/api/segmentos'),
          api.get('/api/setores')
        ])
        setSegmentos(resSeg.data)
        setTodosSetores(resSet.data)
      } catch (err) {
        console.error("Erro ao buscar segmentos e setores:", err)
      } finally {
        setLoadingDados(false)
      }
    }
    carregarDados()
  }, [])

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2')
    onChange({ cep: value })
  }

  const handleSegmentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ segmentoId: e.target.value, setoresIds: [] })
  }

  const toggleSetor = (setorId: number) => {
    const isSelected = data.setoresIds.includes(setorId)
    if (isSelected) {
      onChange({ setoresIds: data.setoresIds.filter((id: number) => id !== setorId) })
    } else {
      onChange({ setoresIds: [...data.setoresIds, setorId] })
    }
  }

  const setoresDisponiveis = todosSetores.filter((s: any) => s.segmento?.id?.toString() === data.segmentoId?.toString())

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">1. Dados Principais</h4>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome do Cliente *</label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 outline-none transition-all"
            placeholder="Nome Completo / Filial"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CEP</label>
            <input type="text" value={data.cep} onChange={handleCepChange} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white font-mono rounded-xl focus:border-orange-500/50 outline-none" placeholder="00000-000" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Número</label>
            <input type="text" value={data.numeroEndereco} onChange={(e) => onChange({ numeroEndereco: e.target.value })} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-xl focus:border-orange-500/50 outline-none" placeholder="123" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Complemento</label>
            <input type="text" value={data.complementoEndereco} onChange={(e) => onChange({ complementoEndereco: e.target.value })} className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 text-white rounded-xl focus:border-orange-500/50 outline-none" placeholder="Sala 1" />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">2. Segmentação de Mercado</h4>

        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex gap-3 text-orange-200">
          <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Dica:</strong> Você pode criar um Cliente para cada Setor para evitar confusões de atendimento no CRM.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Qual o Segmento?</label>
          <select 
            value={data.segmentoId} 
            onChange={handleSegmentoChange}
            disabled={loadingDados}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 outline-none appearance-none"
          >
            <option value="">{loadingDados ? 'Carregando banco de dados...' : 'Selecione um segmento...'}</option>
            {segmentos.map(seg => (
              <option key={seg.id} value={seg.id}>
                {formatText(seg.nome)} {/* APLICADO AQUI */}
              </option>
            ))}
          </select>
        </div>

        {data.segmentoId && (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Selecione os Setores *</label>
            {setoresDisponiveis.length === 0 ? (
              <p className="text-zinc-500 text-sm py-2">Nenhum setor cadastrado para este segmento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {setoresDisponiveis.map(setor => (
                  <label 
                    key={setor.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.setoresIds.includes(setor.id) ? 'bg-zinc-900 border-orange-500' : 'bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900'}`}
                  >
                    <input 
                      type="checkbox" 
                      checked={data.setoresIds.includes(setor.id)}
                      onChange={() => toggleSetor(setor.id)}
                      className="w-5 h-5 mt-0.5 rounded border-zinc-700 bg-zinc-900 text-orange-500 focus:ring-orange-500/50" 
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatText(setor.nome)} {/* APLICADO AQUI */}
                      </p>
                      {setor.descricao && (
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {formatText(setor.descricao)} {/* APLICADO AQUI */}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}