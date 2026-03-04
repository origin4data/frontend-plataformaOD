import { useAuth } from "@/contexts/AuthContext"

export default function Perfil() {
  const { user, setUserRole } = useAuth()
  return (
    <div className="flex items-center gap-3 bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-800/80 backdrop-blur-md">
      <div className="px-3 text-xs font-mono text-zinc-500 uppercase tracking-wider">
        Simular Perfil
      </div>
        <div className="h-6 w-px bg-zinc-800" />
        <select
          value={user?.role || 'ADMIN'}
          onChange={(e) => setUserRole(e.target.value as any)}
          className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-sm font-semibold text-orange-400 focus:outline-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fb923c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
          <option value="ADMIN" className="bg-zinc-900 text-white">ADMIN</option>
          <option value="OWNER" className="bg-zinc-900 text-white">OWNER</option>
          <option value="USER" className="bg-zinc-900 text-white">USER</option>
        </select>
      </div>
  )
}
