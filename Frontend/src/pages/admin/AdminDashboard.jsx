import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Plus, UserCheck, UserPlus, Users } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load the dashboard. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>

  if (error) {
    return <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
  }

  const cards = [
    { label: 'Total customers', value: stats.total_customers, icon: Users },
    { label: 'New in last 7 days', value: stats.new_last_7_days, icon: UserPlus },
    { label: 'New in last 30 days', value: stats.new_last_30_days, icon: CalendarDays },
    { label: 'Signed up themselves', value: stats.self_registered, icon: UserCheck },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
        </div>
        <Link
          to="/admin/customers/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
        >
          <Plus size={18} /> Add customer
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <span className="rounded-lg bg-primary-light p-2 text-primary">
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent customers */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
          <h2 className="font-semibold text-gray-900">Recent customers</h2>
          <Link to="/admin/customers" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {stats.recent_customers.length === 0 ? (
          <p className="px-4 py-6 text-center text-gray-500 sm:px-6">No customers yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.recent_customers.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/admin/customers/${c.id}`}
                  className="flex flex-col gap-1 px-4 py-3 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.first_name} {c.last_name}</p>
                    <p className="text-sm text-gray-500">{c.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}