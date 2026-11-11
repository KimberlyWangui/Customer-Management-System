import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import api from '../../api/axios'
import CustomerForm from '../../components/CustomerForm'

export default function EditCustomer() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/customers/${id}`)
      .then((res) => {
        const c = res.data
        setInitialValues({
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone,
          address: c.address ?? '',
        })
      })
      .catch((err) => {
        setError(err.response?.status === 404 ? 'Customer not found.' : 'Could not load this customer.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (form) => {
    await api.put(`/customers/${id}`, form)
    navigate(`/admin/customers/${id}`, {
      state: { message: 'Customer updated successfully.' },
    })
  }

  if (loading) return <p className="text-center text-gray-500">Loading...</p>

  if (!initialValues) {
    return (
      <div className="text-center">
        <p className="text-gray-700">{error}</p>
        <Link to="/admin/customers" className="mt-4 inline-block text-primary hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit customer</h1>
      <p className="text-sm text-gray-500">Update the details and save your changes.</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <CustomerForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Save changes"
          cancelTo={`/admin/customers/${id}`}
        />
      </div>
    </div>
  )
}