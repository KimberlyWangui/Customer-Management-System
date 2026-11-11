import { useState } from 'react'
import { Link, Navigate, useLocation} from 'react-router'
import { useAuth } from '../context/AuthContext'
import FormInput from '../components/FormInput'
import formatErrors from '../utils/formatErrors'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Already logged in? Go to the right dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.password) newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      await login(form.email, form.password)
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <Link to="/" className="block text-center text-2xl font-bold text-primary">
          MtejaHub
        </Link>
        <h1 className="mt-2 text-center text-gray-600">Log in to your account</h1>

        {location.state?.message && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {location.state.message}
          </div>
        )}

        {errors.general && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <FormInput label="Email" name="email" type="email"
            value={form.email} onChange={handleChange} error={errors.email} />
          <FormInput label="Password" name="password" type="password"
            value={form.password} onChange={handleChange} error={errors.password} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}