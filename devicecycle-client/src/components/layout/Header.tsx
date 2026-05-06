import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Bell, X, CheckCheck } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getChangeLogs } from '../../api/api'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const [read, setRead] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const { data: logs = [] } = useQuery({
    queryKey: ['changelogs', {}],
    queryFn: () => getChangeLogs(),
    staleTime: 10_000,
  })

  const recent = logs.slice(0, 6)
  const hasUnread = !read && recent.length > 0

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
    }
    if (showNotif) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showNotif])

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  function formatAction(action: string) {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase())
      .split(':')[0]
      .trim()
  }

  function timeAgo(iso: string) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (s < 60) return 'just now'
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <header className="h-[60px] flex items-center justify-end px-6 bg-white dark:bg-[#0f0f1a] border-b border-gray-200 dark:border-gray-800/60 flex-shrink-0 gap-4">

      {/* Right actions */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark'
            ? <Sun size={16} strokeWidth={1.75} />
            : <Moon size={16} strokeWidth={1.75} />
          }
        </button>

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => { setShowNotif(v => !v); setRead(true) }}
            className="btn-icon relative"
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.75} />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 w-80 card shadow-xl z-50 animate-fade-in overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Recent device activity</p>
                </div>
                <button onClick={() => setShowNotif(false)} className="btn-icon w-6 h-6">
                  <X size={13} />
                </button>
              </div>

              {/* Entries */}
              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <CheckCheck size={24} className="text-gray-300 dark:text-gray-700" />
                  <p className="text-sm text-gray-400 dark:text-gray-600">All caught up!</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {recent.map(log => (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800/60 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-800 dark:text-gray-200 truncate">
                          {formatAction(log.action)}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-600 font-mono truncate">{log.serialNumber}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 flex-shrink-0 pt-0.5">{timeAgo(log.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="w-px h-5 bg-gray-200 dark:bg-gray-700/60 mx-1.5" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold select-none cursor-default shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  )
}
