import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/FormInput'
import ConfirmModal from '../../components/ConfirmModal'

export default function Settings() {
  const navigate = useNavigate()
  const { clearSession } = useAuth()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Step 1: check a password was typed, then open the popup
  const openConfirm = (e) => {
    e.preventDefault()
    if (!password) {
      setError('Enter your password to continue')
      return
    }
    setError('')
    setConfirmOpen(true)
  }

  // Step 2: the user confirmed, so delete the account
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete('/profile', { data: { password } })
      navigate('/login', {
        replace: true,
        state: { message: 'Your account has been deleted.' },
      })
      clearSession()
    } catch (err) {
      setConfirmOpen(false)
      setDeleting(false)
      if (err.response?.status === 422) {
        setError(err.response.data.errors.password[0])
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500">Manage your account.</p>

      <div className="mt-6 rounded-xl border border-red-200 bg-white p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-red-50 p-2 text-red-600">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-gray-900">Delete account</h2>
            <p className="mt-1 text-sm text-gray-600">
              This removes your account and your details. You won't be able to log in again.
            </p>
          </div>
        </div>

        <form onSubmit={openConfirm} noValidate className="mt-6 space-y-4">
          <FormInput
            label="Confirm your password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 sm:w-auto"
          >
            Delete my account
          </button>
        </form>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete your account?"
        message="This can't be undone. Are you sure you want to continue?"
        confirmText="Yes, delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  )
}