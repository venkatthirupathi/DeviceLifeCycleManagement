import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Cpu, Layers, History,
  LogOut, ChevronRight, Zap, ShieldCheck, User,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/devices',    label: 'Devices',      icon: Cpu,             end: false },
  { to: '/firmware',   label: 'Firmware',     icon: Layers,          end: false },
  { to: '/changelogs', label: 'Change Logs',  icon: History,         end: false },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.role === 'Admin'

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-white dark:bg-[#0f0f1a] border-r border-gray-200 dark:border-gray-800/60 h-full">

      {/* ── Logo ────────────────────────────────── */}
      <div className="h-[60px] flex items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-800/60">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand flex-shrink-0">
          <Zap size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">DeviceCycle</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wide uppercase">PLM Platform</p>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mb-3">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <span className="flex items-center gap-2.5">
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </span>
            <ChevronRight
              size={12}
              strokeWidth={2}
              className="opacity-0 group-hover:opacity-40 transition-opacity"
            />
          </NavLink>
        ))}
      </nav>

      {/* ── User card + Logout ───────────────────── */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-200 dark:border-gray-800/60 space-y-1">
        <div className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center flex-shrink-0">
            {isAdmin
              ? <ShieldCheck size={13} className="text-white" strokeWidth={2} />
              : <User size={13} className="text-white" strokeWidth={2} />
            }
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
              {user?.fullName || user?.email}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate leading-tight">
              {isAdmin ? 'Administrator' : 'Read-only'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
        >
          <LogOut size={15} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
