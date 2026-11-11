import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AppLayout({ links, homeTo }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 font-medium ${
      isActive ? 'bg-white text-primary' : 'text-white hover:bg-primary-dark'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to={homeTo} className="text-xl font-bold text-white">MtejaHub</Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop user + logout */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-white/90">{user.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-white hover:bg-primary-dark"
            >
              <LogOut size={18} /> Log out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden space-y-1 px-4 pb-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 border-t border-white/20 pt-3">
              <p className="px-3 text-sm text-white/80">{user.name}</p>
              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-1 rounded-lg px-3 py-2 text-white hover:bg-primary-dark"
              >
                <LogOut size={18} /> Log out
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}