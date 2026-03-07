'use client'

import { Step2Client } from '../(auth)/onboarding/components/Step2Client'

export default function SandboxPage() {
  // Dados falsos (mock) apenas para o visual funcionar
  const fakeData = {
    nome: 'Empresa Teste Visual',
    status: 'ATIVO',
    cep: '22222-222',
    numeroEndereco: '123',
    complementoEndereco: '',
    segmentoId: '1',
    setoresIds: [1, 2]
  }

  return (
    <div className="min-h-screen bg-black p-20 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-10 rounded-2xl">
        <h1 className="text-white mb-8 border-b border-zinc-800 pb-4">🛠️ Ambiente de Teste Visual (Sandbox)</h1>
        
        {/* Aqui você renderiza só o pedaço da tela que quer ver */}
        <Step2Client 
          data={fakeData} 
          onChange={(newData) => console.log('Dados alterados:', newData)} 
        />
        
      </div>
    </div>
  )
}