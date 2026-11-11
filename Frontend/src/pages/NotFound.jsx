import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function NotFound() {
  const { user, loading } = useAuth()

  if (loading) return null

  let homeLink = '/login'
  let homeText = 'Go to login'

  if (user) {
    homeLink = user.role === 'admin' ? '/admin' : '/dashboard'
    homeText = 'Go to my dashboard'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-light px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={homeLink}
          className="mt-6 inline-block w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark sm:w-auto"
        >
          {homeText}
        </Link>
      </div>
    </div>
  )
}