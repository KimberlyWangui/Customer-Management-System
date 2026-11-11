import { useNavigate } from 'react-router'
import api from '../../api/axios'
import CustomerForm from '../../components/CustomerForm'

const emptyCustomer = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
}

export default function AddCustomer() {
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    const res = await api.post('/customers', form)
    navigate(`/admin/customers/${res.data.customer.id}`, {
      state: { message: 'Customer added successfully.' },
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Add customer</h1>
      <p className="text-sm text-gray-500">Fill in the customer's details below.</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <CustomerForm
          initialValues={emptyCustomer}
          onSubmit={handleSubmit}
          submitText="Add customer"
          cancelTo="/admin/customers"
        />
      </div>
    </div>
  )
}