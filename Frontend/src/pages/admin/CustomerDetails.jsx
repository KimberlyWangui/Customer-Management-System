import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'

export default function CustomerDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const successMessage = location.state?.message

  useEffect(() => {
    api.get(`/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => {
        setError(err.response?.status === 404 ? 'Customer not found.' : 'Could not load this customer.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/customers/${id}`)
      navigate('/admin/customers', {
        state: { message: `${customer.first_name} ${customer.last_name} was deleted.` },
      })
    } catch {
      setError('Could not delete the customer. Please try again.')
      setConfirmOpen(false)
      setDeleting(false)
    }
  }

  if (loading) return <p className="text-center text-gray-500">Loading...</p>

  if (!customer) {
    return (
      <div className="text-center">
        <p className="text-gray-700">{error}</p>
        <Link to="/admin/customers" className="mt-4 inline-block text-primary hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  const details = [
    { label: 'Email', value: customer.email },
    { label: 'Phone', value: customer.phone },
    { label: 'Address', value: customer.address || '—' },
    { label: 'Has login account', value: customer.user_id ? 'Yes' : 'No' },
    {
      label: 'Registered on',
      value: new Date(customer.created_at).toLocaleDateString('en-KE', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
    },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back to customers
      </Link>

      {successMessage && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{successMessage}</div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-4 rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.first_name} {customer.last_name}
          </h1>
          <div className="flex gap-2">
            <Link
              to={`/admin/customers/${id}/edit`}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark sm:flex-none"
            >
              <Pencil size={16} /> Edit
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 sm:flex-none"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
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

      <ConfirmModal
        open={confirmOpen}
        title="Delete customer?"
        message={`This will delete ${customer.first_name} ${customer.last_name}. You can't undo this from the app.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  )
}