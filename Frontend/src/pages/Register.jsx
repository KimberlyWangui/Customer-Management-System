import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'
import formatErrors from '../utils/formatErrors'

export default function Register() {
  const { user, register } = useAuth()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!form.email) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.phone) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10,13}$/.test(form.phone)) newErrors.phone = 'Phone must be 10 to 13 digits'
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      await register(form)
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
    <div className="min-h-screen bg-primary-light flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <Link to="/" className="block text-center text-2xl font-bold text-primary">
          MtejaHub
        </Link>
        <h1 className="mt-2 text-center text-gray-600">Create your account</h1>

        {errors.general && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="First name" name="first_name"
              value={form.first_name} onChange={handleChange} error={errors.first_name} />
            <FormInput label="Last name" name="last_name"
              value={form.last_name} onChange={handleChange} error={errors.last_name} />
          </div>

          <FormInput label="Email" name="email" type="email"
            value={form.email} onChange={handleChange} error={errors.email} />
          <FormInput label="Phone" name="phone" type="tel"
            value={form.phone} onChange={handleChange} error={errors.phone} />
          <FormInput label="Address (optional)" name="address"
            value={form.address} onChange={handleChange} error={errors.address} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Password" name="password" type="password"
              value={form.password} onChange={handleChange} error={errors.password} />
            <FormInput label="Confirm password" name="password_confirmation" type="password"
              value={form.password_confirmation} onChange={handleChange}
              error={errors.password_confirmation} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}