import { useState } from 'react'
import { Link } from 'react-router'
import FormInput from './FormInput'
import formatErrors from '../utils/formatErrors'
import validateCustomer from '../utils/validateCustomer'

export default function CustomerForm({ initialValues, onSubmit, submitText, cancelTo }) {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateCustomer(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(formatErrors(err.response.data.errors))
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors.general && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.general}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput label="First name" name="first_name"
          value={form.first_name} onChange={handleChange} error={errors.first_name} />
        <FormInput label="Last name" name="last_name"
          value={form.last_name} onChange={handleChange} error={errors.last_name} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput label="Email" name="email" type="email"
          value={form.email} onChange={handleChange} error={errors.email} />
        <FormInput label="Phone" name="phone" type="tel"
          value={form.phone} onChange={handleChange} error={errors.phone} />
      </div>

      <FormInput label="Address (optional)" name="address"
        value={form.address} onChange={handleChange} error={errors.address} />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  )
}