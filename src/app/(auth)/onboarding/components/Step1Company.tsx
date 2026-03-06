import { useState } from 'react'
import { Search } from 'lucide-react'

interface Step1Props {
  data: { cnpj: string; razaoSocial: string; nomeFantasia: string }
  onChange: (data: any) => void
}

export function Step1Company({ data, onChange }: Step1Props) {
  const [loadingCnpj, setLoadingCnpj] = useState(false)
  const [cnpjNotFound, setCnpjNotFound] = useState(false)

  const buscarDadosCnpj = async (cnpjLimpo: string) => {
    setLoadingCnpj(true)
    setCnpjNotFound(false)
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
      if (!response.ok) throw new Error()
      const cnpjData = await response.json()
      onChange({
        razaoSocial: cnpjData.razao_social || '',
        nomeFantasia: cnpjData.nome_fantasia || cnpjData.razao_social || ''
      })
    } catch {
      setCnpjNotFound(true)
    } finally {
      setLoadingCnpj(false)
    }
  }

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpjNotFound(false)
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 14) value = value.slice(0, 14)
    if (value.length === 14) buscarDadosCnpj(value)
    
    const masked = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
    onChange({ cnpj: masked })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 flex justify-between uppercase tracking-wider">
          <span>CNPJ da Empresa</span>
          {cnpjNotFound && <span className="text-yellow-500 text-[10px]">Não encontrado. Preencha manualmente.</span>}
        </label>
        <div className="relative group">
          <input
            type="text"
            value={data.cnpj}
            onChange={handleCnpjChange}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="00.000.000/0000-00"
          />
          <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${loadingCnpj ? 'text-orange-500 animate-spin' : 'text-zinc-600'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Razão Social *</label>
          <input
            type="text"
            value={data.razaoSocial}
            onChange={(e) => onChange({ razaoSocial: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="Razão Social"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome Fantasia</label>
          <input
            type="text"
            value={data.nomeFantasia}
            onChange={(e) => onChange({ nomeFantasia: e.target.value })}
            className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all"
            placeholder="Nome Fantasia"
          />
        </div>
      </div>
    </div>
  )
}