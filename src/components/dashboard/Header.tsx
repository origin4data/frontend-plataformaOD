import { useAuth } from "@/contexts/AuthContext";
import { Terminal } from "lucide-react";

export default function Header() {
  const { user } = useAuth()

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
          <span className="text-xs font-mono text-green-500 tracking-widest uppercase">Sistema Online</span>
      </div>
        <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight">
          Bem-vindo, {user?.name || 'Administrador'} <span className="opacity-70">👋</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm lg:text-base flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-500" />
            <span>Visão geral do ecossistema e métricas em tempo real.</span>
        </p>
    </div>
    )
}
