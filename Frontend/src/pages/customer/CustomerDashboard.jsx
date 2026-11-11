import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Pencil } from 'lucide-react'
import api from '../../api/axios'

export default function CustomerDashboard() {
  const location = useLocation()
  const successMessage = location.state?.message

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/profile')
      .then((res) => setProfile(res.data))
      .catch(() => setError('Could not load your profile. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center text-gray-500">Loading your profile...</p>

  if (error) {
    return <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
  }

  const details = [
    { label: 'First name', value: profile.first_name },
    { label: 'Last name', value: profile.last_name },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Address', value: profile.address || '—' },
    {
      label: 'Member since',
      value: new Date(profile.created_at).toLocaleDateString('en-KE', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
    },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Hello, {profile.first_name}</h1>
      <p className="text-sm text-gray-500">Here are the details we have for you.</p>

      {successMessage && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{successMessage}</div>
      )}

      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="font-semibold text-gray-900">My profile</h2>
          <Link
            to="/profile/edit"
            className="flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            <Pencil size={16} /> Edit profile
          </Link>
        </div>

        <dl className="divide-y divide-gray-100">
          {details.map((item) => (
            <div key={item.label} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
              <dd className="text-gray-900 sm:col-span-2">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}