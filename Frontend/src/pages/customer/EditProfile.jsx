import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/axios'
import CustomerForm from '../../components/CustomerForm'
import { useAuth } from '../../context/AuthContext'

export default function EditProfile() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/profile')
      .then((res) => {
        const p = res.data
        setInitialValues({
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          phone: p.phone,
          address: p.address ?? '',
        })
      })
      .catch(() => setError('Could not load your profile. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (form) => {
    await api.put('/profile', form)
    await refreshUser()
    navigate('/dashboard', { state: { message: 'Your profile was updated successfully.' } })
  }

  if (loading) return <p className="text-center text-gray-500">Loading...</p>

  if (error) {
    return <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit profile</h1>
      <p className="text-sm text-gray-500">Update your details and save your changes.</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <CustomerForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Save changes"
          cancelTo="/dashboard"
        />
      </div>
    </div>
  )
}